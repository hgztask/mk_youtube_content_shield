import {returnTempVal} from "../data/globalValue.js";
import shielding, {blockUserId, blockUserName} from "./shielding.js";
import {
    blockChannelId,
    blockUserIdAssociatedWithChannelId,
    blockUserIDAssociatedWithUserName,
    blockUserNameAssociatedWithChannelId
} from "./video_shielding.js";
import {eventEmitter} from "../model/EventEmitter.js";

//根据评论内容检查屏蔽
const blockComment = (comment) => {
    return shielding.blockExactAndFuzzyMatching(comment, {
        fuzzyKey: 'comment', fuzzyTypeName: '模糊评论',
        regexKey: 'comment_regex', regexTypeName: '正则评论'
    })
}

/**
 * 屏蔽单个评论项
 * @param commentsData {{}}
 * @returns {Object}
 * @property {boolean} state 是否屏蔽
 * @property {string} type 屏蔽的类型
 * @property {string} matching 匹配到的规则`
 */
const shieldingComment = (commentsData) => {
    const {userId, userName, channelId, content} = commentsData;
    let returnVal = blockUserName(userName)
    if (returnVal.state) return returnVal;
    returnVal = blockComment(content)
    if (returnVal.state) return returnVal;
    returnVal = blockUserId(userId);
    if (returnVal.state) return returnVal;
    returnVal = blockChannelId(channelId);
    if (returnVal.state) return returnVal;
    returnVal = blockUserIDAssociatedWithUserName(userId, userName);
    if (returnVal.state) return returnVal;
    returnVal = blockUserIdAssociatedWithChannelId(userId, channelId);
    if (returnVal.state) return returnVal;
    returnVal = blockUserNameAssociatedWithChannelId(userName, channelId);
    if (returnVal.state) return returnVal;
    return returnTempVal
}

//屏蔽评论项-包装类
const shieldingCommentDecorated = async (commentData) => {
    const testResults = shieldingComment(commentData);
    const {state, type, matching, el} = testResults;
    if (state) {
        commentData.testResults = testResults;
        const {content} = commentData;
        eventEmitter.send('event:print-msg', {msg: `${type}规则【${matching}】屏蔽评论【${content}】`, data: commentData})
        el.remove();
        return
    }
    const list = [];
    list.push(commentData);
    for (const replyData of commentData.reply) {
        const testResults = shieldingComment(replyData);
        const {state, type, matching, el} = testResults
        if (state) {
            replyData.testResults = testResults;
            eventEmitter.send('event:print-msg', {msg: `根据【${type}】规则【${matching}】屏蔽评论`, data: replyData})
            el.remove();
            continue;
        }
        list.push(replyData);
    }
    //返回需要添加的屏蔽按钮项目
    return Promise.reject(list)
}


export default {
    shieldingCommentDecorated
}