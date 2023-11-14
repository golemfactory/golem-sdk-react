import { useCallback, useState } from "react";
import { useConfig } from "./useConfig";

interface Options {
  onAccepted?: () => void;
  onRejected?: () => void;
  allocationTimeoutMs?: number;
}

/**
 * A hook for handling the payment of an invoice.
 *
 * @param invoice - ID of the invoice to be handled.
 * @param options - An object containing the following optional properties:
 * @param options.onAccepted - A callback function to be called when the invoice is accepted (for example to show a success message to the user)
 * @param options.onRejected - A callback function to be called when the invoice is rejected (for example to show an error message to the user)
 * @param options.allocationTimeoutMs - The timeout for the allocation in milliseconds (defaults to 60 seconds)
 *
 * @returns An object containing the following properties:
 * - acceptInvoice: A function to accept the invoice.
 * - isLoading: A boolean indicating whether the hook is currently loading.
 * - error: Error that occurred while handling the invoice.
 * - isAccepted: A boolean indicating whether the invoice was accepted.
 * - reset: A function to reset the state of the hook (isLoading, error, isAccepted)
 */
export function useHandleInvoice(
  invoice: string,
  { onAccepted, onRejected, allocationTimeoutMs = 60_000 }: Options = {},
) {
  const { yagnaClient } = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [error, setError] = useState<Error>();

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(undefined);
    setIsAccepted(false);
  }, []);

  const acceptInvoice = useCallback(async () => {
    if (isLoading) {
      return;
    }
    reset();
    setIsLoading(true);
    try {
      const invoiceDetails = await yagnaClient
        .getApi()
        .payment.getInvoice(invoice)
        .then((res) => res.data);
      const allocation = {
        totalAmount: invoiceDetails.amount,
        paymentPlatform: invoiceDetails.paymentPlatform,
        address: invoiceDetails.payerAddr,
        timestamp: new Date().toISOString(),
        timeout: new Date(Date.now() + allocationTimeoutMs).toISOString(),
        makeDeposit: false,
        remainingAmount: "",
        spentAmount: "",
        allocationId: "",
      };
      const { allocationId } = await yagnaClient
        .getApi()
        .payment.createAllocation(allocation)
        .then((res) => res.data);
      await yagnaClient.getApi().payment.acceptInvoice(invoice, {
        allocationId,
        totalAmountAccepted: invoiceDetails.amount,
      });
      setIsAccepted(true);
      onAccepted?.();
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error(JSON.stringify(err)));
      }
      onRejected?.();
    } finally {
      setIsLoading(false);
    }
  }, [invoice, isLoading, onAccepted, onRejected, reset, yagnaClient]);

  return {
    acceptInvoice,
    isLoading,
    isAccepted,
    reset,
    error,
  };
}
