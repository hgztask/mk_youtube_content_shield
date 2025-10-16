import elUtil from "../utils/elUtil.js";
import urlUtil from "../utils/urlUtil.js";
import strUtil from "../utils/strUtil.js";
import video_shielding from "../shieldingModel/video_shielding.js";
import {eventEmitter} from "../model/EventEmitter.js";
import {IntervalExecutor} from "../model/IntervalExecutor.js";

const isUrlPage = (url) => {
    return url.includes('://www.youtube.com/results?search_query=')
}

const getVideoList = async () => {
    const elList = await elUtil.findElements('#page-manager>ytd-search #contents>ytd-video-renderer.style-scope.ytd-item-section-renderer');
    const list = []
    for (const el of elList) {
        const metaEl = el.querySelector('#meta')
        const titleAEl = metaEl.querySelector('#video-title')
        const viewEl = metaEl.querySelector('#separator+span');
        const userAEl = el.querySelector('ytd-channel-name a');
        const durationEl = el.querySelector('.yt-badge-shape__text');
        let duration = -1;
        if (durationEl) {
            duration = strUtil.timeStringToSeconds(durationEl.textContent.trim());
        }
        const view = strUtil.parseView(viewEl.textContent.trim());
        const title = titleAEl.textContent.trim()
        const videoAddress = titleAEl.href
        const videoId = urlUtil.getUrlVideoId(videoAddress)
        const userName = userAEl.textContent.trim();
        const userUrl = decodeURI(userAEl.href);
        const userId = urlUtil.getUrlUserId(userUrl);
        const insertionPositionEl = el.querySelector('#channel-info')
        const explicitSubjectEl = el.querySelector('.text-wrapper.style-scope.ytd-video-renderer');
        list.push({
            el, title, videoAddress, videoId, userName, userUrl, duration, view, userId, insertionPositionEl,
            explicitSubjectEl
        })
    }
    return list;
}

//间隔检查搜索页视频列表屏蔽
const intervalCheckSearchVideoList = new IntervalExecutor(async () => {
    const list = await getVideoList();
    for (const v of list) {
        video_shielding.shieldingVideoDecorated(v).catch(() => {
            eventEmitter.send('event:插入屏蔽按钮', v);
        })
    }
}, {processTips: true, IntervalName: '搜索页视频列表检测'});

/**
 * 搜索页搜到用户栏添加按钮
 * 已防止添加重复的按钮
 */
const addShieldButton = () => {
    const selector = '#page-manager>ytd-search #contents ytd-channel-renderer';
    elUtil.findElements(selector).then(els => {
        const shieldButSelector = selector + ' #subscribe-button>button[gz_type]';
        if (document.querySelector(shieldButSelector)) return;
        for (const el of els) {
            const insertionPositionEl = el.querySelector('#subscribe-button')
            const but = document.createElement('button');
            but.textContent = '屏蔽';
            but.setAttribute('gz_type', '');
            but.addEventListener('click', () => {
                console.log('点击了屏蔽按钮')
                const userAEl = el.querySelector('#main-link');
                const userNameEl = el.querySelector('#channel-title #text')
                const userUrl = decodeURI(userAEl.href);
                const userId = urlUtil.getUrlUserId(userUrl);
                const userName = userNameEl.textContent.trim();
                eventEmitter.send('event:mask_options_dialog_box', {userId, userName, userUrl})
            })
            insertionPositionEl.appendChild(but);
        }
    })
}

//搜索页
export default {
    isUrlPage, intervalCheckSearchVideoList, addShieldButton
}