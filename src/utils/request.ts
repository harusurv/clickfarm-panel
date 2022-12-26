import axios from 'axios'
import {setTelegram,setEmail} from './saveState'
import {ENDPOINT,MAGIC_COOKIE} from './constants'
import crypto from 'crypto'
export const getListNotifications = (fallback) => {
  axios.get(ENDPOINT+"/v1/list_notifications")
  .then((body)=>{
    fallback(body?.data?.data)
  }).catch((e)=>{
    console.log(e)
    fallback([])

  })
}
export const getResueltos = (agent,fallback) => {
  axios.get(ENDPOINT+"/v1/solved?agent="+agent.toLowerCase())
  .then((body)=>{
    fallback(body?.data?.data)
  }).catch((e)=>{
    console.log(e)
    fallback([])

  })
}

export const solveNotification = (anydesk,agent,fallback) => {
  const token = crypto.createHash('sha256').update(anydesk+MAGIC_COOKIE+agent).digest('base64');
  console.log(anydesk)
  axios.post(ENDPOINT+"/v1/add_notification",{
      anydesk,
      type:0,
      token,
      agent
  })
  .then((body)=>{
    fallback(body?.data?.data)
  }).catch((e)=>{
    console.log(e)
    fallback([])

  })
}
