import useSwr, { SWRConfiguration } from "swr";
import { useConfig } from "./useConfig";
import { yaPayment } from "ya-ts-client";

export const InvoiceStatus = yaPayment.InvoiceStatus;
export type InvoiceStatus = yaPayment.InvoiceStatus;

/**
 * A hook that fetches invoices from the Yagna API.
 *
 * @param options - An object containing optional parameters for the hook.
 * @param options.after - A string representing the cursor to start fetching invoices from.
 * @param options.limit - A number representing the maximum number of invoices to fetch.
 * @param options.swrConfig - An object containing optional configuration options for the underlying SWR hook.
 * @returns An object containing the fetched invoices, loading and error states, and a function to refetch the data.
 * @example
 * ```jsx
 * function MyComponent() {
 *   const { invoices, isLoading, error, refetch } = useInvoices();
 *   if (isLoading) {
 *     return <div>Loading...</div>;
 *   }
 *   if (error) {
 *     return <div>Error: {error.toString()}</div>;
 *   }
 *   return (
 *     <div>
 *       <ul>
 *         {invoices.map((invoice) => (
 *           <li key={invoice.invoiceId}>
 *             {invoice.invoiceId} - {invoice.status}
 *           </li>
 *         ))}
 *       </ul>
 *       <button onClick={refetch}> Refresh </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useInvoices({
  after,
  limit,
  swrConfig,
}: {
  after?: string;
  limit?: number;
  swrConfig?: SWRConfiguration;
} = {}) {
  const { yagnaClient, swrKey } = useConfig();
  const { data, isLoading, isValidating, error, mutate } = useSwr(
    [swrKey, "invoices", after, limit],
    async () => {
      return yagnaClient
        .getApi()
        .payment.getInvoices(after, limit)
        .then((response) => response.data);
    },
    {
      keepPreviousData: true,
      ...swrConfig,
    }
  );
  return {
    invoices: data,
    isLoading,
    isValidating,
    error,
    refetch: mutate,
  };
}
