import {IntervalExecutor} from "../model/IntervalExecutor.js";
import video_shielding from "../shieldingModel/video_shielding.js";
import {eventEmitter} from "../model/EventEmitter.js";
import channelPage from "./channelPage.js";

const isUrlPage = (url = location.href) => {
    if (url.includes('://www.youtube.com/gaming/games')) {
        return false;//排除，该页不处理
    }
    return url.includes('://www.youtube.com/gaming')
}

//间隔检查游戏页视频列表
const intervalCheckGamingVideoList = new IntervalExecutor(async () => {
    const list = await channelPage.getVideoAndLiveDataList();
    for (const v of list) {
        video_shielding.shieldingVideoDecorated(v).catch(() => {
            eventEmitter.send('event:插入屏蔽按钮', v);
        })
    }
}, {processTips: true, intervalName: '游戏页视频列表'})

export default {
    isUrlPage, intervalCheckGamingVideoList
}