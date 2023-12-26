/**
 * Historical notes, based on: https://webpack.js.org/configuration/configuration-languages/#typescript
 * and: https://stackoverflow.com/a/41137188
 *
 * Even though we don't directly call it, it looks like `ts-node`, or another hard coded
 * ts+node integration is required (for example, [tsx](https://www.npmjs.com/package/tsx)
 * wasn't on the list).
 *
 * Note for `tsconfig.json` settings that gets conflated with our build choice.
 *
 *     Note that you'll also need to check your tsconfig.json file. If
 *     the module in compilerOptions in tsconfig.json is commonjs, the
 *     setting is complete, else webpack will fail with an error. This
 *     occurs because ts-node does not support any module syntax other
 *     than commonjs.
 *
 */
import path from "path";
import webpack from "webpack";
// in case you run into any typescript error when configuring `devServer`
import "webpack-dev-server";

const config: webpack.Configuration = {
    entry: "./src/index.ts",
    devServer: {
        hot: true,
        open: true,
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "app.js",
    },
    // Handle this from the command line with --mode {development|production}
    // mode: "development",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            phaser: path.join(__dirname, "/node_modules/phaser/dist/phaser.js"),
        },
    },
};

export default config;
