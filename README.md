# youtube内容屏蔽器

<hr>
本地开发配置：

1. 安装油猴插件(篡改猴)，下载地址:https://chrome.zzzmh.cn/info/dhdgffkkebhmkfjojejmpbldmpobfkfo
2. 安装之后需要再油猴插件中右击选择【管理拓展】，勾选【允许访问文件 URL】
3. 在油猴插件中新建脚本并填写如下内容

油猴脚本本地头部配置内容

```javascript
// ==UserScript==
// @name        youtube内容屏蔽器
// @namespace   http://tampermonkey.net/
// @license     Apache-2.0
// @version     1.0
// @author      byhgz
// @description 对油管站内视频屏蔽处理
// @icon        https://static.hdslb.com/images/favicon.ico
// @noframes
// @run-at      document-start
// @require     data:text/plain;base64,d2luZG93LnRlc3RUcnVzdGVkID0gZnVuY3Rpb24oKSB7CmlmICh0eXBlb2Ygd2luZG93ICE9ICJ1bmRlZmluZWQiICYmCiAgICgndHJ1c3RlZFR5cGVzJyBpbiB3aW5kb3cpICYmCiAgICgnY3JlYXRlUG9saWN5JyBpbiB3aW5kb3cudHJ1c3RlZFR5cGVzKSAmJgogICAodHlwZW9mIHdpbmRvdy50cnVzdGVkVHlwZXMuY3JlYXRlUG9saWN5ID09ICJmdW5jdGlvbiIpKSB7Cgl3aW5kb3cudHJ1c3RlZFR5cGVzLmNyZWF0ZVBvbGljeSgnZGVmYXVsdCcsIHtjcmVhdGVTY3JpcHRVUkw6IHMgPT4gcywgY3JlYXRlU2NyaXB0OiBzID0+IHMsIGNyZWF0ZUhUTUw6IHMgPT4gc30pCn0gZWxzZSB7CglzZXRUaW1lb3V0KHdpbmRvdy50ZXN0VHJ1c3RlZCwgMTAwMCk7Cn0KfQp3aW5kb3cudGVzdFRydXN0ZWQoKTs=
// @require     https://unpkg.com/vue@2.7.16/dist/vue.min.js
// @require     https://unpkg.com/element-ui@2.15.14/lib/index.js
// @require     file://E:\js\dist\local_build.js
// @match       *://www.youtube.com/*
// @match       *://localhost/*
// @exclude     *://localhost:3000/*
// @exclude     *://localhost:3002/*
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       GM_unregisterMenuCommand
// @grant       GM_registerMenuCommand
// @grant       GM_openInTab
// ==/UserScript==
/**
 * 上面中的引用地址，根据项目本地实际路径进行修改，这里仅供参考
 * file://E:\js\dist\local_build.js
 *
 */
```

- `// @exclude     *://localhost:3003/*`