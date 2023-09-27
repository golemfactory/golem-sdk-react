import { useCallback, useState } from "react";
import { useConfig } from "./useConfig";

interface Options {
  onAccepted?: () => void;
  onRejected?: () => void;
  allocationTimeoutMs?: number;
}

/**
 * A hook that handles the acceptance of a debit note.
 * @param debitNote - The debit note to be accepted.
 * @param options - An optional object containing the following properties:
 * @param options.onAccepted: A function to be called when the debit note is accepted (for example to show a success message to the user).
 * @param options.onRejected: A function to be called when the debit note is rejected (for example to show an error message to the user).
 * @param options.allocationTimeoutMs: The timeout for the allocation in milliseconds (defaults to 60 seconds).
 * @returns An object containing the following properties:
 *   - acceptDebitNote: A function that accepts the debit note.
 *   - isLoading: A boolean indicating whether the hook is currently loading.
 *   - isError: A boolean indicating whether an error occurred while accepting the debit note.
 *   - isAccepted: A boolean indicating whether the debit note was accepted.
 */
export function useHandleDebitNote(
  debitNote: string,
  { onAccepted, onRejected, allocationTimeoutMs = 60_000 }: Options = {},
) {
  const { yagnaClient } = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsError(false);
    setIsAccepted(false);
  }, []);

  const acceptDebitNote = useCallback(async () => {
    if (isLoading) {
      return;
    }
    reset();
    setIsLoading(true);
    try {
      const debitNoteDetails = await yagnaClient
        .getApi()
        .payment.getDebitNote(debitNote)
        .then((res) => res.data);
      const allocation = {
        totalAmount: debitNoteDetails.totalAmountDue,
        paymentPlatform: debitNoteDetails.paymentPlatform,
        address: debitNoteDetails.payerAddr,
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
      await yagnaClient.getApi().payment.acceptDebitNote(debitNote, {
        allocationId,
        totalAmountAccepted: debitNoteDetails.totalAmountDue,
      });
      setIsAccepted(true);
      onAccepted?.();
    } catch (e) {
      setIsError(true);
      onRejected?.();
    } finally {
      setIsLoading(false);
    }
  }, [debitNote, isLoading, onAccepted, onRejected, reset, yagnaClient]);

  return {
    acceptDebitNote,
    isLoading,
    isError,
    isAccepted,
  };
}
