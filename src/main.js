import layout_init from "./layout_init.js";
import './menu.js';
import {eventEmitter} from "./model/EventEmitter.js";
import router from "./router.js";
import watch from './watch.js';
import defCss from './css/def.css';
import gzStyleCss from './css/gz-style.css'
import './shieldingModel/video_shielding.js';
import {getDrawerShortcutKeyGm} from "./data/localMKData.js";
import './model/maskOptionsDialogBox.js'

console.log('油管内容屏蔽器脚本加载成功！');
router.staticRoute(document.title, document.location.href);
window.addEventListener('DOMContentLoaded', () => {
    GM_addStyle(defCss)
    GM_addStyle(gzStyleCss)
    console.log('网页元素加载完成')
    layout_init.init();
})

watch.addEventListenerUrlChange((newUrl, _oldUrl, title) => {
    router.dynamicRoute(title, newUrl);
})

window.addEventListener('load', () => {
    console.log('页面加载完成');
    router.staticRoutePageAfterLoad(document.title, location.href);
    /**
     * 注意地方，油管上左侧选项切换显示的内容页不同，但都是位于#page-manager标签下的直接子元素
     * 大部分都是根据ytd-browse[page-subtype="这里是类型"]来判断
     * 比如 首页为ytd-browse[page-subtype="home"]
     * 订阅为ytd-browse[page-subtype="subscriptions"]
     * 历史记录为ytd-browse[page-subtype="history"]
     * 稍后观看和赞过的视频为ytd-browse[page-subtype="playlist"]
     * 频道页和游戏为ytd-browse[page-subtype="channels"]
     * 直播为ytd-browse[page-subtype="live"]
     * 新闻为ytd-browse[page-subtype="news"]
     * 体育为ytd-browse[page-subtype="sports"]
     *
     * 课程比较特殊，稳妥点加上父标签定位，为#page-manager>ytd-browse:not([page-subtype])
     *
     * 搜索页为#page-manager>ytd-search
     * 其中列表项目为#page-manager>ytd-search #contents>ytd-item-section-renderer ytd-video-renderer
     *
     * 播放页中，后续需要测试在其他位置加载视频之后再次确认位置，避免定位错，一般情况下右侧视频列表为#contents>yt-lockup-view-model
     * 其中底部评论区列表每一项为#comments>#sections>#contents>ytd-comment-thread-renderer
     */

    // elUtil.findElements('ytd-browse[page-subtype="home"] ytd-rich-grid-renderer>#contents>ytd-rich-item-renderer').then(els => {
    //     console.log(els);
    //     window.els = els;
    // })
})

document.addEventListener('keydown', function (event) {
    eventEmitter.emit('event-keydownEvent', event);
    if (event.key === getDrawerShortcutKeyGm()) {
        eventEmitter.send('event-drawer-show', null);
    }
});
