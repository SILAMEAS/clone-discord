- Next Prisma Socket.io Tailwind
- I change from Next13 to Next14

- clerk : third party to make authentication
- uploadthing : to store image
- zod : to validation form
- next-theme : to control mode
- shadcn.ui  : to manage style it flexible and easy customize because it use full of tailwind code
- cn : is the best way to validate condition to apply style 
- best structure to learn as best practise
- zustand : state management

ready time you modify your schema you must run this script:

1. npx prisma generate
2. npx prisma db push

if your data still having while you already run both script above you can run script : npx prisma migrate reset

delete nodules : rm -rf node_modules
delete .next: rm -rf .next

[//]: # (Best config with socket.io in your next application)
npm i socket.io-client and socket.io

1. create file io.ts
// root:/pages/api/socket/io.ts
// io.ts
    import {Server as NetServer} from 'https';
    import {NextApiResponse} from 'next';
    import {Server as ServerIO} from 'socket.io'
    import {NextApiResponseServerIo} from "@/type";
    
    export const config={
    api:{
    bodyParser:false,
    }
    }
    const ioHandler=(req:NextApiResponse,res:NextApiResponseServerIo)=>{
    if(!res.socket.server.io){
    const path="/api/socket/io";
    const httpServer:NetServer=res.socket.server as any;
    res.socket.server.io = new ServerIO(httpServer,{
    path:path,
    addTrailingSlash:false
    });
    }
    res.end();
    }

    export default ioHandler;

2. create file type.ts   
// root:/type.ts
// type.ts
   import {NextApiResponse} from "next";
   import {Server as NetServer, Socket} from 'net'
   import {Server as SocketIOServer} from 'socket.io'

    export type NextApiResponseServerIo=NextApiResponse&{socket:Socket&{server:NetServer&{io:SocketIOServer}}}
3. create file socket-provider.tsx
// root:/components/providers/socket-provider, or you can write everywhere in your application but is my location
// socket-provider
   "use client"
   import React, {createContext, useContext, useEffect, useState} from "react";
   import {io as ClientIO} from 'socket.io-client'

    type SocketContextType={
    socket:any|null;
    isConnected:boolean
    }

    const SocketContext=createContext<SocketContextType>({
    socket:null,
    isConnected:false
    })

    export const useSocket=()=>{
    return useContext(SocketContext)
    }
    export const SocketProvider=({children}:{children:React.ReactNode})=>{
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    useEffect(()=>{
    const socketInstance=new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!,{
    path:"/api/socket/io", // because io.ts stay in root:/pages/api/socket/io.ts
    addTrailingSlash:false
    });
    socketInstance.on('connect',()=>{
    setIsConnected(true);
    });
    socketInstance.on('disconnect',()=>{
    setIsConnected(false);
    });
    setSocket(socketInstance);
    return ()=>{
    socketInstance.disconnect();
    }
    },[])
    return (
    <SocketContext.Provider value={{socket,isConnected}}>
    {children}
    </SocketContext.Provider>
    )
    }
4. apply provider to your layout application make it work
// root:/app/layout.tsx
   import {SocketProvider} from "@/components/providers/socket-provider";
   export default function RootLayout({
   children,
   }: Readonly<{
   children: React.ReactNode;
   }>) { return <html> <body> <SocketProvider> {children} </SocketProvider> </body> </html>}
5. create socket-indicator.tsx it just UI to validate your connection is success or fail
// socket-indicator.tsx
// root:/components/socket-indicator
   "use client";
   import {useSocket} from "@/components/providers/socket-provider";
   import {Badge} from "@/components/ui/badge";

   export const SocketIndicator=()=>{
   const {isConnected}=useSocket();
   if(!isConnected){
   return <Badge variant={'outline'} className={'bg-yellow-600 text-white border-none'}>
   Fallback: Polling every 1s
   </Badge>
   }
   return <Badge variant={'outline'} className={'bg-emerald-600 text-white border-none'}>
   Live : Real-time updates
   </Badge>
   }
6. call socket-indicator to your current page render : <SocketIndicator/>
Note : .env 
==> I create NEXT_PUBLIC_SOCKET_PATH to store path of '/api/socket/io' => process.env.NEXT_PUBLIC_SOCKET_PATH='/api/socket/io'
because I protect path in socket-provider.tsx and path in io.ts different because when both of path different socket.io will error
can't listen different port;
example : you make action at port : A and you listen at port : B 

[//]: # (When prisma got error doesn't know Prism/Client)
rm -rf node_modules
rm -rf .next
npm i
npx prisma generate

