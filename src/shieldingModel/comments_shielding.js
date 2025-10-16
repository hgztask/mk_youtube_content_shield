import {returnTempVal} from "../data/globalValue.js";
import shielding, {blockUserId, blockUserName} from "./shielding.js";
import {blockChannelId} from "./video_shielding.js";

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
    return returnTempVal
}

//屏蔽评论项-包装类
const shieldingCommentDecorated = async (commentData) => {
    const {state, type, matching, el} = shieldingComment(commentData);
    if (state) {
        console.log(`根据【${type}】规则【${matching}】屏蔽评论`, commentData)
        el.remove();
        return
    }
    const list = [];
    list.push(commentData);
    for (const replyData of commentData.reply) {
        const {state, type, matching, el} = shieldingComment(replyData)
        if (state) {
            console.log(`根据【${type}】规则【${matching}】屏蔽评论`, replyData)
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