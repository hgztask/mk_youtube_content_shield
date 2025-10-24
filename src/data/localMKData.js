export const getDrawerShortcutKeyGm = () => {
    return GM_getValue('get_drawer_shortcut_key_gm', '`')
}

export const isDelSponsoredAdsGm= () => {
    return GM_getValue('is_del_sponsored_ads_gm', true)
}

export const isDelHomeShortsItemGm= () => {
    return GM_getValue('is_del_home_shorts_item_gm', true)
}

export const isDelLiveHomeTopBannerGm = () => {
    return GM_getValue('is_del_live_home_top_banner_gm', true)
}

export const isDelVideoPageSponsoredAdsGm = () => {
    return GM_getValue('is_del_video_page_sponsored_ads_gm', false)
}