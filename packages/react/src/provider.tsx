import React, { createContext, PropsWithChildren } from "react";
import { Yagna } from "@golem-sdk/golem-js";

export interface YagnaContext {
  yagnaOptions: {
    client?: Yagna;
    apiKey: string | null;
    basePath: string;
  };
  swrKey: string;

  setYagnaOptions: (options: {
    apiKey: string | null;
    basePath?: string;
  }) => void;
}
export const yagnaContext = createContext<YagnaContext | undefined>(undefined);

export type YagnaProviderConfig = {
  yagnaAppKey?: string;
  yagnaUrl?: string;
  swrKey?: string;
};

/**
 * Provides context for all hooks that interact with Yagna.
 *
 * @param config - The configuration object for the provider.
 * @param config.yagnaAppKey - The API key for the Yagna client. This is optional and can be set later with `useYagna`
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
  config?: YagnaProviderConfig;
}>) {
  const [options, setOptions] = React.useState<YagnaContext>({
    swrKey: config?.swrKey || "golem-sdk",
    yagnaOptions: {
      apiKey: config?.yagnaAppKey || null,
      basePath: config?.yagnaUrl || "http://127.0.0.1:7465",
      client: config?.yagnaAppKey
        ? new Yagna({
            apiKey: config?.yagnaAppKey,
            basePath: config?.yagnaUrl || "http://127.0.0.1:7465",
          })
        : undefined,
    },
    setYagnaOptions: (options) => {
      setOptions((prev) => {
        const newClient = options.apiKey
          ? new Yagna({
              apiKey: options.apiKey,
              basePath: options.basePath || prev.yagnaOptions.basePath,
            })
          : undefined;
        return {
          ...prev,
          yagnaOptions: {
            ...prev.yagnaOptions,
            ...options,
            client: newClient,
          },
        };
      });
    },
  });

  return (
    <yagnaContext.Provider value={options}>{children}</yagnaContext.Provider>
  );
}
