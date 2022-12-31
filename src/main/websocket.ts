import WebSocket from "ws"
import { ipcMain } from 'electron';
import {ENDPOINT,MAGIC_COOKIE_WEBSOCKET} from '../utils/constants'
import crypto from "crypto"

let websocket
export const initialize = () => {
  try{
    websocket = new WebSocket((ENDPOINT+"/websocket").replace('http','ws'))
    websocket.on('close',()=>{
      console.log("close connection")
      initialize()
    })
    websocket.on('error',()=>{
      console.log("close connection")
      websocket.connected = false
    })
    websocket.on('open',()=>{
      console.log("connection open")
    })
    websocket.on('message',async (message) => {
      try{
        const json = JSON.parse(message)
        if(json.method == "ping"){
          websocket.send(JSON.stringify({
            method:"pong"
          }))
        }
        else if(json.method == "start-rutine"){
          console.log("Start rutine:"+json.params.anydesk)
        }
        else if(json.method == "stop-rutine"){
          console.log("Start rutine:"+json.params.anydesk)
        }

      }
      catch(e){
        console.error(e)
      }


    })
  }
  catch(e){
    console.error(e)
    websocket.connected = false
  }


}

initialize()
