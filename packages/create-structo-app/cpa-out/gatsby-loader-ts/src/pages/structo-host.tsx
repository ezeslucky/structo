import * as React from "react"
import {
  StructoCanvasHost, InitOptions
} from "@structoapp/loader-gatsby"
import { graphql } from "gatsby"
import { initStructoLoaderWithRegistrations } from "../structo-init"

export const query = graphql`
  query {
    structoOptions
  }
`

interface HostProps {
  data: {
    structoOptions: InitOptions;
  }
}

export default function Host({ data }: HostProps) {
  const { structoOptions } = data
  initStructoLoaderWithRegistrations(structoOptions)
  return <StructoCanvasHost />
}
