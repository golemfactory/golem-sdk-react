import {
  TaskExecutorOptions,
  useAllocation,
  useExecutor,
} from "@golem-sdk/react";
import ImageClassification from "./ImageClassification";
import { useState } from "react";
import ExecutorOptionsForm from "./ExecutorConfigForm";
import AllocationForm, { SelectedAllocationType } from "./AllocationForm";
import { Allocation } from "@golem-sdk/golem-js";

export default function RunTaskCard() {
  const [allocationType, setAllocationType] = useState<SelectedAllocationType>({
    type: "auto",
  });

  const [executorOptions, setExecutorOptions] = useState<TaskExecutorOptions>({
    demand: {
      workload: {
        imageTag: "golem/example-image-classifier:latest",
        minCpuCores: 2,
        minMemGib: 4,
        minCpuThreads: 2,
        minStorageGib: 8,
      },
      subnetTag: "public",
    },
    market: {
      rentHours: 0.5,
      pricing: {
        model: "linear",
        maxStartPrice: 0.5,
        maxCpuPerHourPrice: 1.0,
        maxEnvPerHourPrice: 0.5,
      },
    },
    payment: {
      network: "holesky",
    },
    enableLogging: false,
    task: {
      maxParallelTasks: 1,
    },
  });

  const {
    executor,
    initialize,
    error: taskExecutorError,
    isInitialized,
    isInitializing,
    terminate,
    isTerminating,
  } = useExecutor();

  const {
    create,
    load,
    error: allocationError,
    isLoading: isAllocationLoading,
    resetHook: resetAllocationHook,
  } = useAllocation();

  const initializeExecutorWithAllocation = async () => {
    if (isInitializing || isInitialized || isAllocationLoading) {
      return;
    }
    resetAllocationHook();
    if (allocationType.type === "auto") {
      await initialize(executorOptions);
      return;
    }
    if (allocationType.type === "new") {
      const { success, allocation } = await create({
        budget: allocationType.budget,
        expirationSec: allocationType.expiration,
      });
      if (!success) {
        return;
      }
      await initialize({
        ...executorOptions,
        payment: {
          ...executorOptions.payment,
          allocation: allocation as Allocation | undefined, // TODO: Fix typings in TE
        },
      });
    }
    if (allocationType.type === "load") {
      const { success, allocation } = await load(allocationType.id);
      if (!success) {
        return;
      }
      await initialize({
        ...executorOptions,
        payment: {
          ...executorOptions.payment,
          allocation: allocation as Allocation | undefined, // TODO: Fix typings in TE
        },
      });
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl max-w-4xl">
      <div className="card-body justify-between">
        {!isInitialized && (
          <>
            <div className="flex flex-row gap-4">
              <div>
                <h2 className="card-title">
                  What kind of machine do you need?
                </h2>
                <ExecutorOptionsForm
                  options={executorOptions}
                  setOptions={setExecutorOptions}
                  disabled={isInitializing || isAllocationLoading}
                />
              </div>
              <div>
                <h2 className="card-title">How do you want to pay?</h2>
                <AllocationForm
                  value={allocationType}
                  onChange={setAllocationType}
                  disabled={isInitializing || isAllocationLoading}
                />
              </div>
            </div>
            <div className="card-actions justify-end pt-4">
              <button
                onClick={initializeExecutorWithAllocation}
                className="btn btn-primary"
                disabled={isInitializing || isAllocationLoading}
              >
                {isInitializing ? "Initializing..." : "Initialize"}
              </button>
            </div>
          </>
        )}

        {(!!taskExecutorError || !!allocationError) && (
          <p className="text-red-500">
            {taskExecutorError?.message || allocationError?.message}
          </p>
        )}

        {isInitialized && executor && (
          <>
            <h2 className="card-title max-w-sm pb-4">
              Upload an image and classify what's in it with Golem !
            </h2>
            <ImageClassification executor={executor} disabled={isTerminating} />
            <button
              onClick={() => {
                terminate();
              }}
              className="btn btn-error"
              disabled={isTerminating}
            >
              {isTerminating ? (
                <>
                  <span className="loading loading-spinner"></span>
                  <span>Terminating...</span>
                </>
              ) : (
                "Terminate executor and pay"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
