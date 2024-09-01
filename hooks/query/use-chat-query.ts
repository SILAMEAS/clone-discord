import {typeParamkey} from "@/type";
import qs from "query-string";
import {useInfiniteQuery} from "@tanstack/react-query";


interface IChatQuery{
    queryKey:string;
    apiUrl:string;
    paramKey:typeParamkey,
    paramValue:string;
    isConnected?:boolean
}
export const userChatQuery=({
queryKey, apiUrl,paramKey,paramValue,isConnected
}:IChatQuery)=>{
    // const {isConnected}=useSocket();
    const fetchMessages=async ({pageParam=undefined})=>{
        const url=qs.stringifyUrl({
            url:apiUrl,
            query:{
                cursor:pageParam,
                [paramKey]:paramValue
            }
        },{skipNull:true});
        const res = await fetch(url);
        return res.json();
    };
    const dataQuery=useInfiniteQuery({
        initialData: undefined, initialPageParam: undefined,
        queryKey:[queryKey],
        queryFn:fetchMessages,
        getNextPageParam:(lastPage)=>lastPage?.nextCursor,
        refetchInterval:1000,
    });
    return {...dataQuery}
}