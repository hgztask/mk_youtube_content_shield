/**
 * 监听url变化
 * @param callback {function} 回调函数
 * @param timeout {number} 检测间隔时间，默认1000毫秒
 */
const addEventListenerUrlChange = (callback,timeout = 1000) => {
    let oldUrl = window.location.href;
    setInterval(() => {
        const newUrl = window.location.href;
        if (oldUrl === newUrl) return;
        oldUrl = newUrl;
        callback(newUrl, oldUrl, document.title)
    }, timeout);
}

export default {
    addEventListenerUrlChange
}
