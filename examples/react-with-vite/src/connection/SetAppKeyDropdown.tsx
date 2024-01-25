import { useYagna } from "@golem-sdk/react";
import { useRef } from "react";

export default function SetAppKeyDropdown() {
  const { appKey, setAppKey, unsetAppKey } = useYagna();
  const appKeyInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn m-1">
        Set Yagna AppKey
      </div>
      <div
        tabIndex={0}
        className="card compact dropdown-content z-[1] shadow bg-base-100 rounded-box"
      >
        <div tabIndex={0} className="card-body">
          <div className="flex flex-row items-center gap-1">
            <input
              className="input input-bordered input-sm"
              placeholder="App key"
              defaultValue={appKey || ""}
              ref={appKeyInputRef}
            />
            <button
              className="btn btn-primary btn-sm min-w-0"
              onClick={() => {
                const newAppKey = appKeyInputRef.current?.value || null;
                if (newAppKey) {
                  setAppKey(newAppKey);
                } else {
                  unsetAppKey();
                }
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
