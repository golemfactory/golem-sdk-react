import { useState } from "react";
import { useDebitNotes } from "@golem-sdk/react";
import Decimal from "decimal.js";
import DebitNoteTableRow from "./DebitNoteTableRow";

export default function DebitNotesTable() {
  const [limit, setLimit] = useState(10);

  const { debitNotes, refetch, isLoading, error } = useDebitNotes({
    limit,
  });

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title flex justify-between">
          Debit Notes (from newest to oldest)
          <button className="btn btn-ghost" onClick={() => refetch()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z" />
            </svg>
          </button>
        </h2>
        <div className="overflow-x-auto h-[500px] min-w-[800px]">
          <table className="table table-pin-rows">
            <thead>
              <tr>
                <th>Id</th>
                <th>Amount due</th>
                <th>Issued at</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {!!debitNotes &&
                debitNotes.map((debitNote) => (
                  <DebitNoteTableRow
                    key={debitNote.debitNoteId}
                    id={debitNote.debitNoteId}
                    amountDue={new Decimal(debitNote.totalAmountDue)}
                    issuedAt={new Date(debitNote.timestamp)}
                    status={debitNote.status}
                  />
                ))}
            </tbody>
          </table>
          {error && <span className="badge badge-error">{`${error}`}</span>}
        </div>
        <div className="flex flex-grow items-center justify-center">
          {isLoading ? (
            <span className="loading loading-bars loading-lg"></span>
          ) : (
            <button
              className="btn btn-outline btn-primary"
              onClick={() => setLimit((prev) => prev + 10)}
            >
              Load more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
