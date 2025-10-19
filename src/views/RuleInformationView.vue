<script>
import {eventEmitter} from "../model/EventEmitter.js";
import gmUtil from "../utils/gmUtil.js";
import ruleKeyListDataJson from '../res/ruleKeyListDataJson.json'

const ruleCountList = []
for (const {key, name, pattern} of ruleKeyListDataJson) {
  ruleCountList.push({
    name: pattern + name,
    key,
    len: gmUtil.getData(key, []).length,
  })
}

/**
 * 规则信息组件
 */
export default {
  data() {
    return {
      ruleCountList
    }
  },
  methods: {
    refreshInfo(isTip = true) {
      for (const x of this.ruleCountList) {
        x.len = gmUtil.getData(x.key, []).length;
      }
      if (!isTip) return;
      this.$notify({title: 'tip', message: '刷新规则信息成功', type: 'success'})
    },
    refreshInfoBut() {
      this.refreshInfo()
    },
    lookRuleBut(item) {
      if (item.len === 0) {
        this.$message.warning('当前规则信息为空')
        return;
      }
      eventEmitter.send('event-lookRuleDialog', item);
    }
  },
  created() {
    this.refreshInfo(false);
    eventEmitter.on('event:刷新规则信息', (isTip = true) => {
      this.refreshInfo(isTip);
    })
  }
};
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div class="el-horizontal-outside">
          <div>规则信息</div>
          <div>
            <el-button @click="refreshInfoBut">刷新信息</el-button>
          </div>
        </div>
      </template>
      <div style="display: flex;flex-wrap: wrap;row-gap: 2px;justify-content: flex-start;">
        <el-button v-for="item in ruleCountList" :key="item.name" size="small" @click="lookRuleBut(item)">
          {{ item.name }}
          <el-tag :effect="item.len>0?'dark':'light'" size="mini">
            {{ item.len }}
          </el-tag>
        </el-button>
      </div>
    </el-card>
  </div>
</template>