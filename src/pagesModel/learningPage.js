import elUtil from "../utils/elUtil.js";
import pageCommon from "./pageCommon.js";
import {IntervalExecutor} from "../model/IntervalExecutor.js";
import video_shielding from "../shieldingModel/video_shielding.js";
import {eventEmitter} from "../model/EventEmitter.js";

const isUrlPage = (url = location.href) => {
    return url.endsWith('//www.youtube.com/learning') ||
        url.endsWith('//www.youtube.com/channel/UCtFRv9O2AHqOZjjynzrv-xg');
}

//获取学习视频列表
const getLearningList = async () => {
    const els = await elUtil.findElements('ytd-two-column-browse-results-renderer[page-subtype="learning"] #contents>.style-scope.ytd-rich-shelf-renderer');
    return pageCommon.getMetaVideoList(els);
}

//间隔检查学习列表
const intervalLearningListExecutor = new IntervalExecutor(async () => {
    const list = await getLearningList();
    for (const v of list) {
        video_shielding.shieldingVideoDecorated(v).catch(() => {
            eventEmitter.send('event:插入屏蔽按钮', v);
        })
    }
}, {processTips: true, intervalName: '学习列表检测'})

//学习页面模块
export default {
    isUrlPage, intervalLearningListExecutor
}