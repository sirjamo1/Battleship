const path = require("path");

module.exports = {
    entry: "./src/index.js",
    output: {
        // filename: "main.js",
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    watch: true,

    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
            },
             {
                test: /\.(mp3|wav)$/i,
                type: "asset/resource",
            },
            // {
            //     test: /\.mp3$/,
            //     loader: "file-loader",
            //     query: {
            //         name: "static/media/[name].[hash:8].[ext]",
            //     },
            // },
        ],
    },
};
