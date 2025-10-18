import {valueCache} from "../data/valueCache.js";
import elUtil from "../utils/elUtil.js";
import urlUtil from "../utils/urlUtil.js";
import strUtil from "../utils/strUtil.js";
import {eventEmitter} from "../model/EventEmitter.js";
import {IntervalExecutor} from "../model/IntervalExecutor.js";

//判断url是否是稍后再看页或赞过的视频页及是否用户自身的播放列表
const isUrlPage = (url) => {
    return url.includes('/www.youtube.com/playlist?list=')
}

const getVideoList = async () => {
    let rootEl = valueCache.get('rootEl:watchLater');
    if (rootEl === null) {
        rootEl = await elUtil.findElement('ytd-two-column-browse-results-renderer[page-subtype="playlist"]')
        valueCache.set('rootEl:watchLater', rootEl);
    }
    const els = await elUtil.findElements('ytd-playlist-video-list-renderer #contents>ytd-playlist-video-renderer', {doc: rootEl});
    const list = []
    for (const el of els) {
        const explicitSubjectEl = el.querySelector('#meta');
        const insertionPositionEl = el.querySelector('#metadata');
        const titleAEl = explicitSubjectEl.querySelector('a#video-title-link,a#video-title')
        const bylineContainerEl = explicitSubjectEl.querySelector('#byline-container');
        const userAEl = bylineContainerEl.querySelector('a');
        const viewEl = bylineContainerEl.querySelector('#video-info>span');
        const durationEl = el.querySelector('.ytd-thumbnail-overlay-time-status-renderer .yt-badge-shape__text');
        const videoUrl = titleAEl.href;
        const videoId = urlUtil.getUrlVideoId(videoUrl);
        const title = titleAEl.textContent.trim();
        const userName = userAEl.textContent.trim();
        const userUrl = userAEl.href;
        const userId = urlUtil.getUrlUserId(userUrl);
        let channelId = null;
        if (userId == null) {
            channelId = urlUtil.getUrlChannelId(userUrl);
        }
        const viewTxt = viewEl.textContent.trim();
        const view = strUtil.parseView(viewTxt);
        const durationTxt = durationEl ? durationEl.textContent.trim() : null;
        const duration = durationTxt ? strUtil.timeStringToSeconds(durationTxt) : -1;
        list.push({
            el, title, view, userId, videoUrl, userName, videoId, duration, durationTxt,
            insertionPositionEl, explicitSubjectEl, userUrl, channelId
        });
    }
    return list;
}

/**
 * 检查视频列表
 * @return {Promise<void>|null}
 */
const checkVideoList = async () => {
    const list = await getVideoList();
    for (const v of list) {
        eventEmitter.send('event:插入屏蔽按钮', v);
    }
}

//间隔检视频列表
const intervalExecutor = new IntervalExecutor(checkVideoList, {
    processTips: true,
    intervalName: '稍后再看or赞过的视频列表'
});

/**
 * 稍后再看页面or赞过的视频模块，页面不做屏蔽处理，仅用于便捷添加屏蔽数据操作
 * 同样适配用户自身的播放列表
 */
export default {
    isUrlPage, intervalExecutor
}