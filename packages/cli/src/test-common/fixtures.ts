/// <reference types="@types/jest" />
import L from "lodash";
import { MockProject } from "../__mocks__/api";
import { SyncArgs } from "../actions/sync";
import { StructoConfig, ProjectConfig } from "../utils/config-utils";
import { TempRepo } from "../utils/test-utils";

jest.mock("../api");

export const mockApi = require("../api");
export let opts: SyncArgs; // Options to pass to sync
export let tmpRepo: TempRepo;

export const defaultStructoJson: StructoConfig = {
  platform: "react",
  code: {
    lang: "ts",
    scheme: "blackbox",
    reactRuntime: "classic",
  },
  style: {
    scheme: "css",
    defaultStyleCssFilePath: "structo/PP__structo__default_style.css",
  },
  images: {
    scheme: "inlined",
  },
  tokens: {
    scheme: "theo",
    tokensFilePath: "structo-tokens.theo.json",
  },
  srcDir: "src/",
  defaultStructoDir: "./structo",
  projects: [],
  globalVariants: {
    variantGroups: [],
  },
  wrapPagesWithGlobalContexts: true,
  cliVersion: "0.1.44",
};
export function standardTestSetup(includeDep = true) {
  process.env.STRUCTO_DISABLE_AUTH_SEARCH = "1";

  // Setup server-side mock data
  const project1: MockProject = {
    projectId: "projectId1",
    branchName: "main",
    projectApiToken: "abc",
    version: "1.2.3",
    projectName: "project1",
    components: [
      {
        id: "buttonId",
        name: "Button",
      },
      {
        id: "containerId",
        name: "Container",
      },
    ],
    dependencies: includeDep
      ? {
          dependencyId1: "2.3.4",
        }
      : {},
  };
  const dependency: MockProject = {
    projectId: "dependencyId1",
    branchName: "main",
    projectApiToken: "def",
    version: "2.3.4",
    projectName: "dependency1",
    components: [
      {
        id: "depComponentId",
        name: "DepComponent",
      },
    ],
    dependencies: {},
  };
  [project1, dependency].forEach((p) => mockApi.addMockProject(p));

  // Setup client-side directory
  tmpRepo = new TempRepo();
  tmpRepo.writeStructoAuth({
    host: "http://localhost:3003",
    user: "yang@structo.app",
    token: "faketoken",
  });
  tmpRepo.writeStructoJson(defaultStructoJson);

  // Default opts and config
  opts = {
    projects: [],
    yes: true,
    force: true,
    nonRecursive: false,
    skipUpgradeCheck: true,
    forceOverwrite: true,
    config: tmpRepo.structoJsonPath(),
    auth: tmpRepo.structoAuthPath(),
    baseDir: process.cwd(),
  };
}

export function standardTestTeardown() {
  tmpRepo.destroy();
  mockApi.clear();
  delete process.env["STRUCTO_DISABLE_AUTH_SEARCH"];
}

export function expectProject1Components() {
  // Check correct files exist
  const button = mockApi.stringToMockComponent(
    tmpRepo.getComponentFileContents("projectId1", "buttonId")
  );
  const container = mockApi.stringToMockComponent(
    tmpRepo.getComponentFileContents("projectId1", "containerId")
  );
  expect(button).toBeTruthy();
  expect(container).toBeTruthy();
  expect(button?.name).toEqual("Button");
  expect(button?.version).toEqual("1.2.3");
  expect(container?.name).toEqual("Container");
  expect(container?.version).toEqual("1.2.3");
}

export const project1Config: ProjectConfig = {
  projectId: "projectId1",
  projectName: "Project 1",
  projectBranchName: "main",
  version: "latest",
  cssFilePath: "structo/PP__demo.css",
  components: [
    {
      id: "buttonId",
      name: "Button",
      type: "managed",
      projectId: "projectId1",
      renderModuleFilePath: "structo/project_id_1/StructoButton.tsx",
      importSpec: {
        modulePath: "Button.tsx",
      },
      cssFilePath: "structo/StructoButton.css",
      scheme: "blackbox",
      componentType: "component",
    },
  ],
  icons: [],
  images: [],
  indirect: false,
  globalContextsFilePath: "",
  splitsProviderFilePath: "",
  styleTokensProviderFilePath: "",
  projectModuleFilePath: "",
};

export function expectProject1StructoJson(optional?: {
  [k in keyof ProjectConfig]?: boolean;
}) {
  const structoJson = tmpRepo.readStructoJson();
  expect(structoJson.projects.length).toEqual(1);
  const projectConfig = structoJson.projects[0];
  if (!optional?.projectApiToken) {
    expect(projectConfig.projectApiToken).toBe("abc");
  }
  expect(projectConfig.components.length).toEqual(2);
  const componentNames = projectConfig.components.map((c) => c.name);
  expect(componentNames).toContain("Button");
  expect(componentNames).toContain("Container");
}

export function expectProjectAndDepStructoJson() {
  const structoJson = tmpRepo.readStructoJson();
  expect(structoJson.projects.length).toEqual(2);
  const projectConfigMap = L.keyBy(structoJson.projects, (p) => p.projectId);
  expect(projectConfigMap["projectId1"]).toBeTruthy();
  expect(projectConfigMap["dependencyId1"]).toBeTruthy();
  const projectComponentNames = projectConfigMap["projectId1"].components.map(
    (c) => c.name
  );
  const depComponentNames = projectConfigMap["dependencyId1"].components.map(
    (c) => c.name
  );
  expect(projectComponentNames).toContain("Button");
  expect(projectComponentNames).toContain("Container");
  expect(depComponentNames).toContain("DepComponent");
}
