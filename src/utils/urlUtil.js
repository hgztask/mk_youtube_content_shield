//获取uil中的频道id
import defUtil from "./defUtil.js";

const getUrlChannelId = (url) => {
    if (url.includes('www.youtube.com/channel')) {
        return url.match(/www.youtube.com\/channel\/(.+)/)?.[1];
    }
    return null;
}

//获取url中的用户id
const getUrlUserId = (url) => {
    if (url.includes('www.youtube.com/@')) {
        return url.match(/www.youtube.com\/(.+)/)?.[1];
    }
    return null
}

//获取url中的视频id
const getUrlVideoId = (url) => {
    if (url.includes('://www.youtube.com/watch?v=')) {
        return defUtil.parseUrl(url).queryParams['v']
    }
    return null;
}


export default {
    getUrlChannelId, getUrlUserId, getUrlVideoId
}