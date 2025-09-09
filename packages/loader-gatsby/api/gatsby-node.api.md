

```ts

import { GatsbyNode } from 'gatsby';
import { InitOptions } from '@structoapp/loader-react';
import { PluginOptions } from 'gatsby';

// @public (undocumented)
export const createPages: GatsbyNode["createPages"];

// @public (undocumented)
export const createResolvers: GatsbyNode["createResolvers"];

// @public (undocumented)
export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"];

// @public (undocumented)
export type GatsbyPluginOptions = PluginOptions & InitOptions & {
    defaultStructoPage?: string;
    ignorePaths?: string[];
};

// @public (undocumented)
export const onPreInit: GatsbyNode["onPreInit"];

// @public (undocumented)
export const sourceNodes: GatsbyNode["sourceNodes"];

// (No @packageDocumentation comment for this package)

```
