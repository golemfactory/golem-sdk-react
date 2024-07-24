export type SelectedAllocationType =
  | {
      type: "auto";
    }
  | {
      type: "new";
      budget: number;
      expiration: number;
    }
  | {
      type: "load";
      id: string;
    };

export default function AllocationForm({
  value,
  onChange,
  disabled = false,
}: {
  value: SelectedAllocationType;
  onChange: (value: SelectedAllocationType) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-4">
          <input
            type="radio"
            disabled={disabled}
            name="radio-10"
            className="radio checked:bg-primary"
            checked={value.type === "auto"}
            onChange={() => onChange({ type: "auto" })}
          />
          <span className="label-text">
            Estimate the best allocation automatically
          </span>
        </label>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-4">
          <input
            type="radio"
            disabled={disabled}
            name="radio-10"
            className="radio checked:bg-primary"
            checked={value.type === "new"}
            onChange={() =>
              onChange({ type: "new", budget: 1, expiration: 15 * 60 })
            }
          />
          <span className="label-text">Create a new allocation</span>
        </label>
      </div>
      {value.type === "new" && (
        <div className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Budget</span>
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="0.00"
              className="input input-bordered input-sm"
              defaultValue={1}
              onChange={(e) =>
                onChange({
                  type: "new",
                  budget: parseFloat(e.target.value),
                  expiration: value.expiration,
                })
              }
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Expiration (seconds)</span>
            </label>
            <input
              type="number"
              step="1"
              placeholder="0"
              className="input input-bordered  input-sm"
              defaultValue={15 * 60}
              onChange={(e) =>
                onChange({
                  type: "new",
                  budget: value.budget,
                  expiration: parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>
      )}

      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-4">
          <input
            type="radio"
            disabled={disabled}
            name="radio-10"
            className="radio checked:bg-primary"
            checked={value.type === "load"}
            onChange={() => onChange({ type: "load", id: "" })}
          />
          <span className="label-text">
            Load an existing allocation from ID
          </span>
        </label>
      </div>
      {value.type === "load" && (
        <div className="form-control flex-row">
          <label className="label">
            <span className="label-text">Allocation ID</span>
          </label>
          <input
            type="text"
            placeholder=""
            className="input input-bordered input-sm"
            onChange={(e) =>
              onChange({
                type: "load",
                id: e.target.value,
              })
            }
          />
        </div>
      )}
    </div>
  );
}
