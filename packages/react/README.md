# Golem React SDK

A collection of React hooks for interacting with the Golem Network.

## Getting started

To add the SDK to your existing react project just install it using your favorite package manager:

```
npm install @golem-sdk/react
yarn add @golem-sdk/react
pnpm add @golem-sdk/react
bun add @golem-sdk/react
```

Then make sure to wrap your app with the `YagnaProvider` component:

```jsx
<YagnaProvider>
  <App />
</YagnaProvider>
```

### Initial Configuration

For the SDK to work properly you need to have a running Yagna instance on your local machine. Please follow the [Yagna installation guide](https://docs.golem.network/docs/creators/javascript/examples/tools/yagna-installation-for-requestors) to install and configure Yagna.

Yagna blocks all requests from external origins by default. To allow the SDK to communicate with it you need start Yagna with `--api-allow-origin='<your-domain>'` flag. For example:

```shell
yagna service run --api-allow-origin='http://localhost:3000'
```

## Demo application

Sometimes it's easier to learn by example. That's why we've created a demo application that uses all the hooks from the SDK. You can find it in the `examples/react-with-vite` directory. To run it locally, first clone the repository, install it's dependencies and build the react package:

```
git clone https://github.com/golemfactory/golem-sdk-react.git
cd golem-sdk-react/
npm install
npm run build
```

Then run the following command to start the demo application:

```
npm run example:vite
```

If you just want to see how the demo application looks like, you can check out the live version [here](https://golem-react-showcase.vercel.app/).

## Features

### `useYagna` - check if you're connected to Yagna and manage the app-key

```jsx
function MyComponent() {
  const { isConnected, appKey, setYagnaOptions } = useYagna();
  const inputRef = useRef(null);
  return (
    <div>
      <div>Connected to Yagna: {isConnected ? "yes" : "no"}</div>
      <input ref={inputRef} />
      <button
        onClick={() => setYagnaOptions({ apiKey: inputRef.current.value })}
      >
        Set app key
      </button>
    </div>
  );
}
```

### `useExecutor` + `useTask` - run a task on the Golem Network

```jsx
function MyTask({ executor }) {
  const { isRunning, error, result, run } = useTask(executor);
  const onClick = () =>
    run(async (exe) => {
      return (await exe.run("echo", ["Hello world!"])).stdout;
    });
  return (
    <div>
      <button onClick={onClick} disabled={isRunning}>
        Run task
      </button>
      {isRunning && <div>Task is running...</div>}
      {error && <div>Task failed due to {error.toString()}</div>}
      {result && <div>Task result: {result}</div>}
    </div>
  );
}

function MyComponent() {
  const {
    executor,
    initialize,
    isInitialized,
    isInitializing,
    terminate,
    error,
  } = useExecutor();
  if (isInitializing) {
    return <div>Initializing executor...</div>;
  }
  if (error) {
    return <div>Error: {error.toString()}</div>;
  }
  if (!isInitialized) {
    return (
      <div>
        <button onClick={initialize}>Initialize executor</button>
      </div>
    );
  }
  return (
    <div>
      <MyTask executor={executor} />
      <button onClick={terminate}>Terminate executor</button>
    </div>
  );
}
```

### `useInvoices` + `useHandleInvoice` - list and handle invoices

```jsx
function Invoice({ invoiceId }) {
  const { acceptInvoice } = useHandleInvoice(invoiceId);

  return (
    <li key={invoice.invoiceId}>
      {invoice.invoiceId} - {invoice.status}
      <button onClick={acceptInvoice} disabled={invoice.status !== "RECEIVED"}>
        Accept
      </button>
    </li>
  );
}

function MyComponent() {
  const { invoices, isLoading, error, refetch } = useInvoices({
    limit: 10,
    statuses: ["RECEIVED"],
    after: new Date("2021-01-01"),
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.toString()}</div>;
  }
  return (
    <div>
      <ul>
        {invoices.map((invoice) => (
          <Invoice key={invoice.invoiceId} invoiceId={invoice.invoiceId} />
        ))}
      </ul>
      <button onClick={refetch}> Refresh </button>
    </div>
  );
}
```

## Developing

If you want to contribute to the SDK, you can clone the repository and install the dependencies:

```shell
git clone https://github.com/golemfactory/golem-sdk-react.git
cd golem-sdk-react/
npm install
```

## Links

- Golem documentation: https://docs.golem.network/
- Repository: https://github.com/golemfactory/golem-sdk-react/
- Issue tracker: https://github.com/golemfactory/golem-sdk-react/issues
  - In case of sensitive bugs like security vulnerabilities, please contact
    contact@golem.network directly instead of using issue tracker. We value your effort to improve the security and privacy of this project!
- Related projects:
  - Golem JavaScript API: https://github.com/golemfactory/golem-js/

## Licensing

The code in this project is licensed under GPL-3.0 license.
