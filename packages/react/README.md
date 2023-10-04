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
<YagnaProvider
  config={{ yagnaAppKey: "myApiKey", yagnaUrl: "http://localhost:7465" }}
>
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

Then create a `.env` file in the `examples/react-with-vite` directory with the following content:

```
YAGNA_APP_KEY=<your-yagna-app-key>
```

Finally, run the demo application:

```
npm run example:vite
```

## Features

### `useYagna` - check if you're connected to Yagna

```jsx
function MyComponent() {
  const { isConnected, reconnect, isLoading, error } = useYagna();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <div>Yagna is {isConnected ? "connected" : "disconnected"}</div>
      <button onClick={reconnect} disabled={!isConnected}>
        Reconnect
      </button>
      {error && <div>Error: {error.toString()}</div>}
    </div>
  );
}
```

### `useExecutor` + `useTask` - run a task on the Golem Network

```jsx
function MyTask({ executor }) {
  const { isRunning, isError, result, run } = useTask(executor);
  const onClick = () =>
    run(async (ctx) => {
      return (await ctx.run("echo", ["Hello world!"])).stdout;
    });
  return (
    <div>
      <button onClick={onClick} disabled={isRunning}>
        Run task
      </button>
      {isRunning && <div>Task is running...</div>}
      {isError && <div>Task failed</div>}
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
  const { invoices, isLoading, error, refetch } = useInvoices();
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

### `useDebitNotes` + `useHandleDebitNote` - list and handle debit notes

```jsx
function DebitNote({ debitNoteId }) {
  const { acceptDebitNote } = useHandleDebitNote();

  return (
    <li key={debitNoteId}>
      {debitNoteId} - {debitNote.status}
      <button
        onClick={acceptDebitNote}
        disabled={debitNote.status !== "RECEIVED"}
      >
        Accept
      </button>
    </li>
  );
}

function MyComponent() {
  const { debitNotes, isLoading, error, refetch } = useDebitNotes();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.toString()}</div>;
  }
  return (
    <div>
      <ul>
        {debitNotes.map((debitNote) => (
          <DebitNote
            key={debitNote.debitNoteId}
            debitNoteId={debitNote.debitNoteId}
          />
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
