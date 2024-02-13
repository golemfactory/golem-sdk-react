import { useYagna } from "@golem-sdk/react";
import { useRef } from "react";

interface SetYagnaOptionsDropdownProps {
  onClose?: () => void;
}

export default function SetYagnaOptionsDropdown({
  onClose,
}: SetYagnaOptionsDropdownProps) {
  const { appKey, basePath, setYagnaOptions } = useYagna();
  const appKeyInputRef = useRef<HTMLInputElement>(null);
  const basePathInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div
        className="fixed h-screen w-screen top-0 left-0 z-10 bg-[#00000010]"
        onClick={() => onClose?.()}
      ></div>
      <div className="dropdown dropdown-end dropdown-open">
        <div className="card compact dropdown-content z-20 shadow bg-base-100 rounded-box">
          <div className="card-body">
            <div className="flex flex-col items-end gap-1">
              <input
                className="input input-bordered input-sm"
                placeholder="App key"
                defaultValue={appKey || ""}
                ref={appKeyInputRef}
              />
              <input
                className="input input-bordered input-sm"
                placeholder="Yagna url"
                defaultValue={basePath || "http://127.0.0.1:7465"}
                ref={basePathInputRef}
              />
              <button
                className="btn btn-primary btn-sm min-w-0"
                onClick={() => {
                  const newAppKey = appKeyInputRef.current?.value || null;
                  const newBasePath = basePathInputRef.current?.value || "";
                  setYagnaOptions({
                    apiKey: newAppKey,
                    basePath: newBasePath,
                  });
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
