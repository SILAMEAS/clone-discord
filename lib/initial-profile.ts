import {db} from '@/lib/db'
import {currentUser} from "@clerk/nextjs/server";

export  const initailProfile=async ()=>{
    const user= await  currentUser()
}