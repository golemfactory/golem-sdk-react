import Decimal from "decimal.js";
import { InvoiceStatus, useHandleInvoice } from "@golem-sdk/react";
import { toast } from "react-toastify";
interface InvoiceItemProps {
  id: string;
  price: Decimal;
  issuedAt: Date;
  status: InvoiceStatus;
  onAction?: () => void;
}

export default function InvoiceTableRow({
  id,
  price,
  issuedAt,
  status,
  onAction,
}: InvoiceItemProps) {
  const { acceptInvoice, isAccepted, isLoading } = useHandleInvoice(id, {
    onAccepted: () => {
      toast(`Invoice accepted! 💸`, { type: "success" });
      onAction?.();
    },
    onRejected: () => {
      toast(`There was an error accepting the invoice 😥`, {
        type: "error",
      });
      onAction?.();
    },
  });
  return (
    <tr>
      <td>{id}</td>
      <td>{price.toFixed(5)} GLM</td>
      <td>{issuedAt.toLocaleString("pl")}</td>
      <td>{`${status}`}</td>
      <td>
        <button
          onClick={acceptInvoice}
          disabled={status !== InvoiceStatus.Received || isAccepted}
          className="btn btn-primary btn-sm"
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
