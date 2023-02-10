require('dotenv').config()

// const PORT = process.env.PORT
const PORT = process.env.PORT || 5000

const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

// console.log('MONGODB_URI', MONGODB_URI?.slice(-10))

module.exports = {
  MONGODB_URI,
  PORT,
}
