<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.passport" clearable placeholder="passport" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.gamecode" clearable placeholder="gamecode" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.servercode" clearable placeholder="servercode" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="passport">
            <el-input v-model="form.passport" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="gamecode">
            <el-input v-model="form.gamecode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="servercode">
            <el-input v-model="form.servercode" style="width: 370px;" />
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
        <el-table-column align="center" prop="passport" label="passport" width="160px" />
        <el-table-column align="center" prop="sitecode" label="sitecode" width="130px" />
        <el-table-column align="center" prop="gamecode" label="gamecode" width="120px" />
        <el-table-column align="center" prop="servercode" label="servercode" width="125px" />
        <el-table-column align="center" prop="param" label="param" width="160px" />
        <el-table-column align="center" prop="param2" label="param2" width="160px" />
        <el-table-column align="center" prop="stime" label="stime" width="150px" />
        <el-table-column align="center" prop="tag" label="tag" />
        <el-table-column align="center" prop="ipaddress" label="ipaddress" width="130px" />
        <el-table-column align="center" prop="country" label="country" />
        <el-table-column align="center" prop="packagename" label="packagename" width="160px" />
        <el-table-column align="center" prop="os" label="os" />
        <el-table-column align="center" prop="language" label="language" />
        <el-table-column v-if="checkPer(['admin','transactionMobileGameParam2:edit','transactionMobileGameParam2:del'])" label="操作" width="150px" align="center">
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
import crudTransactionMobileGameParam2 from '@/api/lpitmgr/gameStoreParam/getTransactionMobileGameParam2List'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, passport: null, sitecode: null, gamecode: null, servercode: null, param: null, param2: null, stime: null, tag: null, ipaddress: null, country: null, packagename: null, os: null, language: null }
export default {
  name: 'TransactionMobileGameParam2',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'transactionMobileGameParam2', url: '/api/gameStoreParam2/getTransactionMobileGameParam2List', idField: 'id', sort: 'id,desc', crudMethod: { ...crudTransactionMobileGameParam2 }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'transactionMobileGameParam2:add'],
        edit: ['admin', 'transactionMobileGameParam2:edit'],
        del: ['admin', 'transactionMobileGameParam2:del']
      },
      rules: {
      },
      queryTypeOptions: [
        { key: 'passport', display_name: 'passport' },
        { key: 'gamecode', display_name: 'gamecode' },
        { key: 'servercode', display_name: 'servercode' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped >
.changDate {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
    height: 30.5px!important;
    width: 199px!important;
    border: 1px solid #dcdfe6;
    background-color: #fff;
    border-radius: 4px;
    padding: 0px 14px;
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
    width: 40%;
    text-align: center;
    font-size: 13px;
    color: #606266;
  }
  .closeInp {
    position: absolute;
    top: 8px;
    right: 6px;
    font-size: 14px;
    z-index: 10;
  }
}
::v-deep .crud-opts-left {
  display: none;
}
.open {

  border-bottom: 1px solid #dfe6ec;
  &:last-child {
    border-bottom: none;
  }
}

</style>
