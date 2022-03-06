from typing import Union
import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from uuid import UUID
import uuid


app = FastAPI()
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
cors_allowed_origins=["http://localhost:3000"]
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins=cors_allowed_origins)
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
  

@sio.on('connection', namespace='/socket')
async def connect(sid,data):
  if(sid not in users):
    users[sid]=sid
    #sio.enter_room(sid, '/socket')
  
    await sio.emit('yourID', sid,room=sid,namespace='/socket')
    
  await sio.emit("allUsers", users,namespace='/socket')
  #sio.on('disconnect',  delete(sid),namespace='/socket')


@sio.on('callUser', namespace='/socket')
async def call_user(sid,data):
  #print(data["signalData"])
  await sio.emit('incomingcall', {"signal": data["signalData"], "from": data["From"]},room=data["userToCall"],namespace='/socket')
@sio.on('acceptCall', namespace='/socket')
async def call_user(sid,data):
  #print(data["signalData"])
  await sio.emit('callAccepted', data["signalData"],room=data["to"],namespace='/socket')


@sio.on('shared', namespace='/socket')
async def call_user(sid,data):
  print(data["to"])
  await sio.emit('shared', data["shared"],room=data["to"],namespace='/socket')

@sio.event
async def disconnect(sid):
  print("disconnect")
