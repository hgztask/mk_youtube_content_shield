<script>
import ruleKeyListData from "../data/ruleKeyListData.js";
import AddRuleDialog from "../components/AddRuleDialog.vue";
import ruleKeyListDataJson from '../res/ruleKeyListDataJson.json'
import {eventEmitter} from "../model/EventEmitter.js";
import RuleSetValueDialog from "../eventEmitter_components/RuleSetValueDialog.vue";
import ViewRulesRuleDialog from "../eventEmitter_components/ViewRulesRuleDialog.vue";
import ruleUtil from "../utils/ruleUtil.js";
import gmUtil from "../utils/gmUtil.js";

const ruleInfoArr = ruleKeyListDataJson;

export default {
  components: {AddRuleDialog, RuleSetValueDialog, ViewRulesRuleDialog},
  data() {
    return {
      cascaderVal: ['精确匹配', 'userId_precise'],
      cascaderOptions: ruleKeyListData.getSelectOptions(),
      addRuleDialogVisible: false,
      addRuleDialogRuleInfo: {key: '', name: ''}
    }
  },
  methods: {
    handleChangeCascader(val) {
      console.log(val)
    },
    batchAddBut() {
      const [_, key] = this.cascaderVal;
      this.addRuleDialogVisible = true;
      this.addRuleDialogRuleInfo = {
        key,
        name: ruleInfoArr.find(item => item.key === key).name
      }
    },
    setRuleBut() {
      const [_, key] = this.cascaderVal;
      const typeMap = ruleInfoArr.find(item => item.key === key);
      eventEmitter.send('修改规则对话框', typeMap)
    },
    findItemAllBut() {
      const [_, key] = this.cascaderVal;
      const typeMap = ruleInfoArr.find(item => item.key === key);
      eventEmitter.send('event-lookRuleDialog', typeMap);
    },
    delBut() {
      const [_, key] = this.cascaderVal;
      ruleUtil.showDelRuleInput(key);
    },
    clearItemRuleBut() {
      const key = this.cascaderVal[1];
      const find = ruleInfoArr.find(item => item.key === key);
      this.$confirm(`是要清空${find.name}的规则内容吗？`, 'tip').then(() => {
        gmUtil.delData(key)
        this.$alert(`已清空${find.name}的规则内容`)
      })
    },
    delAllBut() {
      this.$confirm('确定要删除所有规则吗？').then(() => {
        for (const x of ruleInfoArr) {
          gmUtil.delData(x.key);
        }
        this.$message.success("删除全部规则成功");
        // eventEmitter.send('刷新规则信息', false);
      })
    }
  },
  watch: {},
  created() {

  }
}
</script>

<template>
  <div>
    <el-cascader v-model="cascaderVal" :options="cascaderOptions"
                 :props="{ expandTrigger: 'hover' }" :show-all-levels="true"
                 filterable @change="handleChangeCascader"/>
    <el-divider/>
    <el-row>
      <el-col :span="12">
        <el-button-group>
          <el-button @click="batchAddBut">批量添加</el-button>
          <el-button @click="setRuleBut">修改</el-button>
          <el-button @click="findItemAllBut">查看项内容</el-button>
          <el-button @click="delBut">移除</el-button>
        </el-button-group>
      </el-col>
      <el-col :span="12">
        <div class="el-horizontal-right">
          <el-button-group>
            <el-button type="danger" @click="clearItemRuleBut">清空项</el-button>
            <el-button type="danger" @click="delAllBut">全部移除</el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
    <AddRuleDialog v-model="addRuleDialogVisible" :rule-info="addRuleDialogRuleInfo"/>
    <RuleSetValueDialog/>
    <ViewRulesRuleDialog/>
  </div>
</template>
