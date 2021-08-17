type EnvName = 'development' | 'test' | 'production' | undefined

const env = {
  isDev: process.env.NODE_ENV === 'development',
  isWindows: process.platform === 'win32',
  rootDir: process.cwd()
}

export default env
