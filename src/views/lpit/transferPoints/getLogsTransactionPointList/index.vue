<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.passport_from" clearable placeholder="轉出點數passport" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.passport_to" clearable placeholder="接收點數passport" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="passportFrom" prop="passportFrom">
            <el-input v-model="form.passportFrom" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="passportTo" prop="passportTo">
            <el-input v-model="form.passportTo" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="point" prop="point">
            <el-input v-model="form.point" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="operateUser" prop="operateUser">
            <el-input v-model="form.operateUser" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="crtime" prop="crtime">
            <el-input v-model="form.crtime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="operateIp">
            <el-input v-model="form.operateIp" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="state">
            <el-input v-model="form.state" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" border :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column align="center" prop="index" label="序号" />
        <el-table-column align="center" prop="passportFrom" label="转出点数passport" />
        <el-table-column align="center" prop="passportTo" label="接收点数passport" />
        <el-table-column align="center" prop="point" label="点数" />
        <el-table-column align="center" prop="operateUser" label="操作用户" />
        <el-table-column align="center" prop="crtime" label="创建时间" />
        <el-table-column align="center" prop="operateIp" label="操作ip" />
        <el-table-column align="center" prop="state" label="状态" />
        <el-table-column v-if="checkPer(['admin','logsTransactionPoint:edit','logsTransactionPoint:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudLogsTransactionPoint from '@/api/lpitmgr/transferPoints/logsTransactionPoint'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, passportFrom: null, passportTo: null, point: null, operateUser: null, crtime: null, operateIp: null, state: null }
export default {
  name: 'LogsTransactionPoint',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '转点记录列表', url: '/api/lpLogsTransactionPoint/getLogsTransactionPointList', idField: 'id', sort: 'id,desc', crudMethod: { ...crudLogsTransactionPoint }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'logsTransactionPoint:add'],
        edit: ['admin', 'logsTransactionPoint:edit'],
        del: ['admin', 'logsTransactionPoint:del']
      },
      rules: {
        passportFrom: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        passportTo: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        point: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        operateUser: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        crtime: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }}
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.changDate {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 10px;
  height: 30.5px !important;
  width: 230px !important;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  border-radius: 4px;
  padding: 0 15px;
  box-sizing: border-box;
  span {
    margin: 0 10px;
  }
  input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    outline: none;
    display: inline-block;
    height: 100%;
    margin: 0;
    padding: 0;
    width: 39%;
    text-align: center;
    font-size: 14px;
    color: #606266;
  }
  .closeInp {
    position: absolute;
    top: 0.5rem;
    right: 0.35rem;
    font-size: 14px;
  }
}
::v-deep .crud-opts-left {
  display: none;
}
::v-deep .cell {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

::v-deep .el-dialog {
  margin-top: 5vh;
}

.serviceSel {
  float: right;
}

.postio{
    position: absolute;
}

.changeRed {
  color: red;
}

.demo-image__preview {
  overflow: auto;
}

.el-form-item {
  margin-bottom: 5px;
}

.el-image {
  margin-left: 10px;
  margin-bottom: 10px;
}

.clearfix {
  *zoom: 1;
}
.clearfix::before {
  display: table;
  content: " ";
}
.clearfix::after {
  clear: both;
  display: table;
  content: " ";
}
.userinfo {
  width: 100%;
  height: 150px;
  display: flex;
  .userinfo-left {
    flex: 1;
  }
  .userinfo-center {
    flex: 1;
  }
  .userinfo-right {
    flex: 1;
  }
  .userinfo-top {
    flex: 1;
  }
}
.showMsg {
  position: absolute;
  top: 22px;
  left: 110px;
  font-size: 18px;
  color: red;
  font-weight: 600;
}
.el-dialog__body {
  padding: 0px 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}
.sockTip {
  width: 100%;
  height: 300px;
  .chartContent {
    width: 100%;
    height: 250px;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.1);
    overflow: auto;
    .content {
      width: 100%;
      border-radius: 5px;
      .left-content {
        padding: 10px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .msg-date {
          text-align: center;
          color: gray;
          font-size: 16px;
          padding-left: 16px;
        }
        .usercontent {
          float: left;
          word-wrap: break-word;
          word-break: break-all;
          margin-left: 10px;
          margin-top: 5px;
          background-color: #fff;
          width: 75%;
          padding: 6px 10px;
          border-radius: 10px;
          font-size: 16px;
        }
        .left-start {
          padding-left: 17px;
        }
      }
      .right-content {
        padding: 10px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .msg-date {
          text-align: center;
          color: gray;
          font-size: 16px;
          padding-right: 18px;
        }
        .servicecontent {
          word-wrap: break-word;
          word-break: break-all;
          margin-right: 10px;
          margin-top: 5px;
          color: #fff;
          background-color: green;
          width: 75%;
          padding: 6px 10px;
          border-radius: 10px;
          font-size: 16px;
          font-family: "Courier New", Courier, monospace;
        }
        .right-start {
          padding-right: 20px;
        }
      }
    }
  }
}
.chatting-input {
  display: flex;
  height: 40px;
  width: 100%;
  margin-top: 12px;
  .el-input {
    flex: 1;
    padding-left: 10px;
    // padding-top: 10px;
    height: 100%;
    font-size: 18px;
  }
  button {
    width: 90px;
    height: 33px;
    line-height: 8px;
    background-color: #2196f3;
    color: #fff;
    font-size: 18px;
  }
}
.serviceDel {
  position: absolute;
  top: 25px;
  right: 23px;
}
</style>

