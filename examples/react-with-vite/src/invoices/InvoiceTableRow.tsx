import Decimal from "decimal.js";
import { InvoiceStatus, useHandleInvoice } from "@golem-sdk/react";
import { toast } from "react-toastify";
import Copy from "./Copy";
interface InvoiceItemProps {
  id: string;
  price: Decimal;
  issuedAt: Date;
  status: InvoiceStatus;
  providerId: string;
  providerWallet: string;
  platform: string;
  onAction?: () => void;
}

function truncateAddress(str: string) {
  if (str.length <= 6) return str;
  return `${str.slice(0, 6)}...${str.slice(-4)}`;
}

export default function InvoiceTableRow({
  id,
  price,
  issuedAt,
  status,
  providerId,
  providerWallet,
  platform,
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
    <tr className={status === "RECEIVED" ? "bg-red-100" : ""}>
      <td>
        <span className="flex flex-row gap-1 items-center">
          {truncateAddress(id)}
          <Copy value={id} />
        </span>
      </td>
      <td>{price.toFixed(5)} GLM</td>
      <td>
        {issuedAt.toLocaleDateString()}
        <br />
        {issuedAt.toLocaleTimeString()}
      </td>
      <td>{status}</td>
      <td>
        <span className="flex flex-row gap-1 items-center">
          {truncateAddress(providerId)}
          <Copy value={providerId} />
        </span>
      </td>
      <td>
        <span className="flex flex-row gap-1 items-center">
          {truncateAddress(providerWallet)}
          <Copy value={providerWallet} />
        </span>
      </td>
      <td>{platform}</td>
      <td>
        <button
          onClick={acceptInvoice}
          disabled={status !== "RECEIVED" || isAccepted}
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
