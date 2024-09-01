"use client";

import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import {Track} from "livekit-client";
import {useEffect, useState} from "react";
import {useUser} from "@clerk/nextjs";
import {Loader2} from "lucide-react";

interface MediaRoomProps{
  chatId:string;
  video:boolean;
  audio:boolean;
}
const Room=({video,audio,chatId}:MediaRoomProps)=> {
  // TODO: get user input for room and name
  const {user}=useUser();
  const [token,setToken]=useState("");

  useEffect(() => {
    if(!user?.firstName||!user.lastName) return;
    const name =`${user.firstName} ${user.lastName}`;
    (async ()=>{
      try {
        const resp=await fetch(`/api/livekit?room=${chatId}&username=${name}`);
        const data=await resp.json();
        setToken(data.token);

      }catch (e){
        console.error(e)
      }
    })()
  }, []);

  if(token===''){
    return <div className={ 'flex flex-col flex-1 justify-center items-center'}>
      <Loader2 className={'h-7 w-7 text-zinc-500 animate-spin my-4'}/>
      <p className={'text-xs text-zinc-500 dark:text-zinc-400'}>
        Loading ...
      </p>
    </div>
  }

  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: '100%',width:"100%" }}
    >
      {/* Your custom component with basic video conferencing functionality. */}
      <MyVideoConference />
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      <RoomAudioRenderer />
      {/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
      <ControlBar />
    </LiveKitRoom>
  );
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height) - 30px)' }}>
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}

export default Room;