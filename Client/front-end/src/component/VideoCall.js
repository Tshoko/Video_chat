import { useParams } from "react-router-dom";
import { Link,Outlet } from "react-router-dom";

import React, { useEffect, useState, useRef } from 'react';
import io from "socket.io-client";
import Peer from "simple-peer";
import styled, { ThemeProvider } from "styled-components";
const Container = styled.div`
  
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const SideBar = styled.div`
  border: 1px solid black;
  border-radius:5px;
  width: 20%;
  display: flex;
  flex-direction:column ;
`;
const SideVideo = styled.video`
border: 1px solid black;
border-radius:5px;
  margin-top:0px
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const Row = styled.div`
  display: flex;
  width: 100%;
`;

const Video = styled.video`
  border: 1px solid blue;
  margin: 1em;
  width: 100%;
  max-width:130vh;

`;
const NameText=styled.p`
  padding:0px;
  margin-top:-100px
  width:20%%;
`

export default function VideoCall(props) {
  const [yourID, setYourID] = useState("empty");
  const [partnerID, setPartnerID] = useState("empty");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [sharing,setSharing]=useState(false)
  const [isharing,setisSharing]=useState(false)
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const myVideo = useRef();
  const peerRef=useRef();
  const partnerVideo = useRef();
  const partnerShared = useRef();
  const userStream=useRef()
  const socket = useRef();

  
 
  useEffect(() => {
    socket.current = io.connect('ws://0.0.0.0:8080/socket', {path: "/ws/socket.io/"},{ mode: 'cors' });
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      
        myVideo.current.srcObject = stream;
        userStream.current=stream
        
        
    })                           
    socket.current.emit("connection", yourID)

    socket.current.on("yourID", (id) => {
      setYourID(id);
      
    })
  
    socket.current.on("incomingcall", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    })
    socket.current.on('shared', ()=>{
      console.log("recieved")
      setisSharing(true)})
  }, []);

  useEffect(()=>{{
    socket.current.on("allUsers", (users) => {
      setUsers(users);
    })

  }
  },[users])



  function callPeer(id) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {

        iceServers: [
            {
                urls: "stun:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            },
            {
                urls: "turn:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            }
        ]
    },
    });
    
  
    peer.on("signal", data => {
      socket.current.emit("callUser", { userToCall: id, signalData: data, From: yourID })
    })

  peerRef.current=peer

    peerRef.current.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", signal => {
      setCallAccepted(true);
      peerRef.current.signal(signal);
    })
  

   
  userStream.current.getTracks().forEach(track => {
   
    //peerRef.current.removeTrack(track, userStream.current)
    peerRef.current.addTrack(track, userStream.current)
    
  })
    
    setPartnerID(id)
    

  }

  function acceptCall() {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    /*
    userStream.current.getTracks().forEach(track => {peerRef.current.addTrack(track, userStream.current)
    console.log(track)
    });*/
    
    peer.on("signal", data => {
      socket.current.emit("acceptCall", { signalData: data, to: caller })
    })

    
    peerRef.current=peer;
    peerRef.current.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
      console.log("i am here")
      console.log(stream)
      if(stream.size){
        console.log("Map recived")
      }
    });

    peerRef.current.signal(callerSignal);
   
    
    
    console.log(peerRef)
    
    
  }



  async function shareScreen(displayMediaOptions) {
    

    navigator.mediaDevices.getDisplayMedia()
        .then(stream => {
          
          //peerRef.current.removeStream(myVideo.current);
          peerRef.current.addStream(stream);
          
          myVideo.current.srcObject = stream;
          //peerRef.current.removeStream(myVideo.current)
          //replaceTrack(stream,peerRef.current)
          peerRef.current.on("stream", stream => {
            console.log(stream)
            partnerShared.current.srcObject = stream;
          });
            //peerRef.current.addTrack(screenTrack,stream)
            console.log(peerRef.current._senderMap)
            //peerRef.current.replaceTrack(you,screenTrack,stream)
          }
          
        ).catch(error => console.error(error))

      socket.current.emit("shared", {shared:true,to:partnerID})
}

 function shared(){
   if(peerRef.current){
    console.log(peerRef.current._remoteTracks)
    setSharing(true)
    peerRef.current.signal(callerSignal);
    console.log("Inside shared")
    setisSharing(false)

   }
 }

 let UserVideo;
 if (stream) {
   UserVideo = (
     <>
     <SideVideo playsInline muted ref={myVideo} autoPlay />
     <NameText>{yourID}</NameText>
     </>
     
   );
 }


 let PartnerVideo;
 if (callAccepted) {
   PartnerVideo = (
     <SideVideo playsInline ref={partnerVideo} autoPlay />
   );
   
 }
 let PartnerShared;
 if (true) {
       PartnerShared = (
     <Video playsInline ref={partnerShared} autoPlay />
   );
   
 }

 let incomingCall;
 if (receivingCall && !callAccepted) {
   incomingCall = (
     <div>
       <h1>{caller} is calling you</h1>
       <button onClick={acceptCall}>Accept</button>
     </div>
   )
 }
 let shareScreen_btn;
 if (!receivingCall && callAccepted) {
    shareScreen_btn = (
     <div>
      <button onClick={shareScreen}>ShareScreen </button>
     
     </div>
   )
 }
 let ishSharing_btn;
 if (isharing) {
    ishSharing_btn = (
     <div>
      <button onClick={shared}>shared </button>
     
     </div>
   )
 }

  return (
    <Container>
      <Row>
        <SideBar>
        {UserVideo}
        
        
      
        </SideBar>
        {PartnerVideo}
        
        
       
      </Row>
      <Row>
        {Object.keys(users).map(key => {
          if (key === yourID) {
            return null;
          }
          return (
            <button onClick={() => callPeer(key)} key={key}>Call {key}</button>
          );
        })}
      </Row>
      <Row>
        {incomingCall}
        {shareScreen_btn}
        {ishSharing_btn}
      </Row>
    </Container>
  );
}
