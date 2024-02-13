import { useYagna } from "@golem-sdk/react";
import SetYagnaOptionsButton from "../connection/SetYagnaOptionsButton";

interface NavbarProps {
  activeTab: "run-task" | "invoices";
  setActiveTab: (tab: "run-task" | "invoices") => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const { isConnected, reconnect, isLoading } = useYagna();

  return (
    <header className="navbar bg-base-100 border-b-2 h-4">
      <div className="navbar-start">
        <span className="btn btn-ghost normal-case text-xl">
          Golem + React = 😻
        </span>
      </div>
      <div className="navbar-center flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a
              className={`${
                activeTab === "run-task"
                  ? "text-primary font-bold"
                  : "text-base-content"
              }`}
              onClick={() => setActiveTab("run-task")}
            >
              Run a simple Task
            </a>
          </li>
          <li>
            <a
              className={`${
                activeTab === "invoices"
                  ? "text-primary font-bold"
                  : "text-base-content"
              }`}
              onClick={() => setActiveTab("invoices")}
            >
              Search your invoice history
            </a>
          </li>
        </ul>
      </div>
      <div className="navbar-end flex gap-4">
        {isConnected && <SetYagnaOptionsButton />}
        <button
          className="btn "
          onClick={() => {
            reconnect();
          }}
        >
          {isConnected
            ? "🟢 Connected to Yagna"
            : isLoading
            ? "🟡 Connecting..."
            : "🔴 Connect to Yagna"}
        </button>
      </div>
    </header>
  );
}
