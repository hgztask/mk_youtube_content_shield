import strUtil from "../utils/strUtil.js";
import urlUtil from "../utils/urlUtil.js";

//获取视频列表-部分情况支持
const getMetaVideoList = (elList) => {
    const list = [];
    for (const el of elList) {
        const explicitSubjectEl = el.querySelector('#meta');
        const insertionPositionEl = el.querySelector('#metadata');
        const titleAEl = explicitSubjectEl.querySelector('a#video-title-link,a#video-title')
        const userAEl = insertionPositionEl.querySelector('#text-container a')
        const viewEl = insertionPositionEl.querySelector('#metadata-line>span')
        const durationEl = el.querySelector('.yt-badge-shape__text');
        const durationTxt = durationEl ? durationEl.textContent.trim() : null;
        let duration = -1, view = -1, channelId = null;
        if (durationEl) {
            if (durationTxt.includes(':')) {
                duration = strUtil.timeStringToSeconds(durationTxt);
            }
        }
        if (viewEl) {
            const viewText = viewEl.textContent.trim();
            // 过滤掉预定发布时间和即将开始
            if (!viewText.includes('预定发布时间') || durationTxt !== '即将开始') {
                view = strUtil.parseView(viewText);
            }
        }
        const title = titleAEl.textContent.trim();
        const videoAddress = titleAEl.href;
        const userUrl = userAEl.href;
        const videoId = urlUtil.getUrlVideoId(videoAddress);
        const userId = urlUtil.getUrlUserId(userUrl);
        if (userId === null) {
            channelId = urlUtil.getUrlChannelId(userUrl)
        }
        const userName = userAEl.textContent.trim();
        list.push({
            el, title, view, userId, videoAddress, userUrl, duration, videoId,
            insertionPositionEl, explicitSubjectEl, durationTxt, userName, channelId
        });
    }
    return list;
}

//提取评论区评论列表
const extractCommentList = async (els) => {
    const list = [];
    for (const el of els) {
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


export default {
    getMetaVideoList, extractCommentList
}
