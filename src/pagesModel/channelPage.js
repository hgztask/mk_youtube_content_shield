import elUtil from "../utils/elUtil.js";
import urlUtil from "../utils/urlUtil.js";
import {IntervalExecutor} from "../model/IntervalExecutor.js";
import {eventEmitter} from "../model/EventEmitter.js";
import video_shielding from "../shieldingModel/video_shielding.js";
import pageCommon from "./pageCommon.js";

//获取url中当前平道选中的标签
const getChannelPageCurrentTab = (parseUrl) => {
    const pathSegments = parseUrl.pathSegments;
    if (pathSegments.length <= 1) {
        return null;
    }
    return pathSegments[2];
}

const isUrlPage = (url = location.href) => {
    return url.includes('://www.youtube.com/channel/');
}
/**
 * 判断是否是用户页的频道
 *建议在页面加载完之后执行
 * @param url {string}
 * @returns {boolean}
 */
const isUserChannelPage = (url = location.href) => {
    if (!isUrlPage(url)) {
        return false;
    }
    const el = document.querySelector(
        'yt-decorated-avatar-view-model+div>yt-content-metadata-view-model>div:first-child');
    return el !== null;
}

//获取数据列表，直播和视频
const getVideoAndLiveDataList = async () => {
    const elList = await elUtil.findElements('ytd-browse[page-subtype="channels"] #items>ytd-grid-video-renderer');
    return pageCommon.getMetaVideoList(elList);
}

//间隔检查频道页视频和直播列表
const intervalChannelPageVideoAndLiveListExecutor = new IntervalExecutor(async () => {
    const list = await getVideoAndLiveDataList();
    for (const v of list) {
        video_shielding.shieldingVideoDecorated(v).catch(() => {
            eventEmitter.send('event:插入屏蔽按钮', v);
        })
    }
}, {processTips: true, IntervalName: '检查频道页视频和直播列表'})

//获取一起玩的视频合集列表
const getLetsPlayVideoList = async () => {
    const elList = await elUtil.findElements('.ytd-grid-renderer.lockup.yt-lockup-view-model--wrapper');
    const list = [];
    for (const el of elList) {
        const metadataEl = el.querySelector('.yt-lockup-view-model__metadata');
        const titleAel = metadataEl.querySelector('a.yt-lockup-metadata-view-model__title');
        const bottomInfoEl = metadataEl.querySelector('.yt-content-metadata-view-model');
        const userAEl = bottomInfoEl.querySelector('a[href^="/@"]')
        const title = titleAel.textContent.trim();
        const videoAddress = titleAel.href;
        const videoId = urlUtil.getUrlVideoId(videoAddress);
        const userUrl = decodeURI(userAEl.href);
        const userId = urlUtil.getUrlUserId(userUrl);
        const userName = userAEl.textContent.trim();
        const playListAEl = bottomInfoEl.querySelector('a[href^="/playlist?list="]');
        const playListUrl = decodeURI(playListAEl.href);
        list.push({
            insertionPositionEl: metadataEl, explicitSubjectEl: metadataEl,
            el, title, videoAddress, videoId, userId, userName, userUrl, playListUrl
        })
    }
    return list;
}

//检查一起玩的视频合集列表
const checkLetsPlayVideoList = async () => {
    const list = await getLetsPlayVideoList();
    for (const v of list) {
        video_shielding.shieldingVideoDecorated(v).catch(() => {
            eventEmitter.send('event:插入屏蔽按钮', v);
        })
    }
}

//动态运行
const dynamicRun = (parseUrl) => {
    const currentTab = getChannelPageCurrentTab(parseUrl);
    if (currentTab === 'letsplay') {
        console.log('频道页中的一起玩')
        intervalChannelPageVideoAndLiveListExecutor.stop();
        checkLetsPlayVideoList()
        return;
    }
    if (currentTab === null) {
        intervalChannelPageVideoAndLiveListExecutor.stop();
        return;
    }
    console.log('测试频道页')
    intervalChannelPageVideoAndLiveListExecutor.start();
}

//频道页模块
export default {
    isUrlPage, getVideoAndLiveDataList, getChannelPageCurrentTab, dynamicRun,
    isUserChannelPage, intervalChannelPageVideoAndLiveListExecutor
}