import * as StructoQuery from "@structoapp/query";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as jsxDevRuntime from "react/jsx-dev-runtime";
import * as jsxRuntime from "react/jsx-runtime";
import { registerRenderErrorListener, setStructoRootNode } from "./canvas-host";
import * as hostModule from "./exports";
import { setRepeatedElementFn } from "./repeatedElement";
//@ts-ignore
import { hostVersion } from "./version";

export * from "./exports";

const root = globalThis as any;

if (root.__Sub == null) {
  
  root.__Sub = {
    React,
    ReactDOM,
    jsxRuntime,
    jsxDevRuntime,
    StructoQuery,
    hostModule,
    //@ts-ignore
    hostVersion,
    hostUtils: {
      setStructoRootNode,
      registerRenderErrorListener,
      setRepeatedElementFn,
    },

    // For backwards compatibility:
    setStructoRootNode,
    registerRenderErrorListener,
    setRepeatedElementFn,
    ...hostModule,
  };
} else {
  console.warn(
    //@ts-ignore
    `Encountered likely duplicate host version:
    ${root.__Sub.hostVersion} vs ${hostVersion}`
  );
  root.__Sub.duplicateHostVersions = root.__Sub.duplicateHostVersions ?? [];
  //@ts-ignore
  root.__Sub.duplicateHostVersions.push(hostVersion);
}
