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

//获取左侧激活菜单项文本
const getLeftActiveItemText = () => {
    return document.body.querySelector("#sections ytd-guide-entry-renderer[active]").textContent.trim() ?? null;
}

/**
 * 获取首页中视频列表数据
 * 排除合辑和直播类
 * @returns {Promise<*[]>}
 */
const getVideoDataList = async () => {
    const elList = await elUtil.findElements('ytd-browse[page-subtype="home"] ytd-rich-grid-renderer>#contents>ytd-rich-item-renderer');
    const list = []
    for (const el of elList) {
        //时长元素，该值也有可能为合辑
        const durationEl = el.querySelector('.yt-badge-shape__text');
        //时长或合辑文本
        const durationTxt = durationEl ? durationEl.textContent.trim() : null;
        //赞助商广告
        const sponsoredAds = el.querySelector('.yt-badge-shape--ad .yt-badge-shape__text');
        if (sponsoredAds && sponsoredAds.textContent.trim() === '赞助商广告') {
            const delSponsoredAdsV = isDelSponsoredAdsGm();
            if (delSponsoredAdsV) {
                el.remove();
                console.log('已删除赞助商广告', el)
            }
        }
        switch (durationTxt) {
            case '合辑':
                //跳过合辑类视频卡片
                continue;
        }
        //会员专享
        const vipEl = el.querySelector('.badge-style-type-members-only')
        const titleContainerEl = el.querySelector('yt-lockup-metadata-view-model,#meta');
        if (titleContainerEl === null) {
            // console.warn('标题容器元素未找到', el, titleContainerEl);
            continue;
        }
        const titleAEl = titleContainerEl.querySelector('.yt-lockup-metadata-view-model__title,#video-title-link');
        //如果是合辑时userAEl值为null
        const userAEl = titleContainerEl.querySelector('a.yt-core-attributed-string__link.yt-core-attributed-string__link--call-to-action-color.yt-core-attributed-string--link-inherit-color,ytd-channel-name a[href^="/@"]');
        if (userAEl === null) {
            // console.warn('疑似合辑内容', el, userAEl);
            continue;
        }
        let insertionPositionEl;
        if (vipEl) {
            insertionPositionEl = titleContainerEl
        } else {
            insertionPositionEl = el.querySelector('.yt-lockup-view-model__metadata');
        }
        let view = -1, duration = -1;
        if (durationTxt !== '即将开始' && durationTxt !== '直播') {
            const viewEl = insertionPositionEl.querySelector('.yt-content-metadata-view-model__metadata-row:last-child>span:first-child')
            if (viewEl) {
                const viewTxt = viewEl.textContent.trim();
                view = strUtil.parseView(viewTxt);
            }
            duration = strUtil.timeStringToSeconds(durationTxt);
        }
        const userName = userAEl.textContent.trim();
        const userUrl = decodeURI(userAEl.href);
        //频道id
        const channelId = urlUtil.getUrlChannelId(userUrl);
        let userId = null;
        if (channelId === null) {
            userId = urlUtil.getUrlUserId(userUrl);
        }
        const videoAddress = titleAEl.href;
        const videoId = urlUtil.getUrlVideoId(videoAddress);
        const title = titleAEl.textContent.trim();
        list.push({
            el, title, userId, channelId, durationTxt, duration, videoAddress, userName, userUrl, videoId,
            insertionPositionEl, explicitSubjectEl: insertionPositionEl, view
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

window['getVideoDataList'] = getVideoDataList;
window['getShortsVideoDataList'] = getShortsVideoDataList;

//检查首页视频屏蔽
const checkHomeVideoBlock = async () => {
    const list = await getVideoDataList();
    for (const v of list) {
        video_shielding.shieldingVideoDecorated(v).catch(() => {
            eventEmitter.send('event:插入屏蔽按钮', v);
        })
    }
}

//间隔检查首页视频列表屏蔽
const intervalCheckHomeVideoList = new IntervalExecutor(checkHomeVideoBlock,
    {processTips: true, IntervalName: '首页视频列表检测'})

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

const run = () => {
    intervalCheckHomeVideoList.start();
}

export default {
    isHomeUrlPage, run, startHomeShortsItemDisplay,
    getLeftActiveItemText,
    intervalCheckHomeVideoList,
}
