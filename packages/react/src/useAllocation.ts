import { Allocation, CreateAllocationParams } from "@golem-sdk/golem-js";
import { useCallback, useEffect, useState } from "react";
import { useConfig } from "./useConfig";
import { withGlm } from "./helpers";

/**
 * Custom hook for managing an allocation. You can either provide an ID of an existing
 * allocation to load it, or create a new one.
 *
 * @example Create a new allocation:
 * ```jsx
 * const { allocation, create, isLoading } = useAllocation();
 * if (isLoading) {
 *   return <p>Loading...</p>;
 * }
 * if (allocation) {
 *   return <div>Allocation created: {allocation.id}</div>;
 * }
 * return (
 *   <button onClick={() => create({
 *     budget: 1,
 *     expirationSec: 15 * 60
 *   })}>Create a new allocation</button>
 * )
 * ```
 * @example Load an existing allocation:
 * ```jsx
 * const { allocation, isLoading } = useAllocation("some-allocation-id");
 * if (isLoading) {
 *   return <p>Loading...</p>;
 * }
 * if (allocation) {
 *   return <div>Allocation loaded: {allocation.id}</div>;
 * }
 * ```
 * @param id - The ID of the allocation to load (optional).
 * @returns An object containing the allocation, create, release, error, and isLoading properties.
 */
export function useAllocation(id?: string) {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(!!id); // if there is an id we're going to load the allocation immediately
  const [allocation, setAllocation] = useState<Allocation | null>(null);
  const { yagnaOptions } = useConfig();

  const load = useCallback(
    async (id: string) => {
      if (isLoading) {
        throw new Error("Cannot load an allocation right now.");
      }
      setIsLoading(true);
      return withGlm(yagnaOptions, async (glm) => {
        try {
          const allocation = await glm.payment.getAllocation(id);
          setAllocation(allocation);
          setError(null);
          return { allocation, success: true };
        } catch (err) {
          if (err instanceof Error) {
            setError(err);
          } else {
            setError(new Error(JSON.stringify(err)));
          }
          return { success: false };
        } finally {
          setIsLoading(false);
        }
      });
    },
    [isLoading, yagnaOptions.apiKey, yagnaOptions.basePath],
  );

  useEffect(() => {
    if (!id) {
      return;
    }
    const ac = new AbortController();
    withGlm(yagnaOptions, (glm) =>
      glm.payment
        .getAllocation(id)
        .then((allocation) => {
          if (ac.signal.aborted) {
            return;
          }
          setAllocation(allocation);
          setError(null);
          setIsLoading(false);
        })
        .catch((err) => {
          if (ac.signal.aborted) {
            return;
          }
          setError(err);
          setIsLoading(false);
        }),
    );
    return () => {
      ac.abort();
    };
  }, [id, yagnaOptions.apiKey, yagnaOptions.basePath]);

  const create = useCallback(
    async (params: CreateAllocationParams) => {
      if (isLoading) {
        throw new Error("Cannot create a new allocation right now.");
      }
      setIsLoading(true);
      return withGlm(yagnaOptions, async (glm) => {
        try {
          const allocation = await glm.payment.createAllocation(params);
          setAllocation(allocation);
          setError(null);
          return { allocation, success: true };
        } catch (err) {
          if (err instanceof Error) {
            setError(err);
          } else {
            setError(new Error(JSON.stringify(err)));
          }
          return { success: false };
        } finally {
          setIsLoading(false);
        }
      });
    },
    [isLoading, yagnaOptions.apiKey, yagnaOptions.basePath],
  );

  const release = useCallback(async () => {
    if (!allocation) {
      throw new Error("No allocation to release!");
    }
    if (isLoading) {
      throw new Error("Cannot release the allocation right now.");
    }
    setIsLoading(true);
    await withGlm(yagnaOptions, async (glm) => {
      try {
        await glm.payment.releaseAllocation(allocation);
        setAllocation(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error(JSON.stringify(err)));
        }
      } finally {
        setIsLoading(false);
      }
    });
  }, [allocation, yagnaOptions.apiKey, yagnaOptions.basePath]);

  const resetHook = useCallback(() => {
    if (isLoading) {
      throw new Error("Cannot reset the allocation right now.");
    }
    setAllocation(null);
    setError(null);
  }, [isLoading]);

  return { allocation, create, release, error, isLoading, load, resetHook };
}
