import {valueCache} from "../data/valueCache.js";
import elUtil from "../utils/elUtil.js";
import pageCommon from "./pageCommon.js";
import video_shielding from "../shieldingModel/video_shielding.js";
import {eventEmitter} from "../model/EventEmitter.js";
import {IntervalExecutor} from "../model/IntervalExecutor.js";

const isUrlPage = (url = location.href) => {
    return url.endsWith('//www.youtube.com/channel/UCrpQ4p1Ql_hG8rKXIKM1MOQ')
}

//获取时尚内容列表
const getFashionList = async () => {
    let rootEl = valueCache.get('rootEl:fashion');
    if (rootEl === null) {
        rootEl = await elUtil.findElement('ytd-two-column-browse-results-renderer[page-subtype="fashion"]');
    }
    const els = await elUtil.findElements('#contents>ytd-rich-item-renderer', {doc: rootEl});
    return pageCommon.getMetaVideoList(els);
}

//间隔检查时尚内容列表
const intervalFashionListExecutor = new IntervalExecutor(async () => {
    const list = await getFashionList();
    for (const v of list) {
        video_shielding.shieldingVideoDecorated(v).catch(() => {
            eventEmitter.send('event:插入屏蔽按钮', v);
        })
    }
}, {processTips: true, intervalName: '时尚与美容内容列表'})

//时尚与美容页面模块
export default {
    isUrlPage, intervalFashionListExecutor
}