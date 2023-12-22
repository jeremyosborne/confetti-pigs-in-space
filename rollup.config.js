// import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";

export default {
    input: "dist/index.js",
    output: {
        file: "build/app.js",
        format: "iife",
        name: "shootdown",
        globals: {
            phaser: "Phaser",
        },
    },
    plugins: [
        resolve(),
        // typescript({ tsconfig: "./tsconfig.json" })
    ],
    external: ["phaser"],
};
