import React from 'react';
import {initialProfile} from "@/lib/initial-profile";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";
import InitialModal from "@/components/modals/initial-modal";
import { ToggleThem} from "@/components/menu-toggle-theme";

const SetupPage = async () => {
    const profile= await initialProfile();
    const server= await db.server.findFirst({
        where:{
            member:{
                some:{
                    profileId:profile.id
                }
            }
        }
    })
    console.log(server)
    if(server) redirect(`/servers/${server.id}`)
    return (
        <div>
            <ToggleThem/>
           <InitialModal/>
        </div>
    );
};

export default SetupPage;
