import { useInvoices, InvoiceSearchParameters } from "@golem-sdk/react";
import InvoiceTableRow from "./InvoiceTableRow";
import Decimal from "decimal.js";

export default function InvoicesTable({
  searchParameters,
}: {
  searchParameters: InvoiceSearchParameters;
}) {
  const { invoices, isLoading, error, refetch } = useInvoices({
    ...searchParameters,
    swrConfig: { keepPreviousData: false },
  });

  return (
    <table className="table table-fixed table-pin-rows mb-8">
      <thead>
        <tr>
          <th>Id</th>
          <th>Amount</th>
          <th>Issued at</th>
          <th>Status</th>
          <th>Provider ID</th>
          <th>Provider wallet</th>
          <th>Platform</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {invoices &&
          invoices.map((invoice) => (
            <InvoiceTableRow
              key={invoice.invoiceId}
              id={invoice.invoiceId}
              price={new Decimal(invoice.amount)}
              issuedAt={new Date(invoice.timestamp)}
              status={invoice.status}
              providerId={invoice.issuerId}
              providerWallet={invoice.payeeAddr}
              platform={invoice.paymentPlatform}
              onAction={() => {
                refetch();
              }}
            />
          ))}
        {invoices && invoices.length === 0 && (
          <tr>
            <td colSpan={8} className="text-center">
              No invoices found
            </td>
          </tr>
        )}
        {error && (
          <tr>
            <td colSpan={8} className="text-center">
              <span className="badge badge-error">{`${error}`}</span>
            </td>
          </tr>
        )}
        {isLoading && (
          <tr>
            <td colSpan={8} className="text-center">
              <div className="loading loading-dots loading-lg"></div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
