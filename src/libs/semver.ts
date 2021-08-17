/**
 * Semver规范的版本号，例如 '1.0.3'
 */
type Semver = string
/**
 * semver规范的版本号对比
 * @param ver1
 * @param ver2
 */
export function compareVersion(ver1: Semver, ver2: Semver): number {
  const sep: string = '.'
  const v1 = ver1.split(sep)
  const v2 = ver2.split(sep)

  let r = 0
  const l = Math.max(v1.length, v2.length)

  for (let i = 0; i < l; i++) {
    r = ~~v1[i] - ~~v2[i]

    if (r !== 0) {
      break
    }
  }

  return r
}

export const lt = (ver1: string, ver2: string) => compareVersion(ver1, ver2) < 0
export const gt = (ver1: string, ver2: string) => compareVersion(ver1, ver2) > 0
