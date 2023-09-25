import { useContext } from "react";
import { golemContext } from "./provider";

/**
 * Returns the configuration object from the nearest `GolemProvider` component in the component tree.
 * @throws {Error} If used outside the `GolemProvider` component.
 * @internal
 */
export function useConfig() {
  const config = useContext(golemContext);
  if (!config) {
    throw new Error("`useConfig` must be used within a `GolemProvider`");
  }
  return config;
}
