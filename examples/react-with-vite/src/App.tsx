import Navbar from "./header/Navbar";
import React, { useState } from "react";
import RunTaskCard from "./run-task/RunTaskCard";
import { useYagna } from "@golem-sdk/react";
import ConnectToYagna from "./connection/ConnectToYagna";
import InvoicesTab from "./invoices/InvoicesTab";

function Tab({
  visible,
  children,
}: React.PropsWithChildren<{ visible: boolean }>) {
  return (
    <div
      className={`${
        visible
          ? "flex-1 flex justify-center items-center overflow-hidden"
          : "hidden"
      }`}
    >
      {children}
    </div>
  );
}

function App() {
  if (
    !window.location.hash ||
    !["run-task", "invoices"].includes(window.location.hash.slice(1))
  ) {
    window.location.hash = "run-task";
  }
  const [activeTab, _setActiveTab] = useState<"run-task" | "invoices">(
    (window.location.hash.slice(1) as "run-task" | "invoices") || "run-task",
  );
  const setActiveTab = (tab: "run-task" | "invoices") => {
    window.location.hash = tab;
    _setActiveTab(tab);
  };

  const { isConnected } = useYagna();

  return (
    <>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex items-center justify-center flex-col overflow-hidden">
        {!isConnected ? (
          <ConnectToYagna />
        ) : (
          <>
            <Tab visible={activeTab === "run-task"}>
              <RunTaskCard />
            </Tab>
            <Tab visible={activeTab === "invoices"}>
              <InvoicesTab />
            </Tab>
          </>
        )}
      </main>
    </>
  );
}

export default App;
