
var pull = require('pull-stream')
var paraMap = require('../')
var ordered = [], unordered = [], unordered2 = []
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
    paraMap(function (i, cb) {
      setTimeout(function () {
        unordered2.push(i)
        cb(null, i)
      }, Math.random()*100)
    }),
    pull.collect(function (err, ary) {
      function sort (a) {
        return a.slice()
          .sort(function (a,b){
            return a - b
          })
      }
      console.log(unordered)
      t.deepEqual(ordered, ary)
      t.deepEqual(ordered, sort(unordered), 'ordered == sort(unordered)')
      t.deepEqual(ordered, sort(unordered2), 'ordered == sort(unordered2)')
      t.notDeepEqual(ordered, unordered)
      t.notDeepEqual(ordered, unordered2)
      t.end()
    })
  )

})


test('paralell, but output is ordered', function (t) {
  var m = 0
  function breaky (i, cb) {
    if(i !== 33)
      setTimeout(function () {
        unordered.push(i)
        cb(null, i)
      }, Math.random()*100)
    else
      setTimeout(function () {
          cb(new Error('an error'))
      },100)
  }

  pull(
    pull.count(100),
    pull.through(function (i) {
      ordered.push(i)
    }),
    paraMap(breaky),
    pull.collect(function (err, ary) {
      console.log(err, ary)
      t.ok(err)
      t.end()
    })
  )

})

