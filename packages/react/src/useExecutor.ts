import { ExecutorOptions, TaskExecutor } from "@golem-sdk/golem-js";
import { useConfig } from "./useConfig";
import { useState, useCallback } from "react";
export { TaskExecutor };

function beforeUnloadHandler(e: BeforeUnloadEvent) {
  e.preventDefault();
  e.returnValue = "";
}

function registerBeforeUnloadHandler() {
  window.addEventListener("beforeunload", beforeUnloadHandler);
}

function removeBeforeUnloadHandler() {
  window.removeEventListener("beforeunload", beforeUnloadHandler);
}

interface ExtraOptions {
  addBeforeUnloadHandler?: boolean;
}

/**
 * A hook that provides a task executor instance and related state.
 *
 * @param options - The options to use when creating the task executor. See {@link ExecutorOptions} for details.
 * @param extraOptions - Additional options to configure the hook.
 * @param extraOptions.addBeforeUnloadHandler - Whether to add a beforeunload event listener to prevent the user from accidentally closing the page while the executor is running. Defaults to `true`.
 *
 * @returns An object containing the task executor instance, initialization and termination functions, and related state.
 */
export function useExecutor(
  options: ExecutorOptions,
  { addBeforeUnloadHandler = true }: ExtraOptions = {},
) {
  const [executor, setExecutor] = useState<TaskExecutor | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isTerminating, setIsTerminating] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const config = useConfig();
  const isInitialized = !!executor;

  const initialize = useCallback(async () => {
    if (isInitialized || isInitializing) {
      throw new Error("Executor is already initialized");
    }

    setIsInitializing(true);

    try {
      if (addBeforeUnloadHandler) {
        registerBeforeUnloadHandler();
      }
      const executor = await TaskExecutor.create({
        yagnaOptions: {
          apiKey: config.yagnaOptions.apiKey,
          basePath: config.yagnaOptions.basePath,
        },
        logger: {
          log: (msg) => console.log(msg),
          info: (msg) => console.log(msg),
          warn: (msg) => console.log(msg),
          error: (msg) => console.log(msg),
          debug: (msg) => console.log(msg),
          level: "debug",
          setLevel: (level) => console.log(level),
        },
        enableLogging: false,
        ...options,
      });
      setExecutor(executor);
      setError(null);
    } catch (e) {
      setError(e);
      removeBeforeUnloadHandler();
    } finally {
      setIsInitializing(false);
    }
  }, [config.yagnaOptions.apiKey, config.yagnaOptions.basePath, options]);

  const terminate = useCallback(async () => {
    removeBeforeUnloadHandler();
    if (executor && !isTerminating) {
      setIsTerminating(true);
      await executor.end();
      setExecutor(null);
      setIsTerminating(false);
    }
  }, [executor, setExecutor, setIsTerminating]);

  return {
    executor,
    isInitializing,
    error,
    initialize,
    terminate,
    isInitialized,
    isTerminating,
  };
}
