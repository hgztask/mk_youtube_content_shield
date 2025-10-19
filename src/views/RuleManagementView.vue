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
    <el-cascader v-model="cascaderVal" :options="cascaderOptions" style="width: 100%"
                 :props="{ expandTrigger: 'hover' }" :show-all-levels="true"
                 filterable @change="handleChangeCascader"/>
    <el-divider/>
    <el-button-group>
      <el-button @click="batchAddBut">批量添加</el-button>
      <el-button @click="setRuleBut">修改</el-button>
      <el-button @click="findItemAllBut">查看项内容</el-button>
      <el-button @click="delBut">移除</el-button>
    </el-button-group>
    <el-button-group>
      <el-button type="danger" @click="clearItemRuleBut">清空项</el-button>
      <el-button type="danger" @click="delAllBut">全部移除</el-button>
    </el-button-group>
    <el-card shadow="never">
      <template #header>说明</template>
      <div>1.规则的值唯一，且不重复。</div>
      <div>2.关联规则值同上，是双向关联关系。</div>
      <div>3.关联规则分割的两方为精确匹配</div>
      <div>
        4.关联规则中某种类型的值颠倒顺序，也视为同一个，等于颠倒后的结果，比如用户id关联用户名中的@ikun|爱坤等于@iKun|爱坤
      </div>
      <div>
        <el-link href="https://www.jyshare.com/front-end/854/" target="_blank" type="primary">
          5.正则表达式测试地址
        </el-link>
      </div>
    </el-card>
    <AddRuleDialog v-model="addRuleDialogVisible" :rule-info="addRuleDialogRuleInfo"/>
    <RuleSetValueDialog/>
    <ViewRulesRuleDialog/>
  </div>
</template>
