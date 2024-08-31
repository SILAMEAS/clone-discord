import {auth} from "@clerk/nextjs/server";
import {createUploadthing, type FileRouter} from "uploadthing/next";
import {UploadThingError} from "uploadthing/server";

const f = createUploadthing();

// const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function
const handleAuth=()=>{
    const {userId}=auth();
    if(!userId) throw  new  Error("Unauthorized");
    return {userId}
}
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    serverImage:f({image:{maxFileSize:"8MB",maxFileCount:1}}).middleware(()=>handleAuth()).onUploadComplete(()=>{}),
    messageFile:f(["image",'pdf']).middleware(()=>handleAuth()).onUploadComplete(()=>{}),
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "8MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = auth();

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
