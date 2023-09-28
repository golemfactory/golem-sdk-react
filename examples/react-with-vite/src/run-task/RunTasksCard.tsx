import { useExecutor } from "@golem-sdk/react";
import ImageClassification from "./ImageClassification";

export default function RunTaskCard() {
  const {
    executor,
    initialize,
    error,
    isInitialized,
    isInitializing,
    terminate,
    isTerminating,
  } = useExecutor({
    package: "117430deb26f19aeea5da164ea33bdb3e7c3e3fd840403882e0c2920",
    enableLogging: false,
  });

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body justify-between">
        {!isInitialized && (
          <>
            <h2 className="card-title">Let's initialize a new Task Executor</h2>
            <div className="card-actions justify-center pt-4">
              <button
                onClick={() => {
                  initialize();
                }}
                className="btn btn-primary"
                disabled={isInitializing}
              >
                {isInitializing ? "Initializing..." : "Initialize"}
              </button>
            </div>
          </>
        )}

        {!!error && (
          <p className="text-red-500">Something went wrong when initializing</p>
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
