
export const connectAnydesk = (anydesk,password) => {
  window.electron.ipcRenderer.sendMessage('open_anydesk',{anydesk,password})
}
