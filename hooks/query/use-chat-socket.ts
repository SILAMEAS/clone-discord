import {useSocket} from "@/components/providers/socket-provider";
import {QueryFilters, useQueryClient} from "@tanstack/react-query";
import {useEffect} from "react";
import {IMassageWithMemberWithProfile} from "@/type";

type ChatSocketProps={
    addKey:string;
    updateKey:string;
    queryKey:string;
}
export const useChatSocket=({addKey,updateKey,queryKey}:ChatSocketProps)=>{
    console.log("useChatSocket",useChatSocket)
    const {socket}=useSocket();
    const queryClient=useQueryClient();
    useEffect(()=>{
        if(!socket){
            return;
        }
        socket.on(updateKey,(message:IMassageWithMemberWithProfile)=>{
            queryClient.setQueriesData( [queryKey] as QueryFilters,(oldData:any)=>{
                if(!oldData||!oldData.page|| oldData.pages.length===0){
                    return oldData;
                }
                const newData=oldData.pages.map((page:any)=>{
                    return {...page,items:page.items.map((item:IMassageWithMemberWithProfile)=>{
                        if(item.id===message.id){
                            return message;
                        }
                        return item
                        })}
                });
                return  {
                    ...oldData,pages:newData
                }

            })
        });
        socket.on(addKey,(message:IMassageWithMemberWithProfile)=>{
            queryClient.setQueriesData([queryKey] as QueryFilters,(oldData:any)=>{
                if(!oldData||!oldData.page|| oldData.pages.length===0){
                    return {
                        pages:[{
                            items:[message]
                        }]
                    }
                }

                const newData=[...oldData.pages];
                newData[0]={
                    ...newData[0],
                    items:[
                        message,
                        ...newData[0].items
                    ]
                }
                return  {
                    ...oldData,pages:newData
                }

            })
        });

        return ()=>{
            socket.off(addKey);
            socket.off(updateKey);
        }

    },[queryClient,addKey,updateKey,queryKey,socket])
}