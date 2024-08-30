import {db} from '@/lib/db'
import {auth, currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";

export  const initialProfile = async ()=> {
    const user = await currentUser();
    if (!user) return auth().redirectToSignIn();
    const profile = await db.profile.findUnique({where: {userId: user.id}});
    if (profile) return profile;
    return db.profile.create({
        data: {
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress
        }
    });
}
export const  findMemberOneByServerIdAndProfileId = async ({profileId,serverId}:{profileId:string,serverId:string})=>{
    const memberOne = await db.server.findFirst({
        where:{
            id:serverId,
            profileId
        },
        include:{
            profile:true
        }
    });

    if(!memberOne){
        return redirect('/')
    }
    return memberOne;
}



