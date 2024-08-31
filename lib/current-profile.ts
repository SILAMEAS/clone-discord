import {auth} from "@clerk/nextjs/server";
import {db} from "./db";
import {BadException} from "@/lib/exceptions/bad-exceptions/BadExceptions";

export const currentProfile = async () => {
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  return db.profile.findUnique({ where: { userId } });
};
export const currentProfileProtect = async () => {
  const profile=await currentProfile();
  if (!profile) {
    return auth().redirectToSignIn()
  }
  return profile;
};
export const reqSearchParam=({url,searchKey}:{url:string,searchKey:string})=>{
  const {searchParams}=new URL(url);
  const result=searchParams.get(searchKey);
  if(!result){
    return BadException(searchKey+' is not found')
  }
    return result
}