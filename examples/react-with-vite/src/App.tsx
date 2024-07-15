import Navbar from "./header/Navbar";
import React, { useState } from "react";
import RunTaskCard from "./run-task/RunTaskCard";
import { useYagna } from "@golem-sdk/react";
import ConnectToYagna from "./connection/ConnectToYagna";
import InvoicesTab from "./invoices/InvoicesTab";
import { TaskExecutor } from "@golem-sdk/task-executor";

function DEBUGTE({ appkey }: { appkey: string }) {
  const consoleLogger = {
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
    child: () => consoleLogger,
  };

  async function run() {
    const executor = await TaskExecutor.create({
      demand: {
        workload: {
          imageTag: "golem/alpine:latest",
        },
      },
      market: {
        rentHours: 0.5,
        pricing: {
          model: "linear",
          maxStartPrice: 0.5,
          maxCpuPerHourPrice: 1.0,
          maxEnvPerHourPrice: 0.5,
        },
      },
      api: {
        key: appkey,
      },
      logger: consoleLogger,
    });

    try {
      const results = await executor.run(async (exe) => {
        const res1 = await exe.run('echo "Hello"');
        const res2 = await exe.run('echo "World"');
        return `${res1.stdout}${res2.stdout}`;
      });
      console.log(results);
    } catch (err) {
      console.error("An error occurred during execution:", err);
    } finally {
      await executor.shutdown();
    }
  }

  return (
    <button className="btn btn-primary absolute top-4 left-4" onClick={run}>
      DEBUG in console
    </button>
  );
}

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

  const { isConnected, appKey } = useYagna();

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
            <DEBUGTE appkey={appKey!} />
          </>
        )}
      </main>
    </>
  );
}

export default App;
