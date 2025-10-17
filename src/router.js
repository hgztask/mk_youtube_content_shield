import homePage from "./pagesModel/homePage.js";
import playerPage from "./pagesModel/playerPage.js";
import searchPage from "./pagesModel/searchPage.js";
import userSpacePage from "./pagesModel/userSpacePage.js";
import playLivePage from "./pagesModel/playLivePage.js";
import gamingPage from "./pagesModel/gamingPage.js";
import liveHomePage from "./pagesModel/liveHomePage.js";
import channelPage from "./pagesModel/channelPage.js";
import urlUtil from "./utils/urlUtil.js";

/**
 * 静态路由
 * @param title {string} 标题
 * @param url {string} url地址
 */
const staticRoute = (title, url) => {
    const parseUrl = urlUtil.parseUrl(url);
    console.log('静态路由', title, url, parseUrl);
    if (homePage.isHomeUrlPage()) {
        console.log('youtube首页')
        homePage.run();
    }
    if (playerPage.isUrlPage(url)) {
        console.log('播放页or直播页')
        playerPage.intervalCheckPlayerVideoList.start();
        playerPage.intervalCheckCommentList.start()
        playLivePage.intervalChatMsgListBlockExecutor.start();
        playerPage.addShieldButton();
    }
    if (userSpacePage.isUserSpacePage(url)) {
        console.log('用户空间主页')
        userSpacePage.run();
    }
    if (searchPage.isUrlPage(url)) {
        console.log('搜索页')
        searchPage.intervalCheckSearchVideoList.start();
        searchPage.addShieldButton();
    }
    if (gamingPage.isUrlPage(url)) {
        console.log('游戏页')
        gamingPage.intervalCheckGamingVideoList.start();
    }
    if (liveHomePage.isUrlPage(url)) {
        console.log('直播首页')
        liveHomePage.removeLiveHomeTopBanner()
        liveHomePage.intervalLiveListExecutor.start();
    }
    if (channelPage.isUrlPage(url)) {
        console.log('频道页')
        channelPage.dynamicRun(parseUrl);
    }
    userSpacePage.addShieldButton();
    /*
    elUtil.findElement('#sections ytd-guide-section-renderer:first-child #items>ytd-guide-entry-renderer:first-child').then(el => {
            console.log('找到左侧首页菜单项', el);
            el.addEventListener('click', (e) => {
                console.log('点击了左侧首页菜单项', e.target);
            })
        })
        */
}

/**
 * 动态路由
 * @param title {string} 标题
 * @param url {string} url地址
 */
const dynamicRoute = (title, url) => {
    const parseUrl = urlUtil.parseUrl(url);
    console.log('动态路由', title, url, parseUrl);
    if (playerPage.isUrlPage(url)) {
        playerPage.intervalCheckPlayerVideoList.start();
        playerPage.intervalCheckCommentList.start();
        playLivePage.intervalChatMsgListBlockExecutor.start();
        playerPage.addShieldButton();
    } else {
        playerPage.intervalCheckPlayerVideoList.stop();
        playerPage.intervalCheckCommentList.stop();
        playLivePage.intervalChatMsgListBlockExecutor.stop();
    }
    if (homePage.isHomeUrlPage()) {
        homePage.intervalCheckHomeVideoList.start();
        homePage.startHomeShortsItemDisplay();
    } else {
        homePage.intervalCheckHomeVideoList.stop();
    }
    if (searchPage.isUrlPage(url)) {
        searchPage.intervalCheckSearchVideoList.start();
        searchPage.addShieldButton();
    } else {
        searchPage.intervalCheckSearchVideoList.stop();
    }
    if (userSpacePage.isUserSpacePage(url)) {
        console.log('用户空间主页')
    }
    if (gamingPage.isUrlPage(url)) {
        gamingPage.intervalCheckGamingVideoList.start();
    } else {
        gamingPage.intervalCheckGamingVideoList.stop();
    }
    if (liveHomePage.isUrlPage(url)) {
        liveHomePage.removeLiveHomeTopBanner()
        liveHomePage.intervalLiveListExecutor.start();
    } else {
        liveHomePage.intervalLiveListExecutor.stop();
    }
    if (channelPage.isUrlPage(url)) {
        channelPage.dynamicRun(parseUrl);
    } else {
        channelPage.intervalChannelPageVideoAndLiveListExecutor.stop();
    }
    userSpacePage.addShieldButton();
}

//页面加载完之后的静态路由
const staticRoutePageAfterLoad = (title, url) => {
    const parseUrl = urlUtil.parseUrl(url);
    console.log('页面加载完之后的静态路由', title, url, parseUrl)
    if (channelPage.isUrlPage(url)) {
        if (channelPage.isUserChannelPage(url)) {
            console.log('用户页的频道页')
            return;
        }
        channelPage.dynamicRun(parseUrl);
    }
}

//路由模块
export default {
    staticRoute,
    dynamicRoute,
    staticRoutePageAfterLoad
}
