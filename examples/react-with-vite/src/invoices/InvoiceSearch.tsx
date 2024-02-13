import { InvoiceSearchParameters } from "@golem-sdk/react";

type InvoiceSearchParametersProps = {
  searchParams: InvoiceSearchParameters;
  setSearchParams: (params: InvoiceSearchParameters) => void;
};

export default function InvoiceSearch({
  searchParams,
  setSearchParams,
}: InvoiceSearchParametersProps) {
  return (
    <div className="flex flex-col gap-1 min-w-[250px] max-w-xs">
      <label className="label cursor-pointer">
        <span className="label-text">Only not accepted</span>
        <input
          type="checkbox"
          className="toggle toggle-sm"
          checked={!!searchParams.statuses}
          onChange={(e) => {
            if (e.target.checked) {
              setSearchParams({
                ...searchParams,
                statuses: ["RECEIVED"],
              });
            } else {
              setSearchParams({
                ...searchParams,
                statuses: undefined,
              });
            }
          }}
        />
      </label>

      <label className="label cursor-pointer">
        <span className="label-text">After date</span>
        <input
          type="checkbox"
          className="toggle toggle-sm"
          checked={searchParams.after !== undefined}
          onChange={(e) =>
            setSearchParams({
              ...searchParams,
              after: e.target.checked
                ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                : undefined,
            })
          }
        />
      </label>
      <input
        type="date"
        placeholder="Type here"
        className="input input-sm w-full max-w-xs"
        disabled={searchParams.after === undefined}
        value={searchParams.after?.toISOString().split("T")[0] || ""}
        onChange={(e) =>
          setSearchParams({
            ...searchParams,
            after: new Date(e.target.value),
          })
        }
      />
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Limit</span>
        </div>
        <input
          type="number"
          value={searchParams.limit || ""}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            setSearchParams({
              ...searchParams,
              limit: isNaN(value) ? undefined : value,
            });
          }}
          pattern="[0-9]*"
          min="1"
          placeholder="Defaults to 50 if unset"
          className="input input-bordered w-full max-w-xs input-sm"
        />
      </label>
      <div className="flex flex-row gap-1">
        <label className="form-control w-full max-w-xs ">
          <div className="label">
            <span className="label-text">Min amount</span>
          </div>
          <input
            type="number"
            value={searchParams.minAmount || 0}
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                minAmount: e.target.value,
              })
            }
            pattern="[0-9]*\.?[0-9]+"
            min="0"
            className="input input-bordered w-full max-w-xs input-sm"
          />
        </label>

        <label className="form-control w-full max-w-xs ">
          <div className="label">
            <span className="label-text">Max amount</span>
          </div>
          <input
            type="number"
            value={searchParams.maxAmount || 999}
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                maxAmount: e.target.value,
              })
            }
            pattern="[0-9]*\.?[0-9]+"
            min="0"
            className="input input-bordered w-full max-w-xs input-sm"
          />
        </label>
      </div>
      <label className="form-control">
        <div className="label">
          <span className="label-text">Provider IDs (one per line)</span>
        </div>
        <textarea
          wrap="off"
          className="textarea textarea-bordered h-16"
          placeholder="Unused if empty"
          onChange={(e) => {
            const value = e.target.value.split("\n").filter(Boolean);
            setSearchParams({
              ...searchParams,
              providerIds: value.length ? value : undefined,
            });
          }}
        ></textarea>
      </label>
      <label className="form-control">
        <div className="label">
          <span className="label-text">Provider wallets (one per line)</span>
        </div>
        <textarea
          wrap="off"
          className="textarea textarea-bordered h-16"
          placeholder="Unused if empty"
          onChange={(e) => {
            const value = e.target.value.split("\n").filter(Boolean);
            setSearchParams({
              ...searchParams,
              providerWallets: value.length ? value : undefined,
            });
          }}
        ></textarea>
      </label>
      <label className="form-control">
        <div className="label">
          <span className="label-text">Payment platform</span>
        </div>
        <textarea
          wrap="off"
          className="textarea textarea-bordered h-16"
          placeholder="Unused if empty"
          onChange={(e) => {
            const value = e.target.value.split("\n").filter(Boolean);
            setSearchParams({
              ...searchParams,
              paymentPlatforms: value.length ? value : undefined,
            });
          }}
        ></textarea>
      </label>
      <label className="form-control">
        <div className="label">
          <span className="label-text">Invoice IDs (one per line)</span>
        </div>
        <textarea
          wrap="off"
          className="textarea textarea-bordered h-16"
          placeholder="If set all other filters will be ignored"
          onChange={(e) => {
            const value = e.target.value.split("\n").filter(Boolean);
            setSearchParams({
              ...searchParams,
              invoiceIds: value.length ? value : undefined,
            });
          }}
        ></textarea>
      </label>
    </div>
  );
}
