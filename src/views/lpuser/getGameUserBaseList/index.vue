<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.passport" clearable placeholder="passport" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="passport" prop="passport">
            <el-input v-model="form.passport" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" border :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column align="center" prop="id" label="id" width="60px" />
        <el-table-column align="center" prop="passport" label="passport" />
        <el-table-column align="center" prop="totalpoint" label="储值总L点" />
        <el-table-column align="center" prop="usepoint" label="使用总L点" />
        <el-table-column align="center" prop="userkey" label="userkey" />
        <el-table-column align="center" prop="lastChangeTime" label="最后一次更改时间" />
        <el-table-column align="center" prop="lastChangeType" label="最后一次更改类型" />
        <el-table-column v-if="checkPer(['admin','gameUserBase:edit','gameUserBase:del'])" align="center" label="操作" width="150px">
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
import crudGameUserBase from '@/api/lpuser/getGameUserBaseList'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { totalpoint: null, usepoint: null, userkey: null, id: null, lastChangeTime: null, lastChangeType: null, passport: null }
export default {
  name: 'GameUserBase',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'getGameUserBaseList', url: '/api/lpGameUserBase/getGameUserBaseList', idField: 'id', sort: 'id,desc', crudMethod: { ...crudGameUserBase }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'gameUserBase:add'],
        edit: ['admin', 'gameUserBase:edit'],
        del: ['admin', 'gameUserBase:del']
      },
      rules: {
        totalpoint: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        usepoint: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        userkey: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        passport: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'passport', display_name: 'passport' }
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
::v-deep .crud-opts-left {
  display: none;
}

</style>
