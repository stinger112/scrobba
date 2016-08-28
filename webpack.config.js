/**
 * Created by stinger112 on 09.07.16.
 */
// var path = require('path');

module.exports = {
    // configuration
    entry: './deezer.js',
    output: {
        path: __dirname,
        filename: './deezer-compiled.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                // test: /\.es6$/,
                // test: path.join(__dirname, 'lib'),
                // resolveLoader: { root: path.join(__dirname, "lib") },
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {}
            }
        ]
    }
};