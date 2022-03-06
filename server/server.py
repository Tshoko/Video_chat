from ast import Delete
from plistlib import UID
from xml.dom import UserDataHandler
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
from fastapi_socketio import SocketManager
import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from uuid import UUID
import uuid

app = FastAPI()
sio = SocketManager(app)
app.mount("/ws", socketio.ASGIApp(sio))
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




users_list = []
users={}
@app.get("/")
async def login():
  user=str(uuid.uuid4())
  users_list.append(user)
  print(users_list)
  return {"id":user}

@app.get("/users/{id}")
async def Users(id:UUID):
  users_temp = list(filter(lambda user: (user != str(id)), users_list)) 
  return {"users":users_temp}
  


@app.sio.on('connection', namespace='/socket')
async def connect(sid,data):
  await sio.disconnect(sid)
  if(sid not in users):
    users[sid]=sid
    await sio.emit('yourID', sid,room=sid,namespace='/socket')
  
  await sio.emit("allUsers", users,namespace='/socket')
  #sio.on('disconnect',  delete(sid),namespace='/socket')


async def delete(sid):
  return await users.pop(str(sid))

@app.sio.on('callUser', namespace='/socket')
async def call_user(sid,data):
  #print(data["signalData"])
  await sio.emit('incomingcall', {"signal": data["signalData"], "from": data["From"]},room=data["userToCall"],namespace='/socket')


@app.sio.on('acceptCall', namespace='/socket')
async def call_user(sid,data):
  #print(data["signalData"])
  await sio.emit('callAccepted', data["signalData"],room=data["to"],namespace='/socket')


@app.sio.disconnect(app.sio.event)
async def disconnect():
  print('disconnected from server')


  