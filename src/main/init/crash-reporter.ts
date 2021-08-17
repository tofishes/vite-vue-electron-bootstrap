import { crashReporter } from 'electron'

function init() {
  // TODO 崩溃报告，需要服务器支持
  crashReporter.start({
    submitURL: 'https://your-domain.com/url-to-submit',
    compress: true
  })
}

export default init
