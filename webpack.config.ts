import * as Webpack from 'webpack';
import { resolve } from 'path';
import { sync } from 'glob';

/** ビルド対象ルートディレクトリ */
const SRC_PATH = resolve(__dirname, './src/functions/');
/** entryとなるファイル名 */
const ENTRY_NAME = 'index.ts';
/** ビルド結果出力先 */
const BUILT_PATH = resolve(__dirname, './built');
/** ビルド種別 */
const BUILD_VARIANT = process.env.NODE_ENV;

/**
 * 複数のエンドポイントを持てるように構成 (今回は使わないかも……)
 * src/functions/(関数名)/index.ts となるように作成しておき、 index.ts 内にLambdaの実装を行う
 * 最終的にバンドルされた結果が built/(関数名)/index.js として出力される
 */

/**
 * ビルド対象のentryを解決する
 * @returns {Webpack.Entry} entry
 */
const resolveEntry = (): Webpack.Entry => {
    const entries: { [key: string]: string } = {};
    const targets: string[] = sync(`${SRC_PATH}/**/${ENTRY_NAME}`);
    const pathRegex = new RegExp(`${SRC_PATH}/(.+?)/${ENTRY_NAME}`);
    targets.forEach((value: string) => {
        let key: string;
        switch (BUILD_VARIANT) {
            case 'production':
                key = value.replace(pathRegex, 'prd_$1/index');
                break;
            case 'development':
                key = value.replace(pathRegex, 'dev_$1/index');
                break;
        }
        entries[key] = value;
    });

    return entries;
};

const config: Webpack.Configuration = {
    target: 'node',
    mode: BUILD_VARIANT === 'production' ? 'production' : 'development',
    resolve: {
        extensions: ['.ts', '.js']
    },
    entry: resolveEntry(),
    output: {
        filename: '[name].js',
        path: BUILT_PATH,
        library: '[name]',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    }
};

export default config;