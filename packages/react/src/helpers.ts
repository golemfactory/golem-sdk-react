import { GolemNetwork, NullStorageProvider } from "@golem-sdk/golem-js";
import { YagnaContext } from "./provider";

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

  await glm.connect();
  try {
    return cb(glm);
  } finally {
    await glm.disconnect();
  }
}
