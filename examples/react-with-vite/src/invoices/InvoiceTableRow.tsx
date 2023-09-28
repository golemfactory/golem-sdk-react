import Decimal from "decimal.js";
import { InvoiceStatus } from "@golem-sdk/react";

interface InvoiceItemProps {
  id: string;
  price: Decimal;
  issuedAt: Date;
  status: InvoiceStatus;
}

export default function InvoiceTableRow({
  id,
  price,
  issuedAt,
  status,
}: InvoiceItemProps) {
  return (
    <tr>
      <td>{id}</td>
      <td>{price.toFixed(5)} GLM</td>
      <td>{issuedAt.toLocaleString("pl")}</td>
      <td>{`${status}`}</td>
    </tr>
  );
}
