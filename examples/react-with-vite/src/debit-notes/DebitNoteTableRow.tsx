import Decimal from "decimal.js";
import { InvoiceStatus, useHandleDebitNote } from "@golem-sdk/react";
import { toast } from "react-toastify";

interface DebitNoteTableRowProps {
  id: string;
  amountDue: Decimal;
  issuedAt: Date;
  status: InvoiceStatus;
  onAction?: () => void;
}

export default function DebitNoteTableRow({
  id,
  amountDue,
  issuedAt,
  status,
  onAction,
}: DebitNoteTableRowProps) {
  const { acceptDebitNote, isAccepted, isLoading } = useHandleDebitNote(id, {
    onAccepted: () => {
      toast("Debit note accepted 💸", { type: "success" });
      onAction?.();
    },
    onRejected: () => {
      toast("There was an error while accepting debit note 😢", {
        type: "error",
      });
      onAction?.();
    },
  });

  return (
    <tr>
      <td>{id}</td>
      <td>{amountDue.toFixed(5)} GLM</td>
      <td>{issuedAt.toLocaleString("pl")}</td>
      <td>{`${status}`}</td>
      <td>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => acceptDebitNote()}
          disabled={status !== InvoiceStatus.Received || isAccepted}
        >
          {isLoading ? (
            <span className="loading loading-spinner" />
          ) : isAccepted ? (
            "Accepted!"
          ) : (
            "Accept"
          )}
        </button>
      </td>
    </tr>
  );
}
