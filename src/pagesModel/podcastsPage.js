import {valueCache} from "../data/valueCache.js";
import elUtil from "../utils/elUtil.js";
import pageCommon from "./pageCommon.js";
import {IntervalExecutor} from "../model/IntervalExecutor.js";
import video_shielding from "../shieldingModel/video_shielding.js";
import {eventEmitter} from "../model/EventEmitter.js";
import urlUtil from "../utils/urlUtil.js";

//是否是博客页面
const isUrlPage = (url = location.href) => {
    return url.includes('//www.youtube.com/podcasts')
}
//是否是热门博客页面
const isHotBlogPage = (url = location.href) => {
    return url.includes('//www.youtube.com/podcasts/popularshows')
}

//是否是热门博客分集页面
const isHotBlogItemPage = (url = location.href) => {
    return url.includes('//www.youtube.com/podcasts/popularepisodes')
}

//空列表
const emptyList = []
//获取博客首页的根元素
const getBlogHomepageRootEl = async () => {
    let rootEl = valueCache.get('rootEl:podcastsHome');
    if (rootEl === null) {
        const els = await elUtil.findElements('ytd-two-column-browse-results-renderer.style-scope.ytd-browse.grid.grid-disabled[disable-grid-state-aware]')
        for (const el of els) {
            if (el.querySelector('a[href^="/podcasts"]')) {
                rootEl = el;
                valueCache.set('rootEl:podcastsHome', rootEl);
            }
        }
    }
    return rootEl;
}

//获取部分博客页面的根元素-热门分集
const getPartialBlogRootEl = async () => {
    let rootEl = valueCache.get('rootEl:podcasts');
    if (rootEl === null) {
        rootEl = await elUtil.findElement('ytd-two-column-browse-results-renderer.style-scope.ytd-browse.grid.grid-disabled[disable-grid-state-aware]');
        valueCache.set('rootEl:podcasts', rootEl);
    }
    return rootEl;
}

//获取热门博客内容-针对于博客首页中热门博客项和热门博客页
const getHotBlogItem = (el) => {
    const metadataEl = el.querySelector('.yt-lockup-view-model__metadata');
    const titleAEl = metadataEl.querySelector('a.yt-lockup-metadata-view-model__title')
    const userAEl = metadataEl.querySelector('a[href^="/@"]')
    const title = titleAEl.textContent.trim();
    const videoUrl = titleAEl.href;
    const videoId = urlUtil.getUrlVideoId(videoUrl);
    const userUrl = userAEl.href;
    const userId = urlUtil.getUrlUserId(userUrl);
    const userName = userAEl.textContent.trim();
    const playListAEl = metadataEl.querySelector('a[href^="/playlist?list="]');
    const playListUrl = playListAEl.href;
    return {
        insertionPositionEl: metadataEl, explicitSubjectEl: metadataEl,
        el, title, videoUrl, videoId, userId, userName, userUrl, playListUrl
    }
}

//间隔检查博客内容列表
const intervalPodcastsListExecutor = new IntervalExecutor(async () => {
    const isHotBlogPageV = isHotBlogPage();
    const isHotBlogItemPageV = isHotBlogItemPage();
    const list = [];
    if (isHotBlogPageV) {
        const els = document.querySelectorAll('#spinner-container+#contents>.style-scope.ytd-rich-grid-renderer')
        for (const el of els) {
            list.push(getHotBlogItem(el));
        }
    } else {
        let rootEl;
        if (isHotBlogItemPageV) {
            rootEl = await getPartialBlogRootEl();
        } else {
            //普通博客页面
            rootEl = await getBlogHomepageRootEl();
        }
        if (rootEl === null) return emptyList;
        const els = await elUtil.findElements('#contents>ytd-rich-item-renderer', {doc: rootEl});
        const otherElList = []
        for (const el of els) {
            if (el.hidden) {
                continue;
            }
            const isResponsiveGrid = el.getAttribute('is-responsive-grid');
            if (isResponsiveGrid !== 'EXTRA_COMPACT') {
                otherElList.push(el)
                continue;
            }
            //如果是底部热门博客创作者栏的项，跳过
            if (el.querySelector('#channel')) {
                continue;
            }
            list.push(getHotBlogItem(el))
        }
        list.push(...pageCommon.getMetaVideoList(otherElList));
    }
    for (const v of list) {
        video_shielding.shieldingVideoDecorated(v).catch(() => {
            eventEmitter.send('event:插入屏蔽按钮', v);
        })
    }
}, {processTips: true, intervalName: '博客内容列表'})

//博客页面模块
export default {
    isUrlPage, intervalPodcastsListExecutor
}