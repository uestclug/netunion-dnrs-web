/* 公用函数 */
const jsonWrite = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '1',
      msg: 'json write failed'
    })
    console.log('json write failed.')
  } else {
    res.json(ret)
    console.log('json write success!')
  }
}

module.exports = {
  jsonWrite
}
