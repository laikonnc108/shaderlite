module.exports = {
    pluginOptions: {
      electronBuilder: {
        builderOptions: {
          // options placed here will be merged with default configuration and passed to electron-builder
          icon: 'assets/ico.ico'
        }
      }
    },
    /*
    configureWebpack: config => {
        config.externals = ['pg', 'sqlite3', 'tedious', 'pg-hstore','mysql2']
    }
    */
}