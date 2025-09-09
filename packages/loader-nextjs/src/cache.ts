import { LoaderBundleOutput } from "@structoapp/loader-core";
import type { InitOptions } from "@structoapp/loader-react/react-server-conditional";
import type * as Watcher from "@structoapp/watcher";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import path from "path";
import { serverRequire, serverRequireFs } from "./server-require";
import type { NextInitOptions } from "./shared-exports";

class FileCache {
  constructor(private filePath: string) {}

  async get() {
    const fs = await serverRequireFs();
    try {
      await fs.promises.mkdir(path.dirname(this.filePath), { recursive: true });
      const data = (await fs.promises.readFile(this.filePath)).toString();
      return JSON.parse(data);
    } catch {
      return undefined;
    }
  }

  async set(data: LoaderBundleOutput) {
    const fs = await serverRequireFs();
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify(data));
    } catch (err) {
      console.warn(`Error writing to Structo cache: ${err}`);
    }
  }

  async clear() {
    const fs = await serverRequireFs();
    try {
      await fs.promises.unlink(this.filePath);
    } catch (err) {
      // noop
    }
  }
}

function hashString(str: string) {
  let h = 0,
    i = 0;
  for (; i < str.length; h &= h) h = 31 * h + str.charCodeAt(i++);
  return Math.abs(h);
}

function makeCache(opts: InitOptions) {
  const cacheDir = path.resolve(process.cwd(), ".next", ".structo");
  const cachePath = path.join(
    cacheDir,
    `structo-${hashString(
      [...opts.projects.map((p) => `${p.id}@${p.version ?? ""}`)]
        .sort()
        .join("-")
    )}${opts.preview ? "-preview" : ""}-cache.json`
  );
  return new FileCache(cachePath);
}

export function initStructoLoaderWithCache<
  T extends {
    clearCache(): void;
  }
>(
  initFn: (opts: InitOptions) => T,
  { nextNavigation, ...opts }: NextInitOptions
): T {
  const isBrowser = typeof window !== "undefined";
  const isProd = process.env.NODE_ENV === "production";
  const isBuildPhase = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;
  const cache = isBrowser || isProd ? undefined : makeCache(opts);
  const loader = initFn({
    onClientSideFetch: "warn",
    ...opts,
    cache,
    platform: "nextjs",
    platformOptions: {
      nextjs: {
        appDir: !!nextNavigation,
      },
    },
    alwaysFresh: !isBuildPhase && !isBrowser,
  });

  if (!isProd) {
    const stringOpts = JSON.stringify(opts);

    if (process.env.STRUCTO_OPTS && process.env.STRUCTO_OPTS !== stringOpts) {
      console.warn(
        `STRUCTO: We detected that you created a new StructoLoader with different configurations. You may need to restart your dev server.\n`
      );
    }

    process.env.STRUCTO_OPTS = stringOpts;
  }

  if (cache) {
    if (!isProd) {
      if (process.env.STRUCTO_WATCHED !== "true") {
        (async () => {
          process.env.STRUCTO_WATCHED = "true";
          console.log(`Subscribing to Structo changes...`);

          // Import using serverRequire, so webpack doesn't bundle us into client bundle
          try {
            const StructoRemoteChangeWatcher = (
              await serverRequire<typeof Watcher>("@structoapp/watcher")
            ).StructoRemoteChangeWatcher;
            const watcher = new StructoRemoteChangeWatcher({
              projects: opts.projects,
              host: opts.host,
            });

            const clearCache = () => {
              cache.clear();
              loader.clearCache();
            };

            watcher.subscribe({
              onUpdate: () => {
                if (opts.preview) {
                  clearCache();
                }
              },
              onPublish: () => {
                if (!opts.preview) {
                  clearCache();
                }
              },
            });
          } catch (e) {
            console.warn("Couldn't subscribe to Structo changes", e);
          }
        })();
      }
    } else {
      cache.clear();
      loader.clearCache();
    }
  }
  return loader;
}
