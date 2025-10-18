import elUtil from "../utils/elUtil.js";
import urlUtil from "../utils/urlUtil.js";
import video_shielding from "../shieldingModel/video_shielding.js";
import {eventEmitter} from "../model/EventEmitter.js";
import {IntervalExecutor} from "../model/IntervalExecutor.js";

const isUrlPage = (url = location.href) => {
    return url.includes('://www.youtube.com/feed/courses_destination');
}

const getCourseList = async () => {
    const els = await elUtil.findElements('#page-manager>ytd-browse:not([page-subtype]) #contents>.style-scope.ytd-rich-shelf-renderer');
    const list = [];
    for (const el of els) {
        const bottomContainerEl = el.querySelector('.yt-lockup-metadata-view-model__text-container')
        const titleAel = bottomContainerEl.querySelector('h3>.yt-lockup-metadata-view-model__title')
        const userAEl = bottomContainerEl.querySelector('a[href^="/@"]')
        const title = titleAel.textContent.trim();
        const videUrl = titleAel.href;
        const videoId = urlUtil.getUrlVideoId(videUrl)
        const userName = userAEl.textContent.trim();
        const userUrl = decodeURI(userAEl.href);
        const userId = urlUtil.getUrlUserId(userUrl);
        list.push({
            title, videUrl, videoId, userName, userUrl, userId, el,
            insertionPositionEl: bottomContainerEl, explicitSubjectEl: bottomContainerEl
        })
    }
    return list
}

//检查课程列表
const checkCourseList = async () => {
    const list = await getCourseList();
    for (const v of list) {
        video_shielding.shieldingVideoDecorated(v).catch(() => {
            eventEmitter.send('event:插入屏蔽按钮', v);
        })
    }
}

//间隔检查课程列表
const intervalCheckCourseList = new IntervalExecutor(checkCourseList, {processTips: true, intervalName: '课程列表'})

/**
 * 课程页面模块
 * 该页面有时候不显示，而是会跳转到学习页面
 */
export default {
    isUrlPage, intervalCheckCourseList
}