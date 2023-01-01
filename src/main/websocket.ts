import WebSocket from "ws"
import { ipcMain } from 'electron';
import {ENDPOINT,MAGIC_COOKIE_WEBSOCKET} from '../utils/constants'
import crypto from "crypto"

let websocket
let mainWindow
export const initializeWebsocket = (win) => {
  mainWindow = win
  if(websocket?.connected)
    return;
  try{
    websocket = new WebSocket((ENDPOINT+"/websocket").replace('http','ws'))
    websocket.on('close',()=>{
      console.log("close connection")
      websocket.connected = false
      setTimeout(() => {
        initializeWebsocket(win)
      }, 15000);
    })
    websocket.on('error',()=>{
      console.log("close connection")
      websocket.connected = false
    })
    websocket.on('open',()=>{
      console.log("connection open")
      websocket.connected = true
    })
    websocket.on('message',async (message) => {
      try{
        const json = JSON.parse(message)
        if(json.method == "ping"){
          websocket.send(JSON.stringify({
            method:"pong"
          }))
        }
        else if(json.method == "start-rutine-notification"){
          mainWindow.webContents.send('started-rutine', json.params.anydesk);
        }
        else if(json.method == "stop-rutine-notification"){
          mainWindow.webContents.send('stopped-rutine', json.params.anydesk);
        }
        else if(json.method == "change-status"){
          mainWindow.webContents.send('change-status', json.params);
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
