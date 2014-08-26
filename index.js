var pull = require('pull-stream')

module.exports = function (map, width) {
  var reading = false
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
          var data = seen[j]; delete seen[j]; j++
          cb(null, data)
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
      if(reading || width && (i - width >= j)) return
      reading = true
      read(null, function (end, data) {
        reading = false
        if(end) {
          last = i; ended = end
          drain()
        } else {
          var k = i++

          map(data, function (err, data) {
            seen[k] = data
            if(err) error = err
            drain()
          })

          if(!ended)
            start()

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
