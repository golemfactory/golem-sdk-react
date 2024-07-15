import { TaskExecutor } from "@golem-sdk/task-executor";
import { TaskFunction, useTask } from "@golem-sdk/react";
import Decimal from "decimal.js";
import { useState } from "react";
import { ExeUnit } from "@golem-sdk/golem-js";

function isResultDefinedAndValid(
  result: unknown,
): result is { className: string; probability: number } {
  return (
    typeof result === "object" &&
    result !== null &&
    "className" in result &&
    "probability" in result
  );
}

function readFile(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = () => {
      resolve(new Uint8Array(fileReader.result as ArrayBuffer));
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}

async function classifyOnGolem(
  image: File,
  runFunction: (fn: TaskFunction) => Promise<void>,
) {
  const extension = image.name.split(".").pop();
  const input = `/golem/input/img.${extension}`;
  const output = `/golem/output/out.json`;
  const imageData = await readFile(image);

  await runFunction(async (exe: ExeUnit) => {
    console.log("Uploading data...");
    await exe.uploadData(imageData, input);
    console.log("Running the task...");
    await exe.run(`node index.js ${input} ${output}`);
    console.log("Downloading the result...");
    const result = await exe.downloadData(output);
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(result.data));
  });
}

export default function ImageClassification({
  executor,
  disabled,
}: {
  executor: TaskExecutor;
  disabled?: boolean;
}) {
  const [image, setImage] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const { run, error, isRunning, result } = useTask(executor);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    setImage(e.target.files[0]);
    setImgSrc(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) {
      return;
    }
    await classifyOnGolem(image, run);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-sm"
          onChange={handleImageChange}
          disabled={isRunning || disabled}
        />
        <p className="text-sm text-gray-500">
          Supported formats: BMP, GIF, JPG, PNG
        </p>
        {!!imgSrc && (
          <img
            src={imgSrc}
            alt="Uploaded image"
            className="max-w-sm max-h-96 object-contain my-4"
          />
        )}
        {isResultDefinedAndValid(result) && (
          <div className="max-w-sm">
            This image is a{" "}
            <span className="font-bold">{result.className}</span> with a
            probability of{" "}
            <span className="font-bold">
              {new Decimal(result.probability).mul(100).toFixed(2)}%
            </span>
          </div>
        )}
        <div className="form-control mt-4">
          <button
            type="submit"
            className={`btn btn-primary`}
            disabled={isRunning || !image || disabled}
          >
            {isRunning ? (
              <>
                <span className="loading loading-spinner"></span>
                <span>Classifying...</span>
              </>
            ) : (
              "Classify"
            )}
          </button>
        </div>
      </form>
      {error && (
        <p className="badge badge-error">
          Task failed due to {error.toString()}
        </p>
      )}
    </div>
  );
}
