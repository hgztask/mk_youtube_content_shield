import elUtil from "../utils/elUtil.js";
import {IntervalExecutor} from "../model/IntervalExecutor.js";
import {eventEmitter} from "../model/EventEmitter.js";
import video_shielding from "../shieldingModel/video_shielding.js";
import {isDelLiveHomeTopBannerGm} from "../data/localMKData.js";
import pageCommon from "./pageCommon.js";

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
    return pageCommon.getMetaVideoList(elList);
}

//间隔检查直播列表
const intervalLiveListExecutor = new IntervalExecutor(async () => {
    const list = await getLiveList();
    for (const v of list) {
        video_shielding.shieldingVideoDecorated(v).catch(() => {
            eventEmitter.send('event:插入屏蔽按钮', v);
        })
    }
}, {processTips: true, intervalName: '直播列表'})

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