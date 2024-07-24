import { useCallback } from "react";
import { useConfig } from "./useConfig";
import useSwr from "swr";

/**
 * A hook that provides information about the Yagna connection status.
 * @returns An object containing the following properties:
 * - `isConnected`: A boolean indicating whether the Yagna is connected.
 * - `reconnect`: A function that can be called to manually reconnect to Yagna.
 * - `isLoading`: A boolean indicating whether the hook is currently loading.
 * - `error`: An error object containing information about any errors that occurred while fetching the Yagna connection status.
 * @example
 * ```jsx
 * function MyComponent() {
 *  const { isConnected, appKey, setYagnaOptions } = useYagna();
 *  const inputRef = useRef(null);
 *  return (
 *    <div>
 *      <div>Connected to Yagna: {isConnected ? "yes" : "no"}</div>
 *      <input ref={inputRef} />
 *      <button onClick={() => setYagnaOptions({apiKey: inputRef.current.value})}>
 *        Set app key
 *      </button>
 *    </div>
 *  );
 * }
 * ```
 */
export function useYagna() {
  const {
    yagnaOptions,
    swrKey,
    setYagnaOptions: setInternalYagnaOptions,
  } = useConfig();

  const { isLoading, error, mutate } = useSwr(
    [swrKey, "yagna-connection-status", yagnaOptions],
    async () => {
      if (!yagnaOptions.client) {
        throw new Error("Cannot connect to Yagna, provide an app key.");
      }
      return yagnaOptions.client.identity.getIdentity();
    },
    {
      refreshInterval: 3000, // ping yagna every 3 seconds to check if it's still connected
      revalidateOnFocus: false,
      loadingTimeout: 3000, // if yagna doesn't respond within 3 seconds, consider it disconnected
    },
  );

  const setYagnaOptions = useCallback(
    (options: { apiKey?: string | null; basePath?: string }) => {
      setInternalYagnaOptions({
        apiKey:
          options.apiKey === undefined ? yagnaOptions.apiKey : options.apiKey,
        basePath:
          options.basePath === undefined
            ? yagnaOptions.basePath
            : options.basePath,
      });
    },
    [setInternalYagnaOptions, yagnaOptions],
  );

  const isAppKeySet = !!yagnaOptions.apiKey;

  return {
    isConnected: !error && !isLoading,
    reconnect: mutate,
    isLoading,
    error,
    setYagnaOptions,
    isAppKeySet,
    appKey: yagnaOptions.apiKey,
    basePath: yagnaOptions.basePath,
  };
}
