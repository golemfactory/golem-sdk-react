import { useYagna } from "@golem-sdk/react";

interface NavbarProps {
  activeTab: "run-task" | "invoices" | "debit-notes";
  setActiveTab: (tab: "run-task" | "invoices" | "debit-notes") => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const { isConnected, reconnect, isLoading, error } = useYagna();

  return (
    <header className="navbar bg-base-100">
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
              Run Task
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
              Invoices
            </a>
          </li>
          <li>
            <a
              className={`${
                activeTab === "debit-notes"
                  ? "text-primary font-bold"
                  : "text-base-content"
              }`}
              onClick={() => setActiveTab("debit-notes")}
            >
              Debit Notes
            </a>
          </li>
        </ul>
      </div>
      <div className="navbar-end flex gap-4">
        {error && <span className="badge badge-error">{`${error}`}</span>}
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
