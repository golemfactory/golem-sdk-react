import useSwr, { SWRConfiguration } from "swr";
import { useConfig } from "./useConfig";
import { withGlm } from "./helpers";

export type InvoiceStatus =
  | "ISSUED"
  | "RECEIVED"
  | "ACCEPTED"
  | "REJECTED"
  | "FAILED"
  | "SETTLED"
  | "CANCELLED";

export type InvoiceSearchParameters = {
  after?: Date;
  limit?: number;
  statuses?: string[];
  providerIds?: string[];
  minAmount?: string | number;
  maxAmount?: string | number;
  providerWallets?: string[];
  invoiceIds?: string[];
  paymentPlatforms?: string[];
};

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
 *   const { invoices, isLoading, error, refetch } = useInvoices({
 *     limit: 10,
 *     statuses: ["RECEIVED"],
 *     after: new Date("2021-01-01"),
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
  swrConfig,
  ...searchParameters
}: InvoiceSearchParameters & {
  swrConfig?: SWRConfiguration;
} = {}) {
  const { swrKey, yagnaOptions } = useConfig();
  const { data, isLoading, isValidating, error, mutate } = useSwr(
    [swrKey, "invoices", searchParameters, yagnaOptions],
    async () => {
      return withGlm(yagnaOptions, async (glm) => {
        const invoiceProcessor = glm.payment.createInvoiceProcessor();
        if (searchParameters.invoiceIds) {
          return Promise.all(
            searchParameters.invoiceIds.map((id) =>
              invoiceProcessor.fetchSingleInvoice(id),
            ),
          );
        }
        return invoiceProcessor.collectInvoices(searchParameters);
      });
    },
    {
      keepPreviousData: true,
      ...swrConfig,
    },
  );
  return {
    invoices: data,
    isLoading,
    isValidating,
    error,
    refetch: mutate,
  };
}
