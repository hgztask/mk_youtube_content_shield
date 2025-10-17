import {valueCache} from "../data/valueCache.js";
import elUtil from "../utils/elUtil.js";
import pageCommon from "./pageCommon.js";
import {IntervalExecutor} from "../model/IntervalExecutor.js";
import video_shielding from "../shieldingModel/video_shielding.js";
import {eventEmitter} from "../model/EventEmitter.js";

const isUrlPage = (url = location.href) => {
    return url.endsWith('//www.youtube.com/podcasts')
}

//空列表
const emptyList = []

const getPodcastsList = async () => {
    let rootEl = valueCache.get('rootEl:podcasts');
    if (rootEl === null) {
        const els = await elUtil.findElements('ytd-two-column-browse-results-renderer.style-scope.ytd-browse.grid.grid-disabled[disable-grid-state-aware]')
        for (let el of els) {
            if (el.querySelector('a[href^="/podcasts"]')) {
                rootEl = el;
                valueCache.set('rootEl:podcasts', rootEl);
            }
        }
    }
    if (rootEl === null) return emptyList;
    const els = await elUtil.findElements('#contents>ytd-rich-item-renderer', {doc: rootEl});
    return pageCommon.getMetaVideoList(els);
}

window.getPodcastsList = getPodcastsList;

//间隔检查博客内容列表
const intervalPodcastsListExecutor = new IntervalExecutor(async () => {
    const list = await getPodcastsList();
    for (const v of list) {
        video_shielding.shieldingVideoDecorated(v).catch(() => {
            eventEmitter.send('event:插入屏蔽按钮', v);
        })
    }
}, {processTips: true, IntervalName: '博客内容列表检测'})


//博客页面模块
export default {
    isUrlPage, intervalPodcastsListExecutor
}