import strUtil from "../utils/strUtil.js";
import urlUtil from "../utils/urlUtil.js";

//获取视频列表-部分情况支持
const getMetaVideoList = (elList) => {
    const list = [];
    for (const el of elList) {
        //该属性目前可知可用于确认是否是博客竖向的卡片内容，其他情待确认
        //后面可以考虑直接在博客页面中定位时排除先
        const isResponsiveGrid = el.getAttribute('is-responsive-grid');
        if (isResponsiveGrid === 'EXTRA_COMPACT') {
            continue;
        }
        const explicitSubjectEl = el.querySelector('#meta');
        const insertionPositionEl = el.querySelector('#metadata');
        const titleAEl = explicitSubjectEl.querySelector('#video-title-link')
        const titleEl = titleAEl.querySelector('#video-title')
        const userAEl = insertionPositionEl.querySelector('#text-container a')
        const viewEl = insertionPositionEl.querySelector('#metadata-line>span')
        const durationEl = el.querySelector('.yt-badge-shape__text');
        const durationTxt = durationEl ? durationEl.textContent.trim() : null;
        let duration = -1, view = -1;
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
        const title = titleEl.textContent.trim();
        const videoAddress = titleAEl.href;
        const userUrl = userAEl.href;
        const videoId = urlUtil.getUrlVideoId(videoAddress);
        const userId = urlUtil.getUrlUserId(userUrl);
        list.push({
            el, title, view, userId, videoAddress, userUrl, duration, videoId,
            insertionPositionEl, explicitSubjectEl, durationTxt
        });
    }
    return list;
}

export default {
    getMetaVideoList
}
