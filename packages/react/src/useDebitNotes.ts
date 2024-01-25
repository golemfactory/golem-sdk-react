import useSWR, { SWRConfiguration } from "swr";
import { useConfig } from "./useConfig";

/**
 * A hook that fetches debit notes from the Yagna API and returns them along with
 * loading, validation, and error states. Note that the API always sorts debit
 * notes by timestamp descending, so the `debitNotes` array will always be sorted
 * from newest to oldest.
 *
 * @param {Object} options - Options for the hook.
 * @param {number} [options.limit] - The maximum number of debit notes to fetch.
 * @param {SWRConfiguration} [options.swrConfig] - Configuration options for the underlying SWR hook.
 * @returns An object containing the fetched debit notes, loading and validation states, error state, and a function to refetch the data.
 *
 * @example
 * ```jsx
 * function MyComponent() {
 *   const [limit, setLimit] = useState(10);
 *   const { debitNotes, isLoading, error, refetch } = useDebitNotes({
 *     limit,
 *   });
 *   if (isLoading) {
 *     return <div>Loading...</div>;
 *   }
 *   if (error) {
 *     return <div>Error: {error.toString()}</div>;
 *   }
 *   return (
 *     <div>
 *       <ul>
 *         {debitNotes.map((debitNote) => (
 *           <li key={debitNote.debitNoteId}>
 *             {debitNote.debitNoteId} - {debitNote.status}
 *           </li>
 *         ))}
 *       </ul>
 *       <button onClick={() => setLimit(limit + 10)}> Load more </button>
 *       <button onClick={refetch}> Refresh </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useDebitNotes({
  limit,
  swrConfig,
}: {
  limit?: number;
  swrConfig?: SWRConfiguration;
} = {}) {
  const {
    yagnaOptions: { client: yagnaClient },
    swrKey,
  } = useConfig();

  const { data, isLoading, isValidating, error, mutate } = useSWR(
    [swrKey, "debit-notes", limit, yagnaClient],
    async () => {
      if (!yagnaClient) {
        throw new Error(
          "Connection to Yagna is not established, use `useYagna` hook to set the app key and connect.",
        );
      }
      return (
        yagnaClient
          .getApi()
          // timestampAfter argument is irrelevant because the
          // API always sorts by timestamp descending
          // TODO: fix when API is fixed
          .payment.getDebitNotes(undefined, limit)
          .then((response) => response.data)
      );
    },
    {
      keepPreviousData: true,
      ...swrConfig,
    },
  );

  return {
    debitNotes: data,
    isLoading,
    isValidating,
    error,
    refetch: mutate,
  };
}
