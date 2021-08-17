import { shell, clipboard, ipcRenderer, contextBridge, Dialog, IpcRenderer } from 'electron'

const api = {
  shell,
  clipboard,
  ipcRenderer,
  dialog: {
    showCertificateTrustDialog(...options: any[]) {
      return ipcRenderer.invoke('dialog:showCertificateTrustDialog', ...options)
    },
    showErrorBox(...options: any[]) {
      return ipcRenderer.invoke('dialog:showErrorBox', ...options)
    },
    showMessageBox(...options: any[]) {
      return ipcRenderer.invoke('dialog:showMessageBox', ...options)
    },
    showOpenDialog(...options: any[]) {
      return ipcRenderer.invoke('dialog:showOpenDialog', ...options)
    },
    showSaveDialog(...options: any[]) {
      return ipcRenderer.invoke('dialog:showSaveDialog', ...options)
    }
  } as Pick<
    Dialog,
    | 'showCertificateTrustDialog'
    | 'showErrorBox'
    | 'showMessageBox'
    | 'showOpenDialog'
    | 'showSaveDialog'
  >
}
// fix lost these prototype methods in renderer
const { on, once } = ipcRenderer
api.ipcRenderer.on = (...args) => {
  return on.apply(ipcRenderer, args)
}
api.ipcRenderer.once = (...args) => {
  return once.apply(ipcRenderer, args)
}

try {
  contextBridge.exposeInMainWorld('electron', api)
} catch (e) {
  console.log(e)
  ;(window as any).electron = api
}
