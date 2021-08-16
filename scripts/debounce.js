/**
 * 防抖
 * @param  {[type]}  func      要执行的方法
 * @param  {Number}  wait      防抖间隔时间
 * @param  {Boolean} immediate 是否先执行一次
 * @return {[type]}            [description]
 */
function debounce(func, wait = 200, immediate = true) {
  let timeout
  let cache

  return function executedFunction(...args) {
    const context = this

    const later = function() {
      timeout = null
      if (!immediate) cache = func.apply(context, args)
    }

    const callNow = immediate && !timeout

    clearTimeout(timeout)

    timeout = setTimeout(later, wait)

    if (callNow) cache = func.apply(context, args)

    return cache
  }
}

module.exports = debounce
