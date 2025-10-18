import elUtil from "../utils/elUtil.js";
import {valueCache} from "../data/valueCache.js";
import urlUtil from "../utils/urlUtil.js";
import {IntervalExecutor} from "../model/IntervalExecutor.js";
import video_shielding from "../shieldingModel/video_shielding.js";
import {eventEmitter} from "../model/EventEmitter.js";

const isUrlPage = (url = location.href) => {
    return url.includes('//www.youtube.com/feed/history');
}

const getVideoList = async () => {
    let rootEl = valueCache.get('rootEl:history');
    if (rootEl === null) {
        rootEl = await elUtil.findElement('ytd-two-column-browse-results-renderer[page-subtype="history"]')
    }
    const els = await elUtil.findElements('#contents>yt-lockup-view-model', {doc: rootEl});
    const list = []
    for (const el of els) {
        const metadataEl = el.querySelector('.yt-lockup-view-model__metadata')
        const titleAel = metadataEl.querySelector('a.yt-lockup-metadata-view-model__title')
        const nameEl = metadataEl.querySelector('.yt-content-metadata-view-model span')
        const title = titleAel.textContent.trim();
        const videoUrl = titleAel.href;
        const videoId = urlUtil.getUrlVideoId(videoUrl);
        const userName = nameEl.textContent.trim();
        const insertionPositionEl = metadataEl.querySelector(
            '.yt-content-metadata-view-model__metadata-row.yt-content-metadata-view-model__metadata-row--metadata-row-padding')
        list.push({
            title, insertionPositionEl, explicitSubjectEl: metadataEl,
            videoUrl, videoId, userName, el
        })
    }
    return list;
}

//间隔检查历史列表
const intervalHistoryVideoListExecutor = new IntervalExecutor(async () => {
    const list = await getVideoList();
    for (const v of list) {
        video_shielding.shieldingVideoDecorated(v).catch(() => {
            eventEmitter.send('event:插入屏蔽按钮', v);
        })
    }
}, {processTips: true, intervalName: '历史记录列表'})

//历史页面模块
export default {
    isUrlPage, intervalHistoryVideoListExecutor
}