
export const initializeWebsocket = (nots,setList) => {
  window.electron.ipcRenderer.on('started-rutine',(event,anydesk)=>{
    for(let a of nots){
      if(a.anydesk == anydesk)
        a.on_rutine = 1
    }
  })
  window.electron.ipcRenderer.on('stopped-rutine',(event,anydesk)=>{
    for(let a of nots){
      if(a.anydesk == anydesk)
        a.on_rutine = 0
    }
  })
}
