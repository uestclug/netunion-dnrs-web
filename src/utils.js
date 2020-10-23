const md5 = require('js-md5')
const Base64 = require('js-base64').Base64

/**
 * 将传入的密码进行加密
 * 返回加密后的密码
 */
function generateEncryptedPassword (password) {
  return md5(Base64.encode(password))
}

module.exports = {
  generateEncryptedPassword
}
