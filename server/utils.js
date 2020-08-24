/* 公用函数 */
// const $common = require('./common')

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

// 不满足 digit 位则向 num 前补零
const prefixZero = function (num, digit) {
  return (Array(digit).join(0) + num).slice(-digit)
}

module.exports = {
  jsonWrite,
  prefixZero
}
