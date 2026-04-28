import mkUtil from "./mkUtil.js";

//去除块注释和部分单行注释
const clearComments = (content) => {
    //定义正则表达式，匹配块注释和部分单行注释
    const commentRegex = /^\s+\/\/.*|^\/\/.*|\/\*[\s\S]*?\*\//gm
    return content.replace(commentRegex, '')
}
//清除换行
const clearLine = (content) => {
    return content.replace(/[\r\n]+/gm, '\n')
}


function getBanner(platform) {
    const readTamperMonkey = mkUtil.readTamperMonkey("tamper_monkey.json");
    const requireList = readTamperMonkey.notDevData.require;
    if (platform === "greasyFork") {
        requireList.unshift("https://update.greasyfork.org/scripts/575775/1810724/Trusted%20Types%20%E5%85%BC%E5%AE%B9%E8%A1%A5%E4%B8%81.js")
    } else {
        requireList.unshift("data:text/plain;base64,d2luZG93LnRlc3RUcnVzdGVkID0gZnVuY3Rpb24oKSB7CmlmICh0eXBlb2Ygd2luZG93ICE9ICJ1bmRlZmluZWQiICYmCiAgICgndHJ1c3RlZFR5cGVzJyBpbiB3aW5kb3cpICYmCiAgICgnY3JlYXRlUG9saWN5JyBpbiB3aW5kb3cudHJ1c3RlZFR5cGVzKSAmJgogICAodHlwZW9mIHdpbmRvdy50cnVzdGVkVHlwZXMuY3JlYXRlUG9saWN5ID09ICJmdW5jdGlvbiIpKSB7Cgl3aW5kb3cudHJ1c3RlZFR5cGVzLmNyZWF0ZVBvbGljeSgnZGVmYXVsdCcsIHtjcmVhdGVTY3JpcHRVUkw6IHMgPT4gcywgY3JlYXRlU2NyaXB0OiBzID0+IHMsIGNyZWF0ZUhUTUw6IHMgPT4gc30pCn0gZWxzZSB7CglzZXRUaW1lb3V0KHdpbmRvdy50ZXN0VHJ1c3RlZCwgMTAwMCk7Cn0KfQp3aW5kb3cudGVzdFRydXN0ZWQoKTs=")
    }
    return mkUtil.generateTamperMeta(readTamperMonkey.notDevData)
}


export default (userOptions = {}) => {
    userOptions = {
        ...{
            clearComments: false,
            platform: "scriptCat"
        }, ...userOptions
    }
    return {
        name: 'mk-plugin',
        transform(code, id) {
            if (userOptions.isDev) {
                return null;
            }
            if (id.endsWith('dev.ts')) {
                return {code: ''}
            }
            return null
        },
        // 处理每个分块
        renderChunk(code, chunk) {
            let newCode;
            // 处理换行符，每段落之间保留一个换行
            if (userOptions.clearComments) {
                //是否清除注释
                newCode = clearComments(code);
            } else {
                newCode = code;
            }
            newCode = clearLine(newCode);
            if (userOptions.isDev) {
                return newCode;
            }
            const banner = getBanner(userOptions.platform);
            if (banner === null) {
                return newCode
            }
            return `${banner}
            ${newCode}`
        }
    };
}
