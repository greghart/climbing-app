if (process.env.NODE_ENV === 'production') {
  module.exports = require('./getStore.production').default;
}
else {
  module.exports = require('./getStore.development').default;
}