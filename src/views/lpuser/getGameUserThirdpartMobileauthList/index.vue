<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.passport" clearable placeholder="passport" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.imeinum" clearable placeholder="imeinum" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.xuhaonum" clearable placeholder="xuhaonum" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="passport">
            <el-input v-model="form.passport" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="imeinum">
            <el-input v-model="form.imeinum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="xuhaonum">
            <el-input v-model="form.xuhaonum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="stime">
            <el-input v-model="form.stime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="sitecode">
            <el-input v-model="form.sitecode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="param">
            <el-input v-model="form.param" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="tag">
            <el-input v-model="form.tag" style="width: 370px;" />
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
        <el-table-column align="center" prop="passport" label="passport" />
        <el-table-column align="center" prop="imeinum" label="imeinum" />
        <el-table-column align="center" prop="xuhaonum" label="xuhaonum" />
        <el-table-column align="center" prop="stime" label="stime" />
        <el-table-column align="center" prop="sitecode" label="sitecode" />
        <el-table-column align="center" prop="param" label="param" />
        <el-table-column align="center" prop="tag" label="tag" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudGameUserThirdpartMobileauth from '@/api/lpuser/gameUserThirdpartMobileauth'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
// import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, passport: null, imeinum: null, xuhaonum: null, stime: null, sitecode: null, param: null, tag: null }
export default {
  name: 'GameUserThirdpartMobileauth',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'getGameUserThirdpartMobileauthList', url: '/api/lpGameUserThirdpartMobileauth/getGameUserThirdpartMobileauthList', idField: 'id', sort: 'id,desc', crudMethod: { ...crudGameUserThirdpartMobileauth }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'gameUserThirdpartMobileauth:add'],
        edit: ['admin', 'gameUserThirdpartMobileauth:edit'],
        del: ['admin', 'gameUserThirdpartMobileauth:del']
      },
      rules: {
      },
      queryTypeOptions: [
        { key: 'passport', display_name: 'passport' },
        { key: 'imeinum', display_name: 'imeinum' },
        { key: 'xuhaonum', display_name: 'xuhaonum' }
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
