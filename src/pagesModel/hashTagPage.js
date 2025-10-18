import {valueCache} from "../data/valueCache.js";
import elUtil from "../utils/elUtil.js";
import pageCommon from "./pageCommon.js";
import {IntervalExecutor} from "../model/IntervalExecutor.js";
import video_shielding from "../shieldingModel/video_shielding.js";
import {eventEmitter} from "../model/EventEmitter.js";

const isUrlPage = (url = location.href) => {
    return url.includes('://www.youtube.com/hashtag/')
}

const getVideoList = async () => {
    let RootEl = valueCache.get('rootEl:hashtag-landing-page');
    if (RootEl === null) {
        RootEl = await elUtil.findElement('ytd-two-column-browse-results-renderer[page-subtype="hashtag-landing-page"]');
        valueCache.set('rootEl:hashtag-landing-page', RootEl);
    }
    return pageCommon.getMetaVideoList(await elUtil.findElements('#contents>ytd-rich-item-renderer', {doc: RootEl}));
}

window.getVideoList = getVideoList;

//间隔检查tag标签页面视频列表
const intervalTagVideoListExecutor = new IntervalExecutor(async () => {
    const list = await getVideoList();
    for (const v of list) {
        video_shielding.shieldingVideoDecorated(v).catch(() => {
            eventEmitter.send('event:插入屏蔽按钮', v);
        })
    }
}, {processTips: true, intervalName: 'tag标签页面视频列表'});


//tag标签页面模块，如在视频页标题中的#开头的可点击的标签跳转对应的页面
export default {
    isUrlPage, intervalTagVideoListExecutor
}