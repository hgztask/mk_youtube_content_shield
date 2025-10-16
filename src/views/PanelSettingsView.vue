<script>
import gmUtil from "../utils/gmUtil.js";
import {eventEmitter} from "../model/EventEmitter.js";
import {getDrawerShortcutKeyGm} from "../data/localMKData.js";
//面板设置
export default {
  data() {
    return {
      drawerShortcutKeyVal: getDrawerShortcutKeyGm(),
      theKeyPressedKeyVal: ''
    }
  },
  methods: {
    setDrawerShortcutKeyBut() {
      const theKeyPressedKey = this.theKeyPressedKeyVal;
      const drawerShortcutKey = this.drawerShortcutKeyVal;
      if (drawerShortcutKey === theKeyPressedKey) {
        this.$message('不需要重复设置');
        return;
      }
      gmUtil.setData('drawer_shortcut_key_gm', theKeyPressedKey);
      this.$notify({message: '已设置打开关闭主面板快捷键', type: 'success'});
      this.drawerShortcutKeyVal = theKeyPressedKey;
    }
  },
  created() {
    eventEmitter.on('event-keydownEvent', (event) => {
      this.theKeyPressedKeyVal = event.key;
    })
  }
}
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <span>快捷键</span>
      </template>
      <div>1.默认情况下，按键盘tab键上的~键为展开关闭主面板</div>
      <div>2.当前展开关闭主面板快捷键：
        <el-tag>{{ drawerShortcutKeyVal }}</el-tag>
      </div>
      当前按下的键
      <el-tag>{{ theKeyPressedKeyVal }}</el-tag>
      <el-button @click="setDrawerShortcutKeyBut">设置打开关闭主面板快捷键</el-button>
    </el-card>
  </div>
</template>
