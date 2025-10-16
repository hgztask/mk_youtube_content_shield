//获取uil中的频道id

/**
 * 获取url中的频道id
 * 自动解码内容
 * @param url
 * @return {null|string}
 */
const getUrlChannelId = (url) => {
    if (url.includes('www.youtube.com/channel')) {
        const match = url.match(/www.youtube.com\/channel\/(.+)/)?.[1];
        return decodeURI(match);
    }
    return null;
}

/**
 * 获取url中的用户id
 * 自动解码内容
 * @param url {string}
 * @return {string|null}
 */
const getUrlUserId = (url) => {
    if (url.includes('www.youtube.com/@')) {
        const match = url.match(/www.youtube.com\/(.+)/)?.[1];
        return decodeURI(match);
    }
    return null
}

/**
 * 获取url中的视频id
 * 自动解码内容
 * @param url
 * @return {null|string}
 */
const getUrlVideoId = (url) => {
    if (url.includes('://www.youtube.com/watch?v=')) {
        const videoId = parseUrl(url).queryParams['v'];
        return decodeURI(videoId);
    }
    return null;
}

/**
 * 解析 URL
 * @param urlString {string} 要解析的 URL 字符串
 * @returns {{protocol: string, hostname: string, search: string, port: string, queryParams: {}, pathSegments: string[], hash: string, pathname: string}}
 */
const parseUrl = (urlString) => {
    const url = new URL(urlString);
    const pathSegments = url.pathname.split('/').filter(segment => segment !== '');
    const searchParams = new URLSearchParams(url.search.slice(1));
    const queryParams = {};
    for (const [key, value] of searchParams.entries()) {
        queryParams[key] = value;
    }
    return {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        pathSegments,
        search: url.search,
        queryParams,
        hash: url.hash
    };
}

export default {
    getUrlChannelId, getUrlUserId, getUrlVideoId, parseUrl
}