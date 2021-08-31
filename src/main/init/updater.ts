import { ipcMain, BrowserWindow } from 'electron'
// import { autoUpdater } from 'electron-updater'

import _global from '../global'
import autoUpdater from '../../libs/app-updater'
import { CHANNEL_UPDATE } from '../../libs/constants'
import { getApiUrl } from '../../service/config'
import { VersionInfo } from '../../types'

function init(window: BrowserWindow) {
  const context = window.webContents
  // todo 设置更新服务地址
  const feedUrl = getApiUrl('/desktopapp/GetLastestVersion')

  autoUpdater.setFeedURL(feedUrl, (resp): VersionInfo => {
    const {
      description,
      version_no: version,
      is_force: isForce,
      file_hash: hash,
      exe_url: url,
      latest_auto_update_version_no: latestForceVersion,
    } = resp

    return {
      version,
      description,
      isForce,
      hash,
      url,
      latestForceVersion,
    }
  })

  ipcMain
    .once(CHANNEL_UPDATE.CONFIRM, () => {
      autoUpdater.quitAndInstall()

      _global.quit()
    })
    .on(CHANNEL_UPDATE.DOWNLOAD, () => {
      autoUpdater.downloadUpdate()
    })
    .handle(CHANNEL_UPDATE.CHECK, async () => {
      await autoUpdater.checkForUpdates()
    })

  autoUpdater
    .on(CHANNEL_UPDATE.ABLE, info => {
      context.send(CHANNEL_UPDATE.ABLE, info)
    })
    .on(CHANNEL_UPDATE.UNABLE, () => {
      context.send(CHANNEL_UPDATE.UNABLE)
    })
    .on(CHANNEL_UPDATE.PROGRESS, info => {
      context.send(CHANNEL_UPDATE.PROGRESS, info)
    })
    .on(CHANNEL_UPDATE.DOWNLOADED, () => {
      context.send(CHANNEL_UPDATE.DOWNLOADED)
    })
    .on(CHANNEL_UPDATE.ERROR, e => {
      context.send(CHANNEL_UPDATE.ERROR, e)
    })

  return autoUpdater
}

export default init
