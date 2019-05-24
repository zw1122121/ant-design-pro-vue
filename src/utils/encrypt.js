/**
 *需要在外部引入相关依赖
 */
/* eslint-disable no-undef */
function smEncrypt (msg, PUBLIC_SERVER_KEY) {
  var msgData = CryptoJS.enc.Utf8.parse(msg)
  var pubkeyHex = PUBLIC_SERVER_KEY
  if (pubkeyHex.length > 130) {
    pubkeyHex = pubkeyHex.substr(pubkeyHex.length - 130)
  }
  var cipher = new SM2Cipher('1')
  var userKey = cipher.CreatePoint(pubkeyHex)
  msgData = cipher.str2Bytes(msgData.toString())
  return cipher.Encrypt(userKey, msgData)
}

function smDecrypt (msg, PRIVATE_KEY) {
  var cipher = new SM2Cipher('1')
  var data = cipher.Decrypt(new BigInteger(PRIVATE_KEY, 16), msg)
  return (data || null)
}

function smSign (data, PRIVATE_KEY) {
  var sig = new KJUR.crypto.Signature({
    'alg': 'SM3withSM2',
    'prov': 'cryptojs/jsrsa'
  })
  sig.initSign({
    'ecprvhex': PRIVATE_KEY,
    'eccurvename': 'sm2'
  })
  sig.updateString(data)
  return sig.sign()
}

function smVerify (data, signdata, PUBLIC_SERVER_KEY) {
  var sig = new KJUR.crypto.Signature({
    'alg': 'SM3withSM2',
    'prov': 'cryptojs/jsrsa'
  })
  sig.initVerifyByPublicKey({
    'ecpubhex': PUBLIC_SERVER_KEY,
    'eccurvename': 'sm2'
  })
  sig.updateString(data)
  return sig.verify(signdata)
}

function generatorUUID () {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split('')
  var uuid = []; var i = 0
  radix = chars.length
  var r
  uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
  uuid[14] = '4'
  for (i = 0; i < 36; i++) {
    if (!uuid[i]) {
      r = 0 | Math.random() * 16
      uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
    }
  }
  return uuid.join('')
}
export { smEncrypt, smDecrypt, smSign, smVerify, generatorUUID }
