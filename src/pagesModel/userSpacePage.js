import elUtil from "../utils/elUtil.js";
import urlUtil from "../utils/urlUtil.js";
import {eventEmitter} from "../model/EventEmitter.js";
import channelPage from "./channelPage.js";

//是否为用户页
const isUserSpacePage = (url = location.href) => {
    return url.includes('://www.youtube.com/@')
}

/**
 * 获取用户信息
 * @returns {Promise<{userId:string,userName:string,userUrl:string,channelId:string}>}
 */
const getUserInfo = async () => {
    const winHref = location.href;
    const info = {};
    if (channelPage.isUrlPage(winHref)) {
        info.channelId = urlUtil.getUrlChannelId(winHref)
    }
    if (winHref.includes('://www.youtube.com/@')) {
        info.userId = urlUtil.getUrlUserId(winHref)
    } else {
        const el = await elUtil.findElement('yt-decorated-avatar-view-model+div>yt-content-metadata-view-model>div:first-child')
        const text = el.textContent;
        if (text.startsWith('@')) {
            info.userId = text;
        } else {
            info.userId = null;
        }
    }
    info.userUrl = winHref;
    const nameEl = await elUtil.findElement('.dynamicTextViewModelH1>span');
    info.userName = nameEl.textContent;
    return info;
}

/**
 * 添加用户空间屏蔽按钮
 * 只有是用户页面才执行，页面只添加一次
 */
const addShieldButton = () => {
    if (!isUserSpacePage() && !channelPage.isUrlPage()) return;
    if (document.querySelector('ytd-browse[page-subtype="channels"] yt-flexible-actions-view-model button[gz_type]#user-shield-button')) return;
    elUtil.findElement('ytd-browse[page-subtype="channels"] yt-flexible-actions-view-model').then(el => {
        if (el.querySelector('button[gz_type]#user-shield-button')) return;
        const but = document.createElement('button');
        but.textContent = '屏蔽';
        but.setAttribute('gz_type', '');
        but.id = 'user-shield-button'
        but.addEventListener('click', async () => {
            const data = await getUserInfo();
            eventEmitter.emit('event:mask_options_dialog_box', data)
        })
        el.appendChild(but);
    })
}

const run = () => {
    addShieldButton()
}

export default {
    isUserSpacePage, run, addShieldButton
}