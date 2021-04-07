<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.fbid" clearable placeholder="fbid" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.appid" clearable placeholder="appid" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.tokenForBusiness" clearable placeholder="tokenForBusiness" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.fbname" clearable placeholder="fbname" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="fbid">
            <el-input v-model="form.fbid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="appid">
            <el-input v-model="form.appid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="tokenForBusiness">
            <el-input v-model="form.tokenForBusiness" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="email">
            <el-input v-model="form.email" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="fbname">
            <el-input v-model="form.fbname" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="sdate">
            <el-input v-model="form.sdate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="ip">
            <el-input v-model="form.ip" style="width: 370px;" />
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
        <el-table-column align="center" prop="fbid" label="fbid" />
        <el-table-column align="center" prop="appid" label="appid" />
        <el-table-column align="center" prop="tokenForBusiness" label="tokenForBusiness" />
        <el-table-column align="center" prop="email" label="email" />
        <el-table-column align="center" prop="fbname" label="fbname" />
        <el-table-column align="center" prop="sdate" label="sdate" />
        <el-table-column align="center" prop="ip" label="ip" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudFacebookUserBusinessInfo from '@/api/lpuser/facebookUserBusinessInfo'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
// import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, fbid: null, appid: null, tokenForBusiness: null, email: null, fbname: null, sdate: null, ip: null }
export default {
  name: 'FacebookUserBusinessInfo',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'getFacebookUserBusinessInfoList', url: '/api/lpFacebookUserBusinessInfo/getFacebookUserBusinessInfoList', idField: 'id', sort: 'id,desc', crudMethod: { ...crudFacebookUserBusinessInfo }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'facebookUserBusinessInfo:add'],
        edit: ['admin', 'facebookUserBusinessInfo:edit'],
        del: ['admin', 'facebookUserBusinessInfo:del']
      },
      rules: {
      },
      queryTypeOptions: [
        { key: 'fbid', display_name: 'fbid' },
        { key: 'appid', display_name: 'appid' },
        { key: 'tokenForBusiness', display_name: 'tokenForBusiness' },
        { key: 'fbname', display_name: 'fbname' }
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

<style scoped>
::v-deep .crud-opts-left {
  display: none;
}
</style>
