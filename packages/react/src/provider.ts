import { createContext, PropsWithChildren, createElement } from "react";
import { Yagna } from "@golem-sdk/golem-js";

interface GolemContext {
  yagnaClient: Yagna;
  yagnaOptions: {
    apiKey: string;
    basePath: string;
  };
}
export const golemContext = createContext<GolemContext | undefined>(undefined);

export type GolemProviderConfig = {
  yagnaUrl?: string;
  yagnaAppKey: string;
};

/**
 * Provides context for all Golem hooks.
 * @param config - The configuration object for the provider.
 * @param config.yagnaAppKey - The API key for the Yagna client. This is required.
 * @param config.yagnaUrl - The base URL for the Yagna client. This is optional and defaults to "http://127.0.0.1:7465".
 * @example
 * ```
 * <GolemProvider config={{ yagnaAppKey: "myApiKey", yagnaUrl: "http://localhost:7465" }}>
 *   <App />
 * </GolemProvider>
 * ```
 */
export function GolemProvider({
  children,
  config,
}: PropsWithChildren<{
  config: GolemProviderConfig;
}>) {
  const yagnaClient = new Yagna({
    apiKey: config.yagnaAppKey,
    basePath: config.yagnaUrl,
  });

  return createElement(golemContext.Provider, {
    children,
    value: {
      yagnaClient,
      yagnaOptions: {
        apiKey: config.yagnaAppKey,
        basePath: config.yagnaUrl || "http://127.0.0.1:7465",
      },
    },
  });
}
