const md5 = require('js-md5')
const Base64 = require('js-base64').Base64

/**
 * 将传入的密码进行加密
 * 返回加密后的密码
 */
function generateEncryptedPassword (password) {
  return md5(Base64.encode(password))
}

/**
 * 生成随机的颜文字！
 */
function generateEmoticons (type = '') {
  let emoticons = []
  const emoticonsHappy = ['(◔◡◔)', '(｡･∀･)ﾉﾞ', 'o(￣▽￣)ｄ', '*´∀`)´∀`)*´∀`)', 'ヾ(≧∇≦*)ゝ',
    '(≧∀≦)ゞ', '(๑¯∀¯๑)', 'φ(≧ω≦*)♪', '～(￣▽￣～)', '(～￣▽￣)～', '(>▽<)']
  const emoticonsSad = ['〒▽〒', 'o(╥﹏╥)o']
  const emoticonsAngry = ['( ͡❛ ︵ ͡❛)', 'o(≧口≦)o', '（＃￣～￣＃）', 'o(￣ヘ￣o＃)', '（｀へ´）']
  const emoticonsElse = ['つ﹏⊂', '_( ﾟДﾟ)ﾉ', '⊙▽⊙', '=￣ω￣=', '（´v｀）', '(′▽`〃)']
  const emoticonsAll = emoticonsElse.concat(emoticonsHappy, emoticonsSad, emoticonsAngry)
  switch (type) {
    case 'happy':
      emoticons = emoticonsHappy
      break
    case 'sad':
      emoticons = emoticonsSad
      break
    case 'angry':
      emoticons = emoticonsAngry
      break
    default:
      emoticons = emoticonsAll
  }
  return emoticons[Math.floor(Math.random() * emoticons.length)]
}

module.exports = {
  generateEncryptedPassword,
  generateEmoticons
}
