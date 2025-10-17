import gmUtil from "../utils/gmUtil.js";

export const getDrawerShortcutKeyGm = () => {
    return gmUtil.getData('get_drawer_shortcut_key_gm', '`')
}

export const isDelSponsoredAdsGm= () => {
    return gmUtil.getData('is_del_sponsored_ads_gm', true)
}

export const isDelHomeShortsItemGm= () => {
    return gmUtil.getData('is_del_home_shorts_item_gm', true)
}

export const isDelLiveHomeTopBannerGm = () => {
    return gmUtil.getData('is_del_live_home_top_banner_gm', true)
}