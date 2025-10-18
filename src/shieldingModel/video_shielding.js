import {eventEmitter} from "../model/EventEmitter.js";
import {elEventEmitter} from "../model/elEventEmitter.js";
import {promiseReject, returnTempVal} from "../data/globalValue.js";
import shielding, {blockUserId, blockUserName} from "./shielding.js";
import ruleMatchingUtil from "../utils/ruleMatchingUtil.js";
import gmUtil from "../utils/gmUtil.js";

//根据标题检查屏蔽
export const blockTitle = (title) => {
    return shielding.blockExactAndFuzzyMatching(title, {
        fuzzyKey: 'title', fuzzyTypeName: '模糊标题',
        regexKey: 'title_regex', regexTypeName: '正则标题'
    })
}

//根据视频id检查屏蔽
export const blockVideoId = (id) => {
    if (ruleMatchingUtil.exactMatch(gmUtil.getData('videoId_precise', []), id)) {
        return {state: true, type: '精确视频id', matching: id};
    }
    return returnTempVal;
}

//根据频道id检查屏蔽
export const blockChannelId = (id) => {
    if (ruleMatchingUtil.exactMatch(gmUtil.getData('channelId_precise', []), id)) {
        return {state: true, type: '精确频道id', matching: id};
    }
    return returnTempVal;
}

eventEmitter.on('event:插入屏蔽按钮', (videoOrCommentData) => {
    const {insertionPositionEl, explicitSubjectEl, el} = videoOrCommentData;
    let but = el.querySelector('button[gz_type]');
    if (but !== null) return;
    but = document.createElement('button')
    but.setAttribute('gz_type', '');
    but.textContent = '屏蔽';
    but.addEventListener('click', (event) => {
        event.stopImmediatePropagation(); // 阻止事件冒泡和同一元素上的其他事件处理器
        event.preventDefault(); // 阻止默认行为
        console.log('点击了屏蔽按钮', videoOrCommentData);
        eventEmitter.emit('event:mask_options_dialog_box', videoOrCommentData)
    })
    insertionPositionEl.appendChild(but);
    //当没有显隐主体元素，则主动隐藏，不添加鼠标经过显示移开隐藏事件
    if (explicitSubjectEl) {
        but.style.display = "none";
        elEventEmitter.addEvent(explicitSubjectEl, "mouseout", () => but.style.display = "none");
        elEventEmitter.addEvent(explicitSubjectEl, "mouseover", () => but.style.display = "");
    }
})

/**
 * 屏蔽视频
 * @param videoData {{}} 视频数据
 * @returns {Object}结果对象，其中包括状态state，和消息msg
 * @property {boolean} state 是否屏蔽
 * @property {string} type 屏蔽了的类型
 * @property {string} matching 匹配到的规则
 * @returns {{state:boolean,type:string|any,matching:string|any}} 是否屏蔽
 */
const shieldingVideo = (videoData) => {
    const {title, userId, duration, userName, videoId, view, channelId, userNameList} = videoData;
    let res = blockTitle(title);
    if (res.state) return res;
    res = blockUserName(userName);
    if (userNameList) {
        for (const n of userNameList) {
            res = blockUserName(userName);
            if (res.state) return res;
        }
    }
    if (res.state) return res;
    res = blockUserId(userId);
    if (res.state) return res;
    res = blockVideoId(videoId);
    if (res.state) return res;
    res = blockChannelId(channelId);
    if (res.state) return res;
    //表面放行该内容
    return returnTempVal;
}

/**
 * 装饰过的屏蔽视频
 * @param videoData {{}} 视频数据
 */
const shieldingVideoDecorated = async (videoData) => {
    const testResults = shieldingVideo(videoData);
    const {state, type, matching} = testResults;
    if (state) {
        videoData['testResults'] = testResults;
        const {title} = videoData
        eventEmitter.send('event:print-msg', {msg: `${type}规则【${matching}】屏蔽视频【${title}】`, data: videoData})
        videoData.el.remove();
        return
    }
    return promiseReject
}

export default {
    shieldingVideoDecorated
}