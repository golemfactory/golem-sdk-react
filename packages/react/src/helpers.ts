import { GolemNetwork, NullStorageProvider } from "@golem-sdk/golem-js";
import { YagnaContext } from "./provider";

/**
 * Create a temporary connection to the Golem Network and execute a callback.
 * NOTE: the provided GolemNetwork instance will **not** `connect()` automatically.
 *
 * For internal use only.
 */
export async function withGlm<T>(
  yagnaOptions: YagnaContext["yagnaOptions"],
  cb: (glm: GolemNetwork) => T | Promise<T>,
): Promise<T> {
  const apiKey = yagnaOptions.apiKey;
  const basePath = yagnaOptions.basePath;
  if (!apiKey) {
    throw new Error(
      "Connection to Yagna is not established, use `useYagna` hook to set the app key and connect.",
    );
  }
  const glm = new GolemNetwork({
    api: {
      key: apiKey,
      url: basePath,
    },
    dataTransferProtocol: new NullStorageProvider(),
  });

  try {
    return cb(glm);
  } finally {
    await glm.disconnect();
  }
}
