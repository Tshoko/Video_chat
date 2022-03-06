[![Python Version](https://img.shields.io/badge/python-3.8-blue?logo=Python&logoColor=yellow)](https://docs.python.org/3.8/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.68.0-009688?logo=FastAPI&labelColor=white)](https://fastapi.tiangolo.com/)
[![npm](https://img.shields.io/npm/v/simple-peer.svg)]
[![Reactjs](https://camo.githubusercontent.com/4e4a3b5c3e9c00501ec866e2f2466c5a6032f838aca5f2cf3b14450e39e8a2f0/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f72656163742532302d2532333230323332612e7376673f267374796c653d666f722d7468652d6261646765266c6f676f3d7265616374266c6f676f436f6c6f723d253233363144414642)](https://reactjs.org/)



## Project Outline
This project is a peer to peer video chat app that is made using following technologies:
- simple-peer(a web RTC implimentation)-> This is used to setup the peep to peer video chat.
- Socket io -> python server-io and javascript client socket io for signaling.
- Reacjs -> to build the front end of the video chat app.
- FastAPI -> To build the backend server ASYNC API endpoint.
# Original Material
- This project is based on coding with chaim video series links.
-Github (https://github.com/coding-with-chaim/react-video-chat).
-Videos series (https://www.youtube.com/c/CodingWithChaim) 
## Setting up Virtual enviroment
## Setup

- Its advisable but not required to use python 3.8 virtual environment to run this. 
- And to use npm 8.5.0
## Setting up Virtual enviroment(server)

For Linux, used the following command
```sh
py -3.8 -m venv venv 
```
The activate the enviroment usig the followig command
```sh
venv\Scripts\activate 
```
Install the required dependencies by running

```sh
pip install -r requirements.txt -r dev-requirements.in
```
## Setting up Virtual enviroment(client))

Navigat to /Client/front-end/.Then use the following command to install all the dependencies
```sh
py npm install
```

## Development

To run the server:

```sh
uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```
To run Client'
```sh
npm start
```

## Demo images
### Short1
-It will start by requesting permition to your camera.
-The display all users.
![All_Users](https://github.com/Tshoko/Video_chat/blob/main/AllUsers.png)
### Short2
- Click on User and user will recieve call
-User accepts the call
![Calling_user](https://github.com/Tshoko/Video_chat/blob/main/Calling_User.png)
### Short3
- User accepts call.
- Then caller chooses which screen to share.
![User_choose_screen_share](https://github.com/Tshoko/Video_chat/blob/main/screen_sharing_ops.png)
### Short4
- User accepts call.
- Then caller chhoses which screen to share.
![User_screen_share](https://github.com/Tshoko/Video_chat/blob/main/screen_sharing.png)


