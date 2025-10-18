<script>
import {eventEmitter} from "../model/EventEmitter.js";

export default {
  data() {
    return {
      outputInfoArr: []
    }
  },
  methods: {
    clearInfoBut() {
      this.$confirm('是否清空信息', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        this.outputInfoArr = [];
        this.$notify({message: '已清空信息', type: 'success'})
      })
    },
    lookDataBut(row) {
      console.log(row)
    },
    addOutInfo(data) {
      const find = this.outputInfoArr.find(item => item.msg === data.msg);
      const date = new Date();
      const showTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      if (find) {
        find.showTime = showTime;
        if (find.msg === data.msg) {
          return;
        }
        find.data = data.data;
      } else {
        data.showTime = showTime;
        this.outputInfoArr.unshift(data);
      }
    }
  },
  created() {
    eventEmitter.on('event:print-msg', (msgData) => {
      if (typeof msgData === 'string') {
        //处理普通消息
        this.addOutInfo({msg: msgData, data: null})
        return;
      }
      this.addOutInfo(msgData)
    })
  }
}
</script>

<template>
  <div>
    <el-table :data="outputInfoArr" border stripe>
      <el-table-column label="显示时间" prop="showTime" width="80">
      </el-table-column>
      <el-table-column prop="msg">
        <template #header>
          <el-button type="info" @click="clearInfoBut">清空消息</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="85">
        <template #default="scope">
          <el-tooltip content="内容打印在控制台中">
            <el-button type="primary" @click="lookDataBut(scope.row)">print</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>