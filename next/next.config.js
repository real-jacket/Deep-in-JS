const path = require('path')

module.exports = {
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.(png|jpe?g|gif)$/i,
            use: [
                {
                    loader: 'file-loader',
                    options:{
                        name: '[hash].[name].[ext]',
                        publicPath:  path.resolve('/','_next/static/images'),
                        outputPath: 'static/images',
                    }
                },
            ],
        },)
        return config
    },
}
