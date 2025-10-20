import elUtil from "../utils/elUtil.js";
import {eventEmitter} from "../model/EventEmitter.js";
import {IntervalExecutor} from "../model/IntervalExecutor.js";
import strUtil from "../utils/strUtil.js";
import video_shielding from "../shieldingModel/video_shielding.js";
import urlUtil from "../utils/urlUtil.js";
import {isDelHomeShortsItemGm, isDelSponsoredAdsGm} from "../data/localMKData.js";

const isHomeUrlPage = () => {
    return window.location.href === 'https://www.youtube.com/';
}

/**
 * 获取首页中视频列表数据
 * @returns {Promise<*[]>}
 */
const getVideoDataList = async () => {
    const elList = await elUtil.findElements('ytd-browse[page-subtype="home"] ytd-rich-grid-renderer>#contents>ytd-rich-item-renderer');
    const list = []
    for (const el of elList) {
        //时长元素，该值也有可能为合辑
        const durationEl = el.querySelector('.yt-badge-shape__text');
        //时长或合辑，即将开始、直播
        const durationTxt = durationEl ? durationEl.textContent.trim() : null;
        //赞助商广告
        const sponsoredAds = el.querySelector('.yt-badge-shape--ad .yt-badge-shape__text');
        if (sponsoredAds && sponsoredAds.textContent.trim() === '赞助商广告') {
            const delSponsoredAdsV = isDelSponsoredAdsGm();
            if (delSponsoredAdsV) {
                el.remove();
                console.log('已删除赞助商广告', el)
                continue;
            }
        }
        const titleContainerEl = el.querySelector('yt-lockup-metadata-view-model,#meta');
        if (titleContainerEl === null) {
            // console.warn('标题容器元素未找到', el, titleContainerEl);
            continue;
        }
        const titleAEl = titleContainerEl.querySelector('.yt-lockup-metadata-view-model__title,#video-title-link');
        //如果是合辑时userAEl值为null
        const userAEl = titleContainerEl.querySelector('a.yt-core-attributed-string__link.yt-core-attributed-string__link--call-to-action-color.yt-core-attributed-string--link-inherit-color,ytd-channel-name a[href^="/@"]');
        let view = -1, duration = -1, insertionPositionEl, userId = null, userName = null,
            userUrl = null, channelId = null, compilationId = null, userNameList = null;
        //会员专享
        const vipEl = el.querySelector('.badge-style-type-members-only')
        if (vipEl) {
            insertionPositionEl = titleContainerEl
        } else {
            insertionPositionEl = el.querySelector('.yt-lockup-view-model__metadata');
            if (insertionPositionEl === null) {
                insertionPositionEl = titleContainerEl;
            }
        }
        const viewEl = insertionPositionEl.querySelector('.yt-content-metadata-view-model__metadata-row:last-child>span:first-child')
        if (durationTxt.includes(':')) {
            duration = strUtil.timeStringToSeconds(durationTxt);
        }
        if (viewEl) {
            const viewTxt = viewEl.textContent.trim();
            view = strUtil.parseView(viewTxt);
        }
        const videoAddress = titleAEl.href;
        const videoId = urlUtil.getUrlVideoId(videoAddress);
        const title = titleAEl.textContent.trim();
        if (durationTxt === '合辑') {
            compilationId = urlUtil.getUrlCompilationId(videoAddress);
            const namesEl = titleContainerEl.querySelector('.yt-content-metadata-view-model__metadata-row:first-child>span');
            userNameList = strUtil.getCompilationUserNames(namesEl?.textContent.trim());
        } else if (userAEl) {
            userName = userAEl.textContent.trim();
            userUrl = decodeURI(userAEl.href);
            channelId = urlUtil.getUrlChannelId(userUrl);
            userId = urlUtil.getUrlUserId(userUrl);
        }
        //卡片内容为播放列表
        if (durationTxt.endsWith('个视频')) {
            debugger//待后续完善
        }
        list.push({
            el, title, userId, channelId, durationTxt, duration, videoAddress, userName, userUrl, videoId,
            insertionPositionEl, explicitSubjectEl: insertionPositionEl, view, compilationId, userNameList
        })
    }
    startHomeShortsItemDisplay();
    return list;
}

//获取首页中shorts视频列表数据
const getShortsVideoDataList = async () => {
    const elList = await elUtil.findElements('ytd-browse[page-subtype="home"] ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer #contents>ytd-rich-item-renderer', {timeout: 10 * 1000});
    const list = [];
    for (const el of elList) {
        if (el.classList.contains('hidden')) {
            el.classList.remove('hidden');
        }
        const titleAEl = el.querySelector('h3>a');
        const title = titleAEl.textContent.trim();
        const videoAddress = titleAEl.href;
        const playCountEl = el.querySelector('h3+div>span');
        const playCountTxt = playCountEl ? playCountEl.textContent.trim() : null;
        const insertionPositionEl = el.querySelector('h3+div')
        list.push({
            el,
            title,
            videoAddress,
            playCountTxt,
            insertionPositionEl,
            explicitSubjectEl: el,
        })
    }
    return list;
}

//检查首页视频屏蔽
const checkHomeVideoBlock = async () => {
    const list = await getVideoDataList();
    for (const v of list) {
        video_shielding.shieldingVideoDecorated(v).catch(() => {
            eventEmitter.send('event:插入屏蔽按钮', v);
        })
    }
    //获取大幅赞助商广告
    const adList = document.querySelectorAll('#masthead-ad');
    if (adList.length === 0) return;
    const delSponsoredAdsV = isDelSponsoredAdsGm();
    if (!delSponsoredAdsV) return
    for (const adEl of adList) {
        adEl.remove();
        console.log('已删除大幅赞助商广告', adEl);
    }
}

//间隔检查首页视频列表屏蔽
const intervalCheckHomeVideoList = new IntervalExecutor(checkHomeVideoBlock,
    {processTips: true, intervalName: '首页视频列表'})

//设置首页 shorts 列表显隐
const setHomeShortsItemDisplay = (hide = true) => {
    elUtil.findElements('ytd-browse[page-subtype="home"] ytd-rich-section-renderer').then(els => {
        for (const el of els) {
            if ((el.style.display === 'none' && hide) || (el.style.display === '' && !hide)) {
                continue
            }
            el.style.display = hide ? 'none' : '';
            console.log(`已${hide ? '隐藏' : '显示'}首页 shorts 视频列表`, el);
        }
    })
}

const startHomeShortsItemDisplay = () => {
    if (isDelHomeShortsItemGm()) {
        setHomeShortsItemDisplay();
    }
}

export default {
    isHomeUrlPage, startHomeShortsItemDisplay,
    intervalCheckHomeVideoList,
}
