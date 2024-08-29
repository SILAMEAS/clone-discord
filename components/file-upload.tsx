"use client";
import { UploadButton } from "@/lib/uploadingthing";
import { X } from "lucide-react";
import Image from "next/image";

interface IFileUpload {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage" | "imageUploader";
}
export const FileUpload = (props: Readonly<IFileUpload>) => {
  const { endpoint, onChange, value } = props;
  const fileType = value?.split(".").pop();
  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-30">
        <Image
          src={value}
          alt="upload"
          className="rounded-full "
          width={100}
          height={100}
        />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  return (
    <div className="bg-green-400 w-full">
      <UploadButton
        endpoint={endpoint as any}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
        appearance={{
          button: {},
        }}
      />
      {/* <UploadDropzone
        endpoint={endpoint as any}
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          onChange(res?.[0].url);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      /> */}
    </div>
  );
};
