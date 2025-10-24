<script>
import {
  isDelHomeShortsItemGm,
  isDelLiveHomeTopBannerGm,
  isDelSponsoredAdsGm,
  isDelVideoPageSponsoredAdsGm
} from "../data/localMKData.js";
import homePage from "../pagesModel/homePage.js";
import liveHomePage from "../pagesModel/liveHomePage.js";
import playerPage from "../pagesModel/playerPage.js";

export default {
  data() {
    return {
      isDelSponsoredAdsV: isDelSponsoredAdsGm(),
      isDelHomeShortsItemV: isDelHomeShortsItemGm(),
      isDelLiveHomeTopBannerV: isDelLiveHomeTopBannerGm(),
      isDelVideoPageSponsoredAdsV: isDelVideoPageSponsoredAdsGm()
    }
  },
  watch: {
    isDelSponsoredAdsV(n) {
      GM_setValue('is_del_sponsored_ads_gm', n);
    },
    isDelHomeShortsItemV(n) {
      GM_setValue('is_del_home_shorts_item_gm', n);
      homePage.startHomeShortsItemDisplay();
    },
    isDelLiveHomeTopBannerV(n) {
      GM_setValue('is_del_live_home_top_banner_gm', n);
      liveHomePage.removeLiveHomeTopBanner();
    },
    isDelVideoPageSponsoredAdsV(n) {
      GM_setValue('is_del_video_page_sponsored_ads_gm', n);
      if (n && playerPage.isUrlPage()) {
        playerPage.checkRightVideoListAd();
      }
    }
  }
}
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>首页</template>
      <el-switch v-model="isDelSponsoredAdsV" active-text="屏蔽赞助商广告"/>
      <el-switch v-model="isDelHomeShortsItemV" active-text="移除shorts"/>
    </el-card>
    <el-card shadow="never">
      <template #header>直播(首页)</template>
      <el-switch v-model="isDelLiveHomeTopBannerV" active-text="屏蔽顶部大横幅推广直播"/>
    </el-card>
    <el-card shadow="never">
      <template #header>视频页(直播页)</template>
      <el-switch v-model="isDelVideoPageSponsoredAdsV" active-text="屏蔽视频列表广告"
                 title="右侧视频列表上方的赞助商广告"/>
    </el-card>
  </div>
</template>