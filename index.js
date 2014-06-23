var pull = require('pull-stream')

module.exports = function (map, width) {
  return function (read) {
    var i = 0, j = 0, last = 0
    var seen = [], started = false, ended = false, _cb, error

    function drain () {
      if(_cb) {
        var cb = _cb
        if(error) {
          _cb = null
          return cb(error)
        }
        if(Object.hasOwnProperty.call(seen, j)) {
          _cb = null
          cb(null, seen[j++])
          if(width) start()
        } else if(j >= last && ended) {
          _cb = null
          cb(true)
        }
      }
    }

    function start () {
      started = true
      if(ended) return drain()
      if(width && (i - width >= j)) return
      read(null, function (end, data) {
        if(end) {
          last = i; ended = end
          drain()
        } else {
          var k = i++
          if(!ended)
            start()

          map(data, function (err, data) {
            seen[k] = data
            if(err) error = err
            drain()
          })
        }
      })
    }

    return function (abort, cb) {
      _cb = cb
      if(!started) start()
      drain()
    }
  }
}
