const path = require('path')

module.exports = {
    transpileDependencies: ['vuetify'],
    lintOnSave: false,
    outputDir: path.resolve(__dirname, 'BUILD_TEMP'),
    chainWebpack: (config) => {
        config.module
            .rule('pdf')
            .test(/\.pdf$/)
            .use('file-loader')
            .loader('file-loader')
    },
    devServer: {
        port: 7080, // CHANGE YOUR PORT HERE!
        proxy: {
            '/ms/genbby/servicios/': {
                target: process.env.VUE_APP_URL_EQUIFAX,
                changeOrigin: true,
                pathRewrite: {
                    '/ms/genbby/servicios/': ''
                }
            },
            '/ms/genbby/booking': {
                target: process.env.VUE_APP_URL_BOOKING,
                changeOrigin: true,
                pathRewrite: {
                    '/ms/genbby/booking': ''
                }
            }
        }
    }
}
