<template>
  <div>
    <el-drawer :visible.sync="drawer"
               title="油管屏蔽器"
               :z-index="2050" size="35%"
               style="position: fixed;">
      <el-tabs tab-position="left" type="card">
        <el-tab-pane lazy label="规则管理">
          <RuleManagementView/>
        </el-tab-pane>
        <el-tab-pane lazy label="页面处理">
          <PageProcessingView/>
        </el-tab-pane>
        <el-tab-pane label="输出信息" lazy>
          <OutputInformationView/>
        </el-tab-pane>
        <el-tab-pane label="检测状态" lazy>
          <DetectionStatusView/>
        </el-tab-pane>
        <el-tab-pane lazy label="面板设置">
          <PanelSettingsView/>
        </el-tab-pane>
        <el-tab-pane lazy label="关于与反馈">
          <AboutAndFeedbackView/>
          <DonateLayoutView/>
        </el-tab-pane>
      </el-tabs>
      <div v-if="dev">

      <el-button @click="testBut">测试1</el-button>
      <el-button @click="test1But">测试获取直播页弹幕列表</el-button>
      <el-button @click="test2But">测试获取播放页右侧视频列表</el-button>
      <el-button @click="test3But">检查播放页聊天弹幕屏蔽</el-button>
      </div>
    </el-drawer>
    <ShowImgDialog/>
    <SheetDialog/>
  </div>
</template>

<script>
import {eventEmitter} from "./model/EventEmitter.js";
import RuleManagementView from "./views/RuleManagementView.vue";
import PanelSettingsView from "./views/PanelSettingsView.vue";
import AboutAndFeedbackView from "./views/AboutAndFeedbackView.vue";
import ShowImgDialog from "./eventEmitter_components/ShowImgDialog.vue";
import DonateLayoutView from "./views/DonateLayoutView.vue";
import SheetDialog from "./eventEmitter_components/SheetDialog.vue";
import PageProcessingView from "./views/PageProcessingView.vue";
import DetectionStatusView from "./views/DetectionStatusView.vue";
import OutputInformationView from "./views/OutputInformationView.vue";

export default {
  components: {
    OutputInformationView,
    ShowImgDialog, RuleManagementView, PanelSettingsView, AboutAndFeedbackView, DonateLayoutView,
    SheetDialog, PageProcessingView, DetectionStatusView
  },
  data() {
    return {
      drawer: false,
      dev: __DEV__
    }
  },
  methods: {
    testBut() {
    },
    test1But() {
    },
    test2But() {
    },
    test3But() {
    }
  },
  created() {
    eventEmitter.on('event-drawer-show', (bool) => {
      this.drawer = bool === null ? !this.drawer : bool
    })
    eventEmitter.on('el-notify', (options) => {
      this.$notify(options)
    })
    eventEmitter.on('el-msg', (...options) => {
      this.$message(...options)
    })
    eventEmitter.on('el-alert', (...options) => {
      this.$alert(...options);
    })
    eventEmitter.handler('el-confirm', (...options) => {
      return this.$confirm(...options);
    })
    eventEmitter.handler('el-prompt', (...options) => {
      return this.$prompt(...options)
    })

  }
}
</script>
