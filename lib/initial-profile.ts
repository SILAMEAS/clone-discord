import {db} from '@/lib/db'
import {auth, currentUser} from "@clerk/nextjs/server";

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