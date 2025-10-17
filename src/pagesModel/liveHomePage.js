import elUtil from "../utils/elUtil.js";
import strUtil from "../utils/strUtil.js";
import urlUtil from "../utils/urlUtil.js";
import {IntervalExecutor} from "../model/IntervalExecutor.js";
import {eventEmitter} from "../model/EventEmitter.js";
import video_shielding from "../shieldingModel/video_shielding.js";
import {isDelLiveHomeTopBannerGm} from "../data/localMKData.js";

const defLiveHomeListSelector = 'ytd-rich-item-renderer.style-scope.ytd-rich-shelf-renderer';
let liveRootEl = null;

//获取直播首页根元素
const getLiveHomRootEl = async () => {
    if (liveRootEl !== null) return liveRootEl;
    liveRootEl = await elUtil.findElement('ytd-browse[page-subtype="live"]');
    return liveRootEl;
}

const isUrlPage = (url = location.href) => {
    return url.endsWith('://www.youtube.com/channel/UC4R8DWoMoI7CAwX8_LjQHig') ||
        url.includes('://www.youtube.com/channel/UC4R8DWoMoI7CAwX8_LjQHig/livetab')
}

//是否为直播首页中的其他页面，属于直播首页的子页面
const isUrlOtherLivePage = (url = location.href) => {
    return url.includes('://www.youtube.com/channel/UC4R8DWoMoI7CAwX8_LjQHig/livetab?ss=')
}

//获取直播列表
const getLiveList = async () => {
    const liveHomRootEl = await getLiveHomRootEl();
    let selector;
    if (isUrlOtherLivePage()) {
        selector = 'ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer'
    } else {
        selector = defLiveHomeListSelector;
    }
    const elList = await elUtil.findElements(selector, {doc: liveHomRootEl});
    const list = [];
    for (const el of elList) {
        const explicitSubjectEl = el.querySelector('#meta');
        const insertionPositionEl = el.querySelector('#metadata');
        const titleAEl = explicitSubjectEl.querySelector('#video-title-link')
        const titleEl = titleAEl.querySelector('#video-title')
        const userAEl = insertionPositionEl.querySelector('#text-container a')
        const viewEl = insertionPositionEl.querySelector('#metadata-line>span')
        const durationEl = el.querySelector('.yt-badge-shape__text');
        const durationTxt = durationEl ? durationEl.textContent.trim() : null;
        let duration = -1, view = -1;
        if (durationEl) {
            if (durationTxt.includes(':')) {
                duration = strUtil.timeStringToSeconds(durationTxt);
            }
        }
        if (viewEl) {
            const viewText = viewEl.textContent.trim();
            // 过滤掉预定发布时间和即将开始
            if (!viewText.includes('预定发布时间') || durationTxt !== '即将开始') {
                view = strUtil.parseView(viewText);
            }
        }
        const title = titleEl.textContent.trim();
        const videoAddress = titleAEl.href;
        const userUrl = userAEl.href;
        const videoId = urlUtil.getUrlVideoId(videoAddress);
        const userId = urlUtil.getUrlUserId(userUrl);
        list.push({
            el, title, view, userId, videoAddress, userUrl, duration, videoId,
            insertionPositionEl, explicitSubjectEl, durationTxt
        });
    }
    return list;
}

//间隔检查直播列表
const intervalLiveListExecutor = new IntervalExecutor(async () => {
    const list = await getLiveList();
    for (const v of list) {
        video_shielding.shieldingVideoDecorated(v).catch(() => {
            eventEmitter.send('event:插入屏蔽按钮', v);
        })
    }
}, {processTips: false, IntervalName: '直播列表检测'})


//删除顶部大横幅推荐
const removeLiveHomeTopBanner = async () => {
    if (!isUrlPage()) return;
    if (isUrlOtherLivePage()) return
    if (!isDelLiveHomeTopBannerGm()) return;
    const liveHomeEl = await getLiveHomRootEl();
    const el = await elUtil.findElement('#content>ytd-carousel-item-renderer', {doc: liveHomeEl});
    el.remove();
    console.log('已删除直播首页顶部大横幅推荐', el);
}


//直播首页模块
export default {
    isUrlPage, getLiveList, intervalLiveListExecutor, removeLiveHomeTopBanner
}