import { TaskExecutor } from "@golem-sdk/task-executor";
import { useCallback, useState } from "react";

// TODO: expose worker type in @golem-sdk/golem-js
// Import for use in the hook
import { Worker } from "@golem-sdk/golem-js/dist/task";
// Export for use by SDK users
export type { Worker };

/**
 * A hook for managing a single task on the Golem network. To execute a task, call the `run` function with a worker function as an argument.
 *
 * @param executor - The task executor instance to use (see {@link useExecutor}).
 *
 * @returns An object containing the following properties:
 * - `isRunning`: A boolean indicating whether the task is currently running.
 * - `result`: The result of the task, if it has finished running.
 * - `run`: A function that can be called to run the task.
 * - `error`: The error that has occurred - undefined otherwise.
 *
 * @example
 * ```jsx
 * function MyComponent({ executor }) {
 *   const { isRunning, error, result, run } = useTask(executor);
 *   const onClick = () =>
 *     run(async (ctx) => {
 *       return (await ctx.run("echo", ["Hello world!"])).stdout;
 *     });
 *   return (
 *     <div>
 *       <button onClick={onClick} disabled={isRunning}>
 *         Run task
 *       </button>
 *       {isRunning && <div>Task is running...</div>}
 *       {error && <div>Task failed due to: {error}</div>}
 *       {result && <div>Task result: {result}</div>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTask<TData = unknown>(executor: TaskExecutor) {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<TData>();
  const [error, setError] = useState<Error>();

  const run = useCallback(
    async (worker: Worker<TData>) => {
      if (isRunning) {
        throw new Error("Task is already running");
      }

      setIsRunning(true);
      setResult(undefined);

      try {
        const result = await executor.run<TData>(worker);
        setResult(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error(JSON.stringify(err)));
        }
      } finally {
        setIsRunning(false);
      }
    },
    [executor, isRunning],
  );

  return {
    isRunning,
    result,
    run,
    error,
  };
}
