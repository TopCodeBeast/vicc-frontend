import React from "react"

declare module "react" {
  function forwardRef<T, P = {}>(render: ForwardRefRenderFunction<T, P>): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>> & {
    fragments: any
  };
}
