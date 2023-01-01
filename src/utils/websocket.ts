
export const initializeWebsocket = (setList,setStatus) => {
  const eventAdd = (anydesk)=>{
    setList(anydesk,1)
  }
  const eventRemove = (anydesk)=>{
    setList(anydesk,0)
  }
  const changeStatus = ({anydesk,status}) => {
    setStatus(anydesk,status)
  }
  window.electron.ipcRenderer.removeAllListeners('started-rutine')
  window.electron.ipcRenderer.on('started-rutine',eventAdd)
  window.electron.ipcRenderer.removeAllListeners('stopped-rutine')
  window.electron.ipcRenderer.on('stopped-rutine',eventRemove)
  window.electron.ipcRenderer.removeAllListeners('change-status')
  window.electron.ipcRenderer.on('change-status',changeStatus)

}
