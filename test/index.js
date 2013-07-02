
var pull = require('pull-stream')
var paraMap = require('../')
var ordered = [], unordered = []
var test = require('tape')

test('paralell, but output is ordered', function (t) {

  pull(
    pull.count(100),
    pull.through(function (i) {
      ordered.push(i)
    }),
    paraMap(function (i, cb) {
      setTimeout(function () {
        unordered.push(i)
        cb(null, i)
      }, Math.random()*100)
    }),
    pull.collect(function (err, ary) {
      t.deepEqual(ordered, ary)
      t.deepEqual(ordered, unordered.slice()
        .sort(function (a,b){
          return a - b
        }))
      t.notDeepEqual(ordered, unordered)

      console.log(ary)
      t.end()
    })
  )

})
