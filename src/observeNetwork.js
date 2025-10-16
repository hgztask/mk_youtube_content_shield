/**
 * 监听网络请求
 * @param url {string} 请求的url
 * @param windowUrl {string} 窗口的url
 * @param winTitle {string} 窗口的标题
 * @param initiatorType {string} 请求发起者类型
 */
export default (url, windowUrl, winTitle, initiatorType) => {
    if (url.includes('www.youtube.com/youtubei/v1/player?prettyPrint')) {
        console.log(url, '疑似首页视频列表请求')
    }
}
