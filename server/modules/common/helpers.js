var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt-nodejs')
var ms = require('ms')
var mongoose = require('mongoose')

var debug = require('debug')
var logError = debug('app:error')
var logInfo = debug('app:info')
var config = require('../../config')

function notFoundExc(message) {
  return {
    status: 404,
    code: 'resource_not_found',
    message: message,
  }
}

function validationExc(message, errors) {
  return {
    status: 400,
    code: 'invalid_data',
    message: message,
    errors: errors,
  }
}

function unauthorizedExc(message) {
  return {
    status: 401,
    code: 'unauthorized',
    message: message,
  }
}

/**
 * @returns Promise
 */
function connectToDb() {
  mongoose.set('debug', config.db.debug)
  mongoose.Promise = global.Promise
  var options = {
    config: { autoIndex: false },
    useMongoClient: true,
  }
  return mongoose.connect(config.db.uri, options)
}

function hashPassword(value) {
  return bcrypt.hashSync(value)
}

function verifyPassword(value, hash) {
  return bcrypt.compareSync(value, hash)
}

function createAccessToken(user, duration) {
  var expiredAt = new Date()
  expiredAt.setSeconds(expiredAt.getSeconds() + ms(duration) / 1000)
  var value = jwt.sign({ userId: user._id }, config.appSecret, { expiresIn: duration })
  return {
    value,
    expiredAt
  }
}

function verifyAccessToken(token) {
  var result = false
  try {
    result = jwt.verify(token, config.appSecret)
  } catch (err) { }
  return result
}

module.exports = {
  notFoundExc,
  validationExc,
  unauthorizedExc,
  logError,
  logInfo,
  connectToDb,
  hashPassword,
  verifyPassword,
  createAccessToken,
  verifyAccessToken,
}