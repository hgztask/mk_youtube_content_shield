import elUtil from "../utils/elUtil.js";
import urlUtil from "../utils/urlUtil.js";
import strUtil from "../utils/strUtil.js";
import {IntervalExecutor} from "../model/IntervalExecutor.js";
import video_shielding from "../shieldingModel/video_shielding.js";
import {eventEmitter} from "../model/EventEmitter.js";

const isUrlPage = (url = location.href) => {
    return url.includes('://www.youtube.com/gaming')
}

const getVideoList = async () => {
    const elList = await elUtil.findElements('ytd-browse[page-subtype="channels"] #items>ytd-grid-video-renderer');
    const list = [];
    for (const el of elList) {
        const explicitSubjectEl = el.querySelector('#meta');
        const insertionPositionEl = el.querySelector('#metadata');
        const titleAEl = explicitSubjectEl.querySelector('#video-title')
        const userAEl = insertionPositionEl.querySelector('#text-container a')
        const viewEl = insertionPositionEl.querySelector('#metadata-line>span')
        const durationEl = el.querySelector('.yt-badge-shape__text');
        const durationTxt = durationEl ? durationEl.textContent.trim() : null;
        let duration = -1;
        if (durationEl) {
            if (!durationTxt.includes(':')) {
                console.log('该内容疑似非视频')
                continue;
            }
            duration = strUtil.timeStringToSeconds(durationTxt);
        }
        const title = titleAEl.textContent.trim();
        const videoAddress = titleAEl.href;
        const userUrl = userAEl.href;
        const viewText = viewEl.textContent.trim();
        const videoId = urlUtil.getUrlVideoId(videoAddress);
        const userId = urlUtil.getUrlUserId(userUrl);
        const view = strUtil.parseView(viewText);
        list.push({
            el, title, userId, videoAddress, userUrl, videoId, insertionPositionEl, explicitSubjectEl,
            duration, durationTxt, view
        })
    }
    return list;
}

//间隔检查游戏页视频列表
const intervalCheckGamingVideoList = new IntervalExecutor(async () => {
    const list = await getVideoList();
    for (const v of list) {
        video_shielding.shieldingVideoDecorated(v).catch(() => {
            eventEmitter.send('event:插入屏蔽按钮', v);
        })
    }
}, {processTips: true, IntervalName: '检查游戏页视频列表'})

export default {
    isUrlPage, getVideoList, intervalCheckGamingVideoList
}