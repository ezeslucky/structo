

```ts
// @public (undocumented)
export interface StructoRemoteChangeListener {
  // (undocumented)
  onError?: (data: any) => void;
  // (undocumented)
  onPublish?: (projectId: string, version: string) => void;
  // (undocumented)
  onUpdate?: (projectId: string, revision: number) => void;
}

// @public (undocumented)
export class StructoRemoteChangeWatcher {
  constructor(opts: {
    projects: {
      id: string;
      token: string;
    }[];
    host?: string;
  });
  // (undocumented)
  subscribe(watcher: StructoRemoteChangeListener): () => void;
  // (undocumented)
  unsubscribe(watcher: StructoRemoteChangeListener): void;
}

// (No @packageDocumentation comment for this package)
```
