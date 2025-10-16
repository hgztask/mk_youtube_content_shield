<script>
import gmUtil from "../utils/gmUtil.js";
import {isDelHomeShortsItemGm, isDelSponsoredAdsGm} from "../data/localMKData.js";
import homePage from "../pagesModel/homePage.js";

export default {
  data() {
    return {
      isDelSponsoredAdsV: isDelSponsoredAdsGm(),
      isDelHomeShortsItemV: isDelHomeShortsItemGm(),
    }
  },
  watch: {
    isDelSponsoredAdsV(n) {
      gmUtil.setData('is_del_sponsored_ads_gm', n);
    },
    isDelHomeShortsItemV(n) {
      gmUtil.setData('is_del_home_shorts_item_gm', n);
      homePage.startHomeShortsItemDisplay();
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
  </div>
</template>