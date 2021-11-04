Promise.prototype.delay = function (duration) {
  return this.then(
    function (value) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(value)
        }, duration)
      })
    },
    function (reason) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          reject(reason)
        }, duration)
      })
    }
  )
}

Promise.prototype.go = function () {
  return this.then(
    function (res) {
      return new Promise(function (resolve) {
        resolve([res, null])
      })
    },
    function (err) {
      return new Promise(function (resolve, reject) {
        reject([null, err])
      })
    }
  )
}

interface Promise<T> {
  delay(number): Promise<T>
  go(): Promise<[T?, any?]>
}
