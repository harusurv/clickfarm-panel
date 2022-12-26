import { ipcMain } from 'electron';

import { exec } from "child_process"

export const connectAnydesk = (id,password) => {
  exec(`echo ${password} | "C:\\Program Files (x86)\\AnyDesk\\AnyDesk.exe" ${id} --with-password`, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
  });
}

ipcMain.on('open_anydesk',(event,{anydesk,password}) => {
  connectAnydesk(anydesk,password)
})
