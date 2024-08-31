"use client";
import {UploadButton} from "@/lib/uploadingthing";
import {FileIcon, X} from "lucide-react";
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
      <div className="relative h-20 w-30 mb-10">
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
    if (value && fileType === "pdf") {
        return (
            <div className="relative  flex items-center p-2 mt-2 rounded-md bg-background/10 mb-10">
                <FileIcon className={'h-10 w-10 fill-indigo-200 stroke-indigo-400'}/>
                <a href={value} target={'_blank'}
                   rel="noopener noreferrer"
                   className={'ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'}>{value}</a>
                <button
                    onClick={() => onChange("")}
                    className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                    type="button"
                >
                    <X className="h-4 w-4"/>
                </button>
            </div>
        );
    }
    return (
        <div className="w-full pt-10 pb-20">
            <UploadButton
                endpoint={endpoint as any}
                onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
        appearance={{
            container: {
                paddingLeft:"30px",
                paddingRight:"30px",
                width:"auto"
            },
            button: {
                color:"black",
                fontWeight:700,
            }
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
