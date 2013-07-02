var pull = require('pull-stream')

module.exports = function (map) {
  return function (read) {
    var i = 0, j = 0, last = 0
    var seen = [], started = false, ended = false

    function drain () {
      if(_cb) {
        var cb = _cb
        if(typeof seen[j] !== 'undefined') {
          _cb = null
          console.log('j', j, seen[j])
          cb(null, seen[j++])
        } else if(j >= last) {
          _cb = null
          cb(true)
        }
      }
    }

    function start () {
      if(ended) return drain()
      read(null, function (end, data) {
        if(end) {
          console.log('last', i)
          last = i
          ended = end
          drain()
        } else {
          var k = i++
          map(data, function (err, data) {
            seen[k] = data
            if(err) ended = err
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
