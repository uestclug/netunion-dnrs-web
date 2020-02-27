module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '': {
        target: 'http://127.0.0.1:8088',
        changeOrigin: true,
        pathRewrite: { '^': '' }
      }
    }
  }
}
