<script>

import globalValue from "../data/globalValue.js";
import {eventEmitter} from "../model/EventEmitter.js";

/**
 * 关于与反馈组件
 */
export default {
  data() {
    return {
      group_url: globalValue.group_url,
      scriptCat_js_url: globalValue.scriptCat_js_url,
      b_url: globalValue.b_url,
      github_url: globalValue.github_url,
      update_log_url: globalValue.update_log_url,
      activeName: ['1', '2']
    }
  },
  methods: {
    lookImgBut() {
      eventEmitter.send('显示图片对话框', {image: "https://www.mikuchase.ltd/img/qq_group_876295632.webp"})
    }
  }
}
</script>
<template>
  <div>
    <el-collapse v-model="activeName">
      <el-collapse-item name="1" title="作者b站">
        <el-link :href="b_url" target="_blank" type="primary">b站传送门</el-link>
      </el-collapse-item>
      <el-collapse-item name="2" title="反馈交流群">
        <el-link
            :href='group_url' target="_blank" type="primary">====》Q群传送门《====
        </el-link>
        <el-tooltip content="点击查看群二维码">
          <el-tag @click="lookImgBut">876295632</el-tag>
        </el-tooltip>
      </el-collapse-item>
      <el-collapse-item name="3" title="脚本猫更新地址">
        目前仅在脚本猫平台上更新发布
        <el-link :href="scriptCat_js_url" target="_blank" type="primary">脚本猫更新地址</el-link>
      </el-collapse-item>
      <el-collapse-item name="4" title="开源地址">
        <div>本脚本源代码已开源，欢迎大家Star或提交PR</div>
        <el-link :href="github_url" target="_blank" type="primary">github开源地址</el-link>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>