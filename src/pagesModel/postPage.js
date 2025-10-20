import elUtil from "../utils/elUtil.js";
import pageCommon from "./pageCommon.js";
import {IntervalExecutor} from "../model/IntervalExecutor.js";
import {eventEmitter} from "../model/EventEmitter.js";
import comments_shielding from "../shieldingModel/comments_shielding.js";

const isUrlPage = (url) => {
    return url.includes('//www.youtube.com/post/')
}

const getCommentList = async () => {
    const elList = await elUtil.findElements('#contents>ytd-comment-thread-renderer.style-scope.ytd-item-section-renderer');
    return pageCommon.extractCommentList(elList);
}

//间隔检测帖子页底下评论区屏蔽
const intervalPostCommentsListExecutor = new IntervalExecutor(async () => {
    const list = await getCommentList();
    for (const contentData of list) {
        comments_shielding.shieldingCommentDecorated(contentData).catch((list) => {
            list.forEach(v => eventEmitter.send('event:插入屏蔽按钮', v));
        })
    }
}, {processTips: true, intervalName: '帖子页'})


//帖子页，类似于动态评论页
export default {
    isUrlPage, intervalPostCommentsListExecutor
}
