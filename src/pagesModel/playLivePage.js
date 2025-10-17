import elUtil from "../utils/elUtil.js";
import controlStyle from '../css/gz-style.css'
import {eventEmitter} from "../model/EventEmitter.js";
import {IntervalExecutor} from "../model/IntervalExecutor.js";

/**
 * 判断播放页当前是否为直播
 * aria-label值不为空时为直播状态\
 * 在页面元素初次加载完后但aria-label值为空时，后续的定位el用于最后确认是否为直播状态。
 * 测试时可在第二处el处下断点刷新页面来调试
 * @returns {Promise<boolean>}
 */
const isLivePage = async () => {
    let el = await elUtil.findElement('#view-count[aria-label]');
    const ariaLabel = el.getAttribute('aria-label');
    if (ariaLabel !== '') {
        return true;
    }
    el = document.querySelector('#info-container #info.style-scope.ytd-watch-info-text>.style-scope.yt-formatted-string');
    if (el === null) {
        return false;
    }
    const numStr = el.textContent.trim();
    return !isNaN(numStr);
}

//获取聊天列表
const getChatMsgList = async () => {
    const chatFrameEl = await elUtil.findElement('#chatframe', {
        validationElFun: (config, selector) => {
            const el = document.querySelector(selector);
            if (el === null) return null;
            const iframeDocument = el.contentDocument;
            elUtil.findElement('head', {doc: iframeDocument}).then(headEl => {
                elUtil.installStyle(controlStyle, {el: headEl})
            })
            return iframeDocument;
        }
    })
    const elList = await elUtil.findElements('#item-offset>#items yt-live-chat-text-message-renderer.yt-live-chat-item-list-renderer',
        {doc: chatFrameEl});
    const list = []
    const engagementEl = chatFrameEl.querySelector('yt-live-chat-viewer-engagement-message-renderer');
    if (engagementEl) engagementEl.remove();
    for (const el of elList) {
        const contentEl = el.querySelector('#content');
        const nameEl = contentEl.querySelector('#author-name')
        const userName = nameEl.textContent.trim();
        const msgEl = contentEl.querySelector('#message');
        const insertionPositionEl = el;
        const explicitSubjectEl = el;
        list.push({
            el, userName, msg: msgEl.textContent.trim(), msgChildren: msgEl.childNodes,
            insertionPositionEl, explicitSubjectEl
        })
    }
    return list;
}

//检查聊天弹幕内容屏蔽
const checkChatMsgListBlock = async () => {
    const list = await getChatMsgList();
    for (const itemData of list) {
        eventEmitter.send('event:插入屏蔽按钮', itemData);
    }
}

//间隔检查聊天弹幕内容屏蔽
const intervalChatMsgListBlockExecutor = new IntervalExecutor(async () => {
    if (await isLivePage()) {
        await checkChatMsgListBlock()
    } else {
        intervalChatMsgListBlockExecutor.stop('播放页非直播状态，取消检测聊天弹幕操作')
    }
}, {processTips: true, intervalName: '播放聊天弹幕列表'});

export default {
    isLivePage, getChatMsgList, intervalChatMsgListBlockExecutor
}