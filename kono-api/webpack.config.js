const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist',
        library: '',
        libraryTarget: 'commonjs'
    },
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: /node_modules/
            }
        ]
    },
    target: 'node',
    optimization: {
        minimizer: [new TerserPlugin({ terserOptions: { mangle: false } })]
    },
    externals: {
        knex: 'commonjs knex'
    }
}
