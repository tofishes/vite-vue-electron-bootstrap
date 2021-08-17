import path from 'path'

import env from './env'
import Commander from './commander'

function getEntry(route: string = '/') {
  if (route.startsWith('http')) {
    return route
  }

  let entry = `file://${path.join(__dirname, '../renderer/index.html')}`

  if (env.isDev) {
    const port = new Commander('port').param('port') || 3000
    entry = `http://localhost:${port}`
  }

  return `${entry}#${route}`
}

export default getEntry
