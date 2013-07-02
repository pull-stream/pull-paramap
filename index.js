var pull = require('pull-stream')

module.exports = function (map) {
  return function (read) {
    var i = 0, j = 0, last = 0
    var seen = [], started = false, ended = false, _cb

    function drain () {
      if(_cb) {
        var cb = _cb
        if(typeof seen[j] !== 'undefined') {
          _cb = null
          cb(null, seen[j++])
        } else if(j >= last && ended) {
          _cb = null
          cb(true)
        }
      }
    }

    function start () {
      started = true
      if(ended) return drain()
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
            if(err) ended = err
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
