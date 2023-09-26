import { TaskExecutor } from "@golem-sdk/golem-js";
import React from "react";

// TODO: expose worker type in @golem-sdk/golem-js
type Worker = Parameters<TaskExecutor["run"]>[0];
export type { Worker };

/**
 * A hook for managing a single task on the Golem network. To execute a task, call the `run` function with a worker function as an argument.
 *
 * @param executor - The task executor instance to use (see {@link useExecutor}).
 *
 * @returns An object containing the following properties:
 * - `isRunning`: A boolean indicating whether the task is currently running.
 * - `isError`: A boolean indicating whether an error occurred while running the task.
 * - `result`: The result of the task, if it has finished running.
 * - `run`: A function that can be called to run the task.
 *
 * @example
 * ```jsx
 * function MyComponent({ executor }) {
 *   const { isRunning, isError, result, run } = useTask(executor);
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
 *       {isError && <div>Task failed</div>}
 *       {result && <div>Task result: {result}</div>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTask(executor: TaskExecutor) {
  const [isRunning, setIsRunning] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [result, setResult] = React.useState<unknown>();

  const run = React.useCallback(
    async (worker: Worker) => {
      if (isRunning) {
        throw new Error("Task is already running");
      }
      setIsRunning(true);
      setIsError(false);
      setResult("");

      try {
        const result = await executor.run(worker);
        setResult(result);
      } catch (e) {
        setIsError(true);
      } finally {
        setIsRunning(false);
      }
    },
    [executor, isRunning],
  );

  return {
    isRunning,
    isError,
    result,
    run,
  };
}
