import { useYagna } from "@golem-sdk/react";
import { useRef } from "react";

export default function ConnectToYagna() {
  const { reconnect, appKey, setAppKey, unsetAppKey } = useYagna();
  const appKeyInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="card max-w-3xl">
      <div className="card-body">
        <h2 className="card-title text-3xl">Not connected to yagna</h2>
        <p className="pb-8">
          Make sure yagna is running on your local machine. Please follow the
          instructions in this{" "}
          <a
            className="link"
            target="_blank"
            href="https://docs.golem.network/docs/creators/javascript/examples/tools/yagna-installation-for-requestors"
          >
            quickstart
          </a>{" "}
          to learn more about how to install and run yagna.
        </p>
        <h3 className="font-bold text-lg">
          1. Start yagna on your local machine
        </h3>
        <p>
          Make sure to include the flag <code>{`--api-allow-origin`}</code> with
          the url of this app:
        </p>

        <div className="mockup-code">
          <pre data-prefix="$">
            <code>
              {`yagna service run --api-allow-origin='${window.location.origin}'`}
            </code>
          </pre>
        </div>
        <h3 className="font-bold text-lg">2. Set the app-key</h3>
        <div className="flex flex-row items-center gap-1">
          <input
            className="input input-bordered input-xl"
            placeholder="Yagna app-here here"
            defaultValue={appKey || ""}
            ref={appKeyInputRef}
          />
          <button
            className="btn btn-primary btn-xl min-w-0"
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
        <div className="card-actions justify-end items-center">
          <button className="btn" onClick={() => reconnect()}>
            Try reconnecting now
          </button>
        </div>
      </div>
    </div>
  );
}
