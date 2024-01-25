import { InvoiceSearchParameters } from "@golem-sdk/react";
import { useState } from "react";
import InvoiceSearch from "./InvoiceSearch";
import InvoicesTable from "./InvoicesTable";

export default function InvoicesTab() {
  const [searchParams, setSearchParams] = useState<InvoiceSearchParameters>({
    after: undefined,
    limit: 25,
    statuses: undefined,
    providerIds: undefined,
    minAmount: undefined,
    maxAmount: undefined,
    providerWallets: undefined,
    invoiceIds: undefined,
  });

  return (
    <div className="bg-base-100 overflow-hidden w-full h-full p-6 pr-0">
      <h2 className="text-3xl font-bold">Search invoices</h2>
      <div className="flex flex-row max-h-full gap-4 overflow-hidden">
        <div className="overflow-y-auto px-1 pt-4">
          <InvoiceSearch
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </div>
        <div className="overflow-x-auto overflow-y-scroll flex-1">
          <InvoicesTable searchParameters={searchParams} />
        </div>
      </div>
    </div>
  );
}
