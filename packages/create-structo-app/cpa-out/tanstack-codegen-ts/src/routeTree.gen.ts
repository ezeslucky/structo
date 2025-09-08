
import { Route as rootRouteImport } from './routes/__root'
import { Route as StructoHostRouteImport } from './routes/structo-host'
import { Route as IndexRouteImport } from './routes/index'
import { Route as DynamicSlugIndexRouteImport } from './routes/dynamic/$slug/index'

const StructoHostRoute = StructoHostRouteImport.update({
  id: '/structo-host',
  path: '/structo-host',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const DynamicSlugIndexRoute = DynamicSlugIndexRouteImport.update({
  id: '/dynamic/$slug/',
  path: '/dynamic/$slug/',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/structo-host': typeof StructoHostRoute
  '/dynamic/$slug': typeof DynamicSlugIndexRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/structo-host': typeof StructoHostRoute
  '/dynamic/$slug': typeof DynamicSlugIndexRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/structo-host': typeof StructoHostRoute
  '/dynamic/$slug/': typeof DynamicSlugIndexRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/structo-host' | '/dynamic/$slug'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/structo-host' | '/dynamic/$slug'
  id: '__root__' | '/' | '/structo-host' | '/dynamic/$slug/'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  StructoHostRoute: typeof StructoHostRoute
  DynamicSlugIndexRoute: typeof DynamicSlugIndexRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/structo-host': {
      id: '/structo-host'
      path: '/structo-host'
      fullPath: '/structo-host'
      preLoaderRoute: typeof StructoHostRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/dynamic/$slug/': {
      id: '/dynamic/$slug/'
      path: '/dynamic/$slug'
      fullPath: '/dynamic/$slug'
      preLoaderRoute: typeof DynamicSlugIndexRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  StructoHostRoute: StructoHostRoute,
  DynamicSlugIndexRoute: DynamicSlugIndexRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
