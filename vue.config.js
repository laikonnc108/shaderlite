module.exports = {
    pluginOptions: {
      electronBuilder: {
        builderOptions: {
          // options placed here will be merged with default configuration and passed to electron-builder
          icon: 'src/assets/app_new.ico',
          extraResources: ['./db/**/*','./assets/**/*'],
        }
      }
    },

    configureWebpack:  {
        externals: {
          //sqlite3: 'sqlite3',
          'mariasql': 'mariasql',
          'mssql': 'mssql',
          'mysql': 'mysql',
          'oracle': 'oracle',
          'strong-oracle': 'strong-oracle',
          'oracledb': 'oracledb',
          'pg': 'pg',
          'pg-query-stream': 'pg-query-stream',
        },
    }

}