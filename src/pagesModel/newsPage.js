import {valueCache} from "../data/valueCache.js";
import elUtil from "../utils/elUtil.js";
import pageCommon from "./pageCommon.js";
import {IntervalExecutor} from "../model/IntervalExecutor.js";
import video_shielding from "../shieldingModel/video_shielding.js";
import {eventEmitter} from "../model/EventEmitter.js";

const isUrlPage = (url = location.href) => {
    return url.includes('//www.youtube.com/channel/UCYfdidRxbB8Qhf0Nx7ioOYw') ||
        url.includes('/www.youtube.com/feed/news_destination');
}

const getNewsVideoList = async () => {
    let rootEl = valueCache.get('rootEl:news');
    if (rootEl === null) {
        rootEl = await elUtil.findElement('ytd-two-column-browse-results-renderer[page-subtype="news"]')
        valueCache.set('rootEl:news', rootEl);
    }
    const els = await elUtil.findElements('#contents ytd-rich-item-renderer', {doc: rootEl});
    return pageCommon.getMetaVideoList(els);
}

//间隔检查新闻列表
const intervalNewsVideoListExecutor = new IntervalExecutor(async () => {
    const list = await getNewsVideoList();
    for (const v of list) {
        video_shielding.shieldingVideoDecorated(v).catch(() => {
            eventEmitter.send('event:插入屏蔽按钮', v);
        })
    }
}, {processTips: true, intervalName: '新闻'})


//新闻页面模块
export default {
    isUrlPage, intervalNewsVideoListExecutor
}