import elUtil from "../utils/elUtil.js";
import {eventEmitter} from "../model/EventEmitter.js";
import {IntervalExecutor} from "../model/IntervalExecutor.js";
import strUtil from "../utils/strUtil.js";
import video_shielding from "../shieldingModel/video_shielding.js";
import urlUtil from "../utils/urlUtil.js";
import comments_shielding from "../shieldingModel/comments_shielding.js";
import playLivePage from "./playLivePage.js";
import {isDelVideoPageSponsoredAdsGm} from "../data/localMKData.js";

const isUrlPage = (url = location.href) => {
    return url.includes('://www.youtube.com/watch?v=')
}

//获取评论数量
export const getCommentCount = () => {
    const el = document.querySelector('.count-text.style-scope.ytd-comments-header-renderer>.style-scope.yt-formatted-string');
    if (el === null) return -1;
    const numStr = el.textContent.trim();
    return strUtil.parseView(numStr)
}

/**
 * 获取右侧视频列表
 * 目前获取不到用户的id和用户地址相关、频道id
 * @returns {Promise<*[]>}
 */
const getRightVideoList = async () => {
    //原css表达式
    const elList = await elUtil.findElements('#items>yt-lockup-view-model,.ytd-item-section-renderer.lockup.yt-lockup-view-model--wrapper')
    const list = [];
    for (const el of elList) {
        if (el.classList.contains('ytd-horizontal-card-list-renderer')) {
            //跳过未知非视频项
            continue;
        }
        const titleContainerEl = el.querySelector('.yt-lockup-metadata-view-model');
        if (titleContainerEl === null) {
            // console.warn('标题容器元素未找到', el, titleContainerEl);
            continue;
        }
        //时长元素，该值也有可能为合辑
        const durationEl = el.querySelector('yt-thumbnail-badge-view-model badge-shape>.yt-badge-shape__text');
        //时长或合辑文本
        const durationTxt = durationEl ? durationEl.textContent.trim() : null;
        if (durationTxt === null) {
            // console.warn('时长元素未找到', el, durationEl);
            continue
        }
        let duration = -1, view = -1, compilationId, userNameList, userName;
        const titleAEl = titleContainerEl.querySelector('.yt-lockup-metadata-view-model__title');
        const bottomInfoEls = titleContainerEl.querySelectorAll('.yt-content-metadata-view-model__metadata-row span[role="text"]')
        if (durationTxt.includes(':')) {
            duration = strUtil.timeStringToSeconds(durationTxt);
            const viewTxt = bottomInfoEls[1].textContent.trim();
            view = strUtil.parseView(viewTxt);
        }
        const videoAddress = titleAEl.href;

        if (durationTxt === '合辑') {
            compilationId = urlUtil.getUrlCompilationId(videoAddress);
            const namesEl = titleContainerEl.querySelector('.yt-content-metadata-view-model__metadata-row:first-child>span');
            userNameList = strUtil.getCompilationUserNames(namesEl?.textContent.trim())
        } else {
            userName = bottomInfoEls[0].textContent.trim();
        }
        const videoId = urlUtil.getUrlVideoId(videoAddress);
        const title = titleAEl.textContent.trim();
        //插入位置元素
        const insertionPositionEl = el.querySelector('.yt-lockup-view-model__metadata');
        list.push({
            el, title, view, durationTxt, duration, videoAddress, userName, videoId, compilationId,
            insertionPositionEl, explicitSubjectEl: insertionPositionEl, userNameList
        })
    }
    return list;
}

//检查播放页视频屏蔽
const checkRightVideoListBlock = async () => {
    const list = await getRightVideoList();
    for (const v of list) {
        video_shielding.shieldingVideoDecorated(v).catch(() => {
            eventEmitter.send('event:插入屏蔽按钮', v);
        })
    }
}

/**
 * 获取评论区评论
 * 评论区中显示用户名的目前只发现是用户id，待后续观察
 * @returns {Promise<*[]>}
 */
const getCommentList = async () => {
    const elList = await elUtil.findElements('#comments>#sections>#contents>.style-scope.ytd-item-section-renderer');
    const list = [];
    for (const el of elList) {
        //跳过加载更多
        if (el.tagName === 'YTD-CONTINUATION-ITEM-RENDERER') continue;
        const mainEl = el.querySelector('#comment #main');
        const userIdEl = mainEl.querySelector('a#author-text');
        const contentEl = mainEl.querySelector('#content-text');
        const replies = el.querySelectorAll('#replies #contents>ytd-comment-view-model')
        const insertionPositionEl = mainEl.querySelector('#header-author')
        const userUrl = decodeURI(userIdEl.href);
        const userId = urlUtil.getUrlUserId(userUrl);
        const content = contentEl.textContent.trim();
        const reply = [];
        list.push({
            userId, userUrl, content, reply, insertionPositionEl, explicitSubjectEl: mainEl, el
        })
        for (const replyEl of replies) {
            const replyUserIdEl = replyEl.querySelector('a#author-text');
            const replyContentEl = replyEl.querySelector('#content-text');
            const userUrl = decodeURI(replyUserIdEl.href);
            const userId = urlUtil.getUrlUserId(userUrl);
            const content = replyContentEl.textContent.trim();
            const insertionPositionEl = replyEl.querySelector('#header-author')
            reply.push({
                userUrl, userId, content, el: replyEl, insertionPositionEl, explicitSubjectEl: replyEl
            })
        }
    }
    return list
}

//间隔检测右侧视频屏蔽
const intervalCheckPlayerVideoList = new IntervalExecutor(checkRightVideoListBlock,
    {processTips: true, intervalName: '播放页右侧视频列表'});

//间隔检测评论区屏蔽
const intervalCheckCommentList = new IntervalExecutor(async () => {
    if (await playLivePage.isLivePage()) {
        intervalCheckCommentList.stop('播放页为直播状态，取消检测评论区操作');
        return;
    }
    const commentCount = getCommentCount();
    if (commentCount !== -1 && commentCount === 0) {
        intervalCheckCommentList.stop('评论区为空，取消检测评论区操作');
        return
    }
    const list = await getCommentList();
    for (const contentData of list) {
        comments_shielding.shieldingCommentDecorated(contentData).catch((list) => {
            list.forEach(v => eventEmitter.send('event:插入屏蔽按钮', v));
        })
    }
}, {processTips: true, intervalName: '评论区'});

//获取播放页用户信息
const getPlayUserInfo = async () => {
    const userAel = await elUtil.findElement('ytd-watch-metadata #text>a');
    const userUrl = decodeURI(userAel.href);
    const userName = userAel.textContent.trim();
    const userId = urlUtil.getUrlUserId(userUrl);
    const parseUrl = urlUtil.parseUrl(location.href);
    const videoId = parseUrl.queryParams['v'];
    return {userId, userName, userUrl, videoId}
}

const addShieldButton = () => {
    if (document.querySelector('#top-row.style-scope.ytd-watch-metadata button[gz_type]')) return;
    elUtil.findElement('#top-row.style-scope.ytd-watch-metadata').then(el => {
        if (el.querySelector('button[gz_type]#user-shield-button')) return;
        const but = document.createElement('button');
        but.textContent = '屏蔽';
        but.setAttribute('gz_type', '');
        but.id = 'user-shield-button';
        el.appendChild(but);
        but.addEventListener('click', () => {
            getPlayUserInfo().then(data => {
                eventEmitter.emit('event:mask_options_dialog_box', data);
            })
        })
    })
}

//检查右侧播放列表赞助商广告
const checkRightVideoListAd = () => {
    if (!isDelVideoPageSponsoredAdsGm()) return;
    elUtil.findElement('#player-ads').then(el => {
        el.remove();
        eventEmitter.send('event:print-msg', '已删除视频页右侧视频列表上方赞助商广告');
    })
}


//视频页和直播页
export default {
    isUrlPage, getRightVideoList, intervalCheckPlayerVideoList, addShieldButton,
    intervalCheckCommentList, checkRightVideoListAd
}