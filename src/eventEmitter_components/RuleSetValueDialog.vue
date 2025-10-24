<script>
import ruleUtil from "../utils/ruleUtil.js";
import {eventEmitter} from "../model/EventEmitter.js";

/**
 * 显示修改规则的对话框
 */
export default {
  data() {
    return {
      show: false,
      ruleType: "",
      ruleName: "",
      oldVal: '',
      newVal: ''
    }
  },
  methods: {
    okBut() {
      const tempOldVal = this.oldVal.trim();
      const tempNewVal = this.newVal.trim();
      if (tempOldVal.length === 0 || tempNewVal.length === 0) {
        this.$alert("请输入要修改的值或新值");
        return
      }
      if (tempNewVal === tempOldVal) {
        this.$alert("新值不能和旧值相同")
        return;
      }
      const tempRuleType = this.ruleType;
      if (!ruleUtil.findRuleItemValue(tempRuleType, tempOldVal)) {
        this.$alert("要修改的值不存在");
        return;
      }
      if (ruleUtil.findRuleItemValue(tempRuleType, tempNewVal)) {
        this.$alert("新值已存在");
        return;
      }
      const ruleArr = GM_getValue(tempRuleType, []);
      const indexOf = ruleArr.indexOf(tempOldVal);
      ruleArr[indexOf] = tempNewVal;
      GM_setValue(tempRuleType, ruleArr);
      this.$alert(`已将旧值【${tempOldVal}】修改成【${tempNewVal}】`)
      this.show = false
    }
  },
  watch: {
    show(newVal) {
      // 关闭对话框时重置数据
      if (newVal === false) this.oldVal = this.newVal = '';
    }
  },
  created() {
    eventEmitter.on('修改规则对话框', ({key, name}) => {
      this.show = true;
      this.ruleType = key;
      this.ruleName = name
    });
  }
}
</script>
<template>
  <div>
    <el-dialog :close-on-click-modal="false" :modal="false" :visible.sync="show"
               title="修改单项规则值" width="30%">
      {{ ruleName }}-{{ ruleType }}
      <el-form>
        <el-form-item label="要修改的值">
          <el-input v-model="oldVal" clearable type="text"/>
        </el-form-item>
        <el-form-item label="修改后的值">
          <el-input v-model="newVal" clearable/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="show=false">取消</el-button>
        <el-button @click="okBut">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
