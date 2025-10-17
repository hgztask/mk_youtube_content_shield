<script>
import gmUtil from "../utils/gmUtil.js";
import {isDelHomeShortsItemGm, isDelLiveHomeTopBannerGm, isDelSponsoredAdsGm} from "../data/localMKData.js";
import homePage from "../pagesModel/homePage.js";
import liveHomePage from "../pagesModel/liveHomePage.js";

export default {
  data() {
    return {
      isDelSponsoredAdsV: isDelSponsoredAdsGm(),
      isDelHomeShortsItemV: isDelHomeShortsItemGm(),
      isDelLiveHomeTopBannerV: isDelLiveHomeTopBannerGm()
    }
  },
  watch: {
    isDelSponsoredAdsV(n) {
      gmUtil.setData('is_del_sponsored_ads_gm', n);
    },
    isDelHomeShortsItemV(n) {
      gmUtil.setData('is_del_home_shorts_item_gm', n);
      homePage.startHomeShortsItemDisplay();
    },
    isDelLiveHomeTopBannerV(n) {
      gmUtil.setData('is_del_live_home_top_banner_gm', n);
      liveHomePage.removeLiveHomeTopBanner();
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
  </div>
</template>