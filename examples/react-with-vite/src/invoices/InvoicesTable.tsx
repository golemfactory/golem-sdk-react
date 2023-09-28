import { useInvoices } from "@golem-sdk/react";
import InvoiceTableRow from "./InvoiceTableRow";
import Decimal from "decimal.js";
import { useRef, useState } from "react";

export default function InvoicesTable() {
  const [after, setAfter] = useState<string | undefined>();
  const prevAfter = useRef<string[]>([]);

  const { invoices, isLoading, error, refetch } = useInvoices({
    after,
    limit: 10,
  });

  if (invoices) {
    invoices.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Invoices (oldest to newest)</h2>
        <div className="overflow-x-auto min-h-[500px] min-w-[800px]">
          <table className="table table-pin-rows">
            <thead>
              <tr>
                <th>Id</th>
                <th>Amount</th>
                <th>Issued at</th>
                <th>Status</th>
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
                    onAction={() => {
                      refetch();
                    }}
                  />
                ))}
            </tbody>
          </table>
          {error && <p className="badge badge-error">{`${error}`}</p>}
        </div>
        <div className="flex flex-grow items-center justify-center">
          {isLoading ? (
            <span className="loading loading-bars loading-lg"></span>
          ) : (
            <div className="join">
              <button
                className="join-item btn"
                disabled={!after}
                onClick={() => {
                  if (prevAfter.current.length > 0) {
                    setAfter(prevAfter.current.pop()!);
                  } else {
                    setAfter(undefined);
                  }
                }}
              >
                «
              </button>
              <button
                className="join-item btn"
                disabled={!invoices || invoices.length < 10}
                onClick={() => {
                  if (!invoices) {
                    return;
                  }

                  if (after) {
                    prevAfter.current.push(after);
                  }
                  setAfter(invoices[invoices.length - 1].timestamp);
                }}
              >
                »
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
