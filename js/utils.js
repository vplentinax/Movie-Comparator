const debounce = (fn, delay = 1000) => {
  let timeOutID
  return (...args) => {
    if (timeOutID) {
      clearTimeout(timeOutID)
    }

    timeOutID = setTimeout(() => {
      fn.apply(null, args)
    }, delay)
  }
}
