import * as React from "react"
import {
  StructoCanvasHost
} from "@structoapp/loader-gatsby"
import { graphql } from "gatsby"
import { initStructoLoaderWithRegistrations } from "../structo-init"

export const query = graphql`
  query {
    structoOptions
  }
`


export default function Host({ data }) {
  const { structoOptions } = data
  initStructoLoaderWithRegistrations(structoOptions)
  return <StructoCanvasHost />
}
