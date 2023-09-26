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
 *  const { isConnected, reconnect, isLoading, error } = useYagna();
 *  if (isLoading) {
 *    return <div>Loading...</div>;
 *  }
 *  return (
 *    <div>
 *      <div>Yagna is {isConnected ? "connected" : "disconnected"}</div>
 *      <button onClick={reconnect} disabled={!isConnected}>Reconnect</button>
 *      {error && <div>Error: {error.toString()}</div>}
 *    </div>
 *  );
 * }
 * ```
 */
export function useYagna() {
  const { yagnaClient, swrKey } = useConfig();

  const { isLoading, error, mutate } = useSwr(
    [swrKey, "yagna-connection-status"],
    async () => {
      return yagnaClient.getApi().identity.getIdentity();
    },
    {
      refreshInterval: 3000, // ping yagna every 3 seconds to check if it's still connected
      revalidateOnFocus: false,
      loadingTimeout: 3000, // if yagna doesn't respond within 3 seconds, consider it disconnected
    },
  );

  return {
    isConnected: !error && !isLoading,
    reconnect: mutate,
    isLoading,
    error,
  };
}
