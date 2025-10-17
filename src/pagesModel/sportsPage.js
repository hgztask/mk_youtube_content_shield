import {valueCache} from "../data/valueCache.js";
import elUtil from "../utils/elUtil.js";
import pageCommon from "./pageCommon.js";
import {IntervalExecutor} from "../model/IntervalExecutor.js";
import {eventEmitter} from "../model/EventEmitter.js";
import video_shielding from "../shieldingModel/video_shielding.js";

const isUrlPage = (url = location.href) => {
    return url.endsWith('//www.youtube.com/channel/UCEgdi0XIXXZ-qJOFPf4JSKw')
}

//获取体育内容列表-直播and视频
const getSportsList = async () => {
    let rootEl = valueCache.get('rootEl:sports');
    if (rootEl === null) {
        rootEl = await elUtil.findElement('ytd-two-column-browse-results-renderer[page-subtype="sports"]');
        valueCache.set('rootEl:sports', rootEl);
    }
    const els = await elUtil.findElements('#contents>ytd-rich-item-renderer', {doc: rootEl})
    return pageCommon.getMetaVideoList(els);
}

//间隔检查体育内容列表
const intervalSportsListExecutor = new IntervalExecutor(async () => {
    const list = await getSportsList();
    for (const v of list) {
        video_shielding.shieldingVideoDecorated(v).catch(() => {
            eventEmitter.send('event:插入屏蔽按钮', v);
        })
    }
}, {processTips: true, IntervalName: '体育内容列表检测'})

//体育页面模块
export default {
    isUrlPage, intervalSportsListExecutor
}