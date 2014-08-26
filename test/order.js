var pull = require('pull-stream')
var paraMap = require('../')
var interleavings = require('interleavings')
var assert = require('assert')
//test('reads each item in correct order', function (t) {

interleavings.test(function (async) {
  var m = -1
  pull(
    pull.values([0, 1, 2]),
    async.through('input'),
    paraMap(function (i, cb) {
      console.log(i)
      assert.ok(i > m, 'ordered:' + i + ' > ' + m)
      m = i
//      setImmediate(function () {
        async(cb, 'cb')(null, i)
  //    })
    }, 2),
//    async.through('output'),
    pull.drain(null, function () {
      async.done()
    })
  )
})

//})

