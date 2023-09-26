import { useContext } from "react";
import { yagnaContext } from "./provider";

/**
 * Returns the configuration object from the nearest `YagnaProvider` component in the component tree.
 * @throws {Error} If used outside the `YagnaProvider` component.
 * @internal
 */
export function useConfig() {
  const config = useContext(yagnaContext);
  if (!config) {
    throw new Error("`useConfig` must be used within a `YagnaProvider`");
  }
  return config;
}
