import { TaskExecutorOptions } from "@golem-sdk/react";

type ExecutorOptionsFormProps = {
  disabled: boolean;
  options: TaskExecutorOptions;
  setOptions: (config: TaskExecutorOptions) => void;
};

export default function ExecutorOptionsForm({
  disabled,
  options,
  setOptions,
}: ExecutorOptionsFormProps) {
  return (
    <form>
      <div className="flex flex-row gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Subnet</span>
          </label>
          <input
            disabled={disabled}
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={options.demand.subnetTag}
            onChange={(e) => {
              setOptions({
                ...options,
                demand: {
                  ...options.demand,
                  subnetTag: e.target.value,
                },
              });
            }}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Network</span>
          </label>
          <input
            disabled={disabled}
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={options.payment?.network}
            onChange={(e) => {
              setOptions({
                ...options,
                payment: {
                  ...options.payment,
                  network: e.target.value,
                },
              });
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="form-control">
          <label className="label">
            <span className="label-text">CPU cores (minimum)</span>
          </label>
          <input
            type="range"
            disabled={disabled}
            min={1}
            max={16}
            value={options.demand.workload?.minCpuCores}
            onChange={(e) => {
              setOptions({
                ...options,
                demand: {
                  ...options.demand,
                  workload: {
                    ...options.demand.workload,
                    minCpuCores: parseInt(e.target.value),
                  },
                },
              });
            }}
            className="range range-primary"
            step={1}
          />
          <div className="grid grid-cols-[repeat(16,minmax(0,1fr))] text-xs place-items-center">
            {Array.from({ length: 16 }, (_, i) => (
              <span key={"option" + i}>{i + 1}</span>
            ))}
          </div>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">CPU threads (minimum)</span>
          </label>
          <input
            type="range"
            disabled={disabled}
            min={1}
            max={16}
            value={options.demand.workload?.minCpuThreads}
            onChange={(e) => {
              setOptions({
                ...options,
                demand: {
                  ...options.demand,
                  workload: {
                    ...options.demand.workload,
                    minCpuThreads: parseInt(e.target.value),
                  },
                },
              });
            }}
            className="range range-primary"
            step={1}
          />
          <div className="grid grid-cols-[repeat(16,minmax(0,1fr))] text-xs place-items-center">
            {Array.from({ length: 16 }, (_, i) => (
              <span key={"option" + i}>{i + 1}</span>
            ))}
          </div>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Gigabytes of RAM (minimum)</span>
          </label>
          <input
            type="range"
            disabled={disabled}
            min={1}
            max={16}
            value={options.demand.workload?.minMemGib}
            onChange={(e) => {
              setOptions({
                ...options,
                demand: {
                  ...options.demand,
                  workload: {
                    ...options.demand.workload,
                    minMemGib: parseInt(e.target.value),
                  },
                },
              });
            }}
            className="range range-primary"
            step={1}
          />
          <div className="grid grid-cols-[repeat(16,minmax(0,1fr))] text-xs place-items-center">
            {Array.from({ length: 16 }, (_, i) => (
              <span key={"option" + i}>{i + 1}</span>
            ))}
          </div>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Min storage (GiB)</span>
          </label>
          <input
            type="range"
            disabled={disabled}
            min={2}
            max={32}
            value={options.demand.workload?.minStorageGib}
            onChange={(e) => {
              setOptions({
                ...options,
                demand: {
                  ...options.demand,
                  workload: {
                    ...options.demand.workload,
                    minStorageGib: parseInt(e.target.value),
                  },
                },
              });
            }}
            className="range range-primary"
            step={2}
          />
          <div className="grid grid-cols-[repeat(16,minmax(0,1fr))] text-xs place-items-center">
            {Array.from({ length: 16 }, (_, i) => (
              <span key={"option" + i}>{2 * (i + 1)}</span>
            ))}
          </div>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-4">
            <span className="label-text">
              Enable logging to the browser console
            </span>
            <input
              type="checkbox"
              disabled={disabled}
              className="toggle"
              checked={options.enableLogging}
              onChange={(e) => {
                setOptions({
                  ...options,
                  enableLogging: e.target.checked,
                });
              }}
            />
          </label>
        </div>
      </div>
    </form>
  );
}
