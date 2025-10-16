

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


/**
 * 监听网络请求
 * @param callback {function} 回调函数
 */
const addEventListenerNetwork = (callback) => {
    const performanceObserver = new PerformanceObserver(() => {
        const entries = performance.getEntriesByType('resource');
        const windowUrl = window.location.href;
        const winTitle = document.title;
        for (const entry of entries) {
            const url = entry.name;
            const initiatorType = entry.initiatorType;
            if (initiatorType === "img" || initiatorType === "css" || initiatorType === "link" || initiatorType === "beacon") {
                continue;
            }
            try {
                callback(url, windowUrl, winTitle, initiatorType);
            } catch (e) {
                if (e.message === "stopPerformanceObserver") {
                    performanceObserver.disconnect();
                    console.log("已停止性能观察器对象实例", e)
                    break;
                }
                throw e;
            }
        }
        performance.clearResourceTimings();//清除资源时间
    });
    performanceObserver.observe({entryTypes: ['resource']});
}




export default {
    addEventListenerUrlChange,
    addEventListenerNetwork
}
