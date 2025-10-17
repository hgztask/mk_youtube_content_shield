import importContent from 'rollup-plugin-import-content'
import vue from 'rollup-plugin-vue';
import replace from '@rollup/plugin-replace'
import serve from 'rollup-plugin-serve';
import eslint from '@rollup/plugin-eslint';

console.log('Current working directory:', process.cwd());
// 开发环境为 true，生产环境为 false，默认为开发环境
const __DEV__ = (process.env.ROLLUP_ENV || 'development') === 'development';
console.log('环境为', __DEV__);
export default {
    // 性能监控
    perf: false,
    input: 'src/main.js',
    external: ['vue', 'dexie'],
    plugins: [
        // 使用 replace 插件定义全局变量
        replace({
            __DEV__: JSON.stringify(__DEV__),
            preventAssignment: true,
        }),
        importContent({
            fileName: ['.css']
        }),
        vue({
            css: true,
            compileTemplate: true // 编译模板
        }),
        eslint({
            include: ['src/**/*.js', 'src/**/*.vue'],
            exclude: ['dist/**', 'node_modules/**', '**/*.vue?*'],
            overrideConfig: {
                root: true,
                env: {
                    browser: true,
                    es2021: true
                },
                parser: 'vue-eslint-parser',
                parserOptions: {
                    parser: 'espree',
                    ecmaVersion: 'latest',
                    sourceType: 'module'
                },
                plugins: ['vue'],
                extends: [
                    'eslint:recommended',
                    'plugin:vue/vue2-essential'
                ],
                // ✅ 关键：声明 GM 全局变量
                globals: {
                    GM_setValue: 'readonly',
                    GM_getValue: 'readonly',
                    GM_deleteValue: 'readonly',
                    GM_addStyle: 'readonly',
                    GM_registerMenuCommand: 'readonly',
                    GM_openInTab: 'readonly',
                    unsafeWindow: 'readonly'
                },
                rules: {
                    'no-console': 'off',
                    'prefer-const': 'error',
                    'vue/multi-word-component-names': 'off',
                    'no-fallthrough': 'off',
                    'no-unused-vars': 'off',
                    'no-async-promise-executor': 'off',
                    'no-debugger': 'off'
                }
            }
        }),
        serve({
            open: false,
            port: 3003,
            contentBase: 'dist',
        }),
        /*        terser({
                    compress: {
                        drop_console: false, // 不删除 console.log 语句
                        drop_debugger: false // 不删除 debugger 语句
                    }
                })*/
    ],
    output: {
        file: 'dist/local_build.js',
        format: 'iife',
        //hidden为隐藏 source map，inline为内联 source map，separate为外部 source map
        // sourcemap: "inline",
        compact: false,// 压缩代码
        globals: {
            vue: "Vue", // 这里指定 'vue' 模块对应的全局变量名为 'Vue'
            dexie: 'Dexie'
        }
    }
};
