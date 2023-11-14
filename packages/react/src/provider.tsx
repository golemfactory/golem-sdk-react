import React, { createContext, PropsWithChildren } from "react";
import { Yagna } from "@golem-sdk/golem-js";

export interface YagnaContext {
  yagnaClient: Yagna;
  yagnaOptions: {
    apiKey: string;
    basePath: string;
  };
  swrKey: string;
}
export const yagnaContext = createContext<YagnaContext | undefined>(undefined);

export type YagnaProviderConfig = {
  yagnaAppKey: string;
  yagnaUrl?: string;
  swrKey?: string;
};

/**
 * Provides context for all hooks that interact with Yagna.
 *
 * @param config - The configuration object for the provider.
 * @param config.yagnaAppKey - The API key for the Yagna client. This is required.
 * @param config.yagnaUrl - The base URL for the Yagna client. This is optional and defaults to "http://127.0.0.1:7465".
 * @param config.swrKey - The key used to prefix all SWR cache keys. This is optional and defaults to "golem-sdk".
 *
 * @example
 * ```
 * <YagnaProvider config={{ yagnaAppKey: "myApiKey", yagnaUrl: "http://localhost:7465" }}>
 *   <App />
 * </YagnaProvider>
 * ```
 */
export function YagnaProvider({
  children,
  config,
}: PropsWithChildren<{
  config: YagnaProviderConfig;
}>) {
  const yagnaClient = new Yagna({
    apiKey: config.yagnaAppKey,
    basePath: config.yagnaUrl,
  });

  return (
    <yagnaContext.Provider
      value={{
        yagnaClient,
        yagnaOptions: {
          apiKey: config.yagnaAppKey,
          basePath: config.yagnaUrl || "http://127.0.0.1:7465",
        },
        swrKey: config.swrKey || "golem-sdk",
      }}
    >
      {children}
    </yagnaContext.Provider>
  );
}
