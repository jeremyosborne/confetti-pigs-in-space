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
import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { Configuration } from "webpack";
// in case you run into any typescript error when configuring `devServer`
import "webpack-dev-server";

/** The base folder for source code that needs some sort of transformation. */
const INPUT_SRC_DIR = path.resolve(path.join(__dirname, "src"));
/** The base folder for files that need to end up in the final build folder but receive no transformation. */
const INPUT_STATIC_DIR = path.resolve(path.join(__dirname, "static"));
/** The base folder where all built code ends up. */
const OUTPUT_DIR = path.resolve(path.join(__dirname, "dist"));

const config: Configuration = {
    devServer: {
        client: {
            overlay: {
                warnings: false,
            },
        },
        port: 3000,
        static: OUTPUT_DIR,
    },
    devtool:
        process.env.BUILD_TYPE === "development"
            ? "eval-source-map"
            : undefined,
    // If changing the name of the chunks, also change reference HtmlWebpackPlugin.
    entry: {
        game: path.join(INPUT_SRC_DIR, "index.ts"),
    },
    mode: (process.env.BUILD_TYPE as Configuration["mode"]) || "production", // "development" | "production"
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    output: {
        chunkFilename: "[name].chunk.js",
        filename: "[name].js",
        path: OUTPUT_DIR,
        // If you change this, you better check the HTML template hrefs for anything
        // that assumes publicPath to be what it is, like the site-header.
        publicPath: "/",
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    // The `./static` folder contains files that we need
                    // to have copied over to the build directory.
                    from: INPUT_STATIC_DIR,
                    to: OUTPUT_DIR,
                },
            ],
        }),
        new HtmlWebpackPlugin({
            // This is required to inject <script> tags into the HTML
            // with the links to our application code.
            template: path.join(INPUT_SRC_DIR, "html", "index.html"),
            chunks: ["game"],
        }),
    ],
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            phaser: path.join(__dirname, "/node_modules/phaser/dist/phaser.js"),
        },
    },
};

export default config;
