# Golem React SDK monorepo root

This repository contains the source code of the Golem React SDK as well as an example application showcasing its usage.

## @golem-sdk/react documentation

The documentation for the `@golem-sdk/react` package can be found in the [README.md](./packages/react/README.md) in the `packages/react` directory.

## Running the example application

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
