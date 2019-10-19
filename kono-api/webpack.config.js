const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

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
    },
    plugins: [
        new webpack.NormalModuleReplacementPlugin(/\.\.\/migrate/, '../util/noop.js'),
	new webpack.NormalModuleReplacementPlugin(/\.\.\/seed/, '../util/noop.js'),
	new webpack.IgnorePlugin(/mariasql/, /\/knex\//),
	new webpack.IgnorePlugin(/mssql/, /\/knex\//),
	new webpack.IgnorePlugin(/mysql/, /\/knex\//),
	new webpack.IgnorePlugin(/mysql2/, /\/knex\//),
	new webpack.IgnorePlugin(/oracle/, /\/knex\//),
	new webpack.IgnorePlugin(/oracledb/, /\/knex\//),
	new webpack.IgnorePlugin(/pg-query-stream/, /\/knex\//),
	new webpack.IgnorePlugin(/sqlite3/, /\/knex\//),
	new webpack.IgnorePlugin(/strong-oracle/, /\/knex\//),
	new webpack.IgnorePlugin(/pg-native/, /\/pg\//)
    ]
}
