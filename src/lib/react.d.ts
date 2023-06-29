import React from "react"

declare module "react" {
  interface NamedExoticComponent<P = {}> extends ExoticComponent<P> {
    displayName?: string | undefined;
    fragments?: any;
  }
}
