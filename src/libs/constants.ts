export enum WINDOW_TAG {
  LOGIN = 'login',
  MAIN = 'main'
}

// 主进程监听事件定义
export enum CHANNEL {
  WIN_MIN = 'win:min',
  WIN_MAX = 'win:max',
  WIN_CLOSE = 'win:close',
  WIN_OPEN_MAIN = 'win:open-main',

  APP_QUIT = 'app:quit',

  DEVTOOL = 'dev:tool',

  API = 'api'
}

// 版本更新相关监听事件定义
export enum CHANNEL_UPDATE {
  CHECK = 'update:check',
  CONFIRM = 'update:confirm',
  DOWNLOAD = 'update:download',

  ABLE = 'update-available',
  UNABLE = 'update-not-available',
  PROGRESS = 'download-progress',
  DOWNLOADED = 'update-downloaded',
  ERROR = 'error'
}

export enum ERRORS {
  INVALID_INSTALLER = '安装文件校验失败',
  DOWNLOAD_FAILURE = '安装文件下载失败',
}
