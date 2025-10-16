//是否为用户页
import elUtil from "../utils/elUtil.js";
import defUtil from "../utils/defUtil.js";
import urlUtil from "../utils/urlUtil.js";
import {eventEmitter} from "../model/EventEmitter.js";
import ruleUtil from "../utils/ruleUtil.js";

const isUserSpacePage = (url = location.href) => {
    return url.includes('://www.youtube.com/@')
}

//是否为频道页
const isChannelPage = (url = location.href) => {
    return url.includes('://www.youtube.com/channel')
}

/**
 * 获取用户信息
 * @returns {Promise<{userId:string,userName:string}>}
 */
const getUserInfo = async () => {
    const winHref = location.href;
    const info = {};
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
    const nameEl = await elUtil.findElement('.dynamicTextViewModelH1>span');
    info.userName = nameEl.textContent;
    return info;
}


/**
 * 添加用户空间屏蔽按钮
 * 只有是用户页面才执行，页面只添加一次
 */
const addShieldButton = () => {
    if (!isUserSpacePage() && !isChannelPage()) return;
    if (document.querySelector('yt-flexible-actions-view-model button[gz_type]#user-shield-button')) return;
    elUtil.findElement('yt-flexible-actions-view-model').then(el => {
        if (el.querySelector('button[gz_type]#user-shield-button')) return;
        const but = document.createElement('button');
        but.textContent = '屏蔽';
        but.setAttribute('gz_type', '');
        but.id = 'user-shield-button'
        but.addEventListener('click', async () => {
            console.log('点击了屏蔽按钮');
            const {userId, userName} = await getUserInfo();
                eventEmitter.send('sheet-dialog', {
                    title: "屏蔽选项",
                    list: [
                        {label: `用户id精确屏蔽=${userId}`, value: 'userId_precise'},
                        {label: `用户名精确屏蔽=${userName}`, value: 'username_precise'}
                    ],
                    optionsClick: (item) => {
                        const {value} = item
                        let results;
                        switch (value) {
                            case "userId_precise":
                                results = ruleUtil.addRule(userId, value);
                                break;
                            case "username_precise":
                                results = ruleUtil.addRule(userName, value);
                                break;
                            default:
                                eventEmitter.send('el-msg', "出现意外的选项值");
                                return;
                        }
                        eventEmitter.send('el-msg', results.res)
                    }
                })
        })
        el.appendChild(but);
    })
}

const run = () => {
    addShieldButton()
}


export default {
    isUserSpacePage, isChannelPage, run, addShieldButton
}