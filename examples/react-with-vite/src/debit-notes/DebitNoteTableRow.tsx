import Decimal from "decimal.js";
import { InvoiceStatus } from "@golem-sdk/react";

interface DebitNoteTableRowProps {
  id: string;
  amountDue: Decimal;
  issuedAt: Date;
  status: InvoiceStatus;
}

export default function DebitNoteTableRow({
  id,
  amountDue,
  issuedAt,
  status,
}: DebitNoteTableRowProps) {
  return (
    <tr>
      <td>{id}</td>
      <td>{amountDue.toFixed(5)} GLM</td>
      <td>{issuedAt.toLocaleString("pl")}</td>
      <td>{`${status}`}</td>
    </tr>
  );
}
