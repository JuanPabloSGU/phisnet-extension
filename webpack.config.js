const path = require('path');

module.exports = {
    entry: {
        background: './src/background.ts',
        content: './src/content.ts',
        popup: './src/popup.ts',
        home: './src/home.ts',
        settings: './src/settings.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    mode: 'production'
};

