const fs = require('fs')

module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV !== 'production') {
      config.devServer = {
        https: {
          key: fs.readFileSync('./certs/server.key'),
          cert: fs.readFileSync('./certs/server.crt'),
        },
        public: 'https://localhost:8080/'
      }
    }
  }
}
