import Navbar from "./header/Navbar";
import React, { useState } from "react";
import RunTaskCard from "./run-task/RunTaskCard";
import InvoicesTable from "./invoices/InvoicesTable";
import DebitNotesTable from "./debit-notes/DebitNotesTable";
import { useYagna } from "@golem-sdk/react";
import ConnectToYagna from "./connection/ConnectToYagna";

function Tab({
  visible,
  children,
}: React.PropsWithChildren<{ visible: boolean }>) {
  return <div className={`${visible ? "" : "hidden"}`}>{children}</div>;
}

function App() {
  const [activeTab, setActiveTab] = useState<
    "run-task" | "invoices" | "debit-notes"
  >("run-task");
  const { isConnected } = useYagna();

  return (
    <>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-grow flex items-center justify-center flex-col">
        {!isConnected ? (
          <ConnectToYagna />
        ) : (
          <>
            <Tab visible={activeTab === "run-task"}>
              <RunTaskCard />
            </Tab>
            <Tab visible={activeTab === "invoices"}>
              <InvoicesTable />
            </Tab>
            <Tab visible={activeTab === "debit-notes"}>
              <DebitNotesTable />
            </Tab>
          </>
        )}
      </main>
    </>
  );
}

export default App;
