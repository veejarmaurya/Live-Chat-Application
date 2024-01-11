import express from "express"
import { Server } from "socket.io"
import http from "http"
import cors from "cors"
import { Socket } from "dgram";
import { connect } from "./config.js";
import { chatModel } from "./chat.Schema.js";

const app = express();

//1. create server
const server = http.createServer(app);

// 2. create socket server
const io = new Server(server,{
  cors:{
     origin:'*',
     methods:["GET","POST"]
  }
});
//3 Use soket events

io.on('connection',(Socket)=>{
    console.log("Connection is established");
    
    Socket.on("join",(data)=>{
        Socket.username= data;
        // send old message to client
        chatModel.find().sort({timestamp:1}).limit(100)
        .then(messages=>{
            //  const oldmessages = messages.map(message => ({
            //     username: message.username,
            //     message: message.message,
            //     timestamp: message.timestamp,
            //  }));
            // Socket.emit('loadMessage',oldmessages);
            Socket.emit('loadMessage',messages);
        }).catch(err=>{
            console.log(err);
        })
    })

    Socket.on('new-message',(message)=>{
     
        let userMessage={
            username:Socket.username,
            message:message,
        };

   const newChat = new chatModel({
     username: Socket.username,
     message:message,
     timestamp: new Date(),
   })
   newChat.save();

        // broadcast this message to all the clients. 
    Socket.broadcast.emit('broadcast_message',userMessage);
   })
    Socket.on('disconnect',()=>{
        console.log("Connection is disconnected");
    })
});

server.listen(3000,()=>{
    console.log("App is listening on 3000")
    connect(); // DB wala hai 
})