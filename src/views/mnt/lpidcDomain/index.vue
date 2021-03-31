<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.ip" clearable placeholder="请输入ip" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.domain" clearable placeholder="请输入域名" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-date-picker
          v-model="query.domainexpired"
          placeholder="选择日期"
          value-format="yyyy-MM-dd hh:mm:ss"
          class="date-item"
        />
        <el-date-picker
          v-model="query.sslexpired"
          placeholder="选择日期"
          class="date-item"
          value-format="yyyy-MM-dd hh:mm:ss"
        />
        <rrOperation :crud="crud" />
        <el-button
          v-if="crud.optShow.download"
          :loading="crud.downloadLoading"
          class="filter-item postin"
          size="mini"
          type="warning"
          icon="el-icon-plus"
          @click="addGameInfo()"
        >新增</el-button>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :visible.sync="isShowDelg" top="2vh" :title="delogTitle" width="750px">
        <el-form ref="form" :model="scopeData" :rules="rules" size="small" label-width="120px">
          <el-form-item label="id">
            <el-input v-model="scopeData.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="gamename">
            <el-input v-model="scopeData.gamename" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="packagename">
            <el-input v-model="scopeData.packagename" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="ip">
            <el-input v-model="scopeData.ip" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="domain">
            <el-input v-model="scopeData.domain" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="domainexpired">
            <el-date-picker v-model="scopeData.domainexpired" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="isssl">
            <el-input v-model="scopeData.isssl" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="sslexpired">
            <el-date-picker v-model="scopeData.sslexpired" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="tag">
            <el-input v-model="scopeData.tag" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="closeTip">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="getServiceValue">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" border :data="crud.data" size="small" style="width: 100%;">
        <el-table-column align="center" prop="id" label="id" />
        <el-table-column v-if="checkPer(['admin','lpidcDomain:edit','lpidcDomain:del'])" label="操作" width="90px" align="center">
          <template slot-scope="scope">
            <el-popover placement="bottom-end" popper-class="chProo" trigger="click">
              <el-button slot="reference" size="mini" icon="el-icon-setting">
                <i class="fa fa-caret-down" aria-hidden="true" />
              </el-button>
              <div class="dise">
                <div class="edit">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="editGameServerInfo(scope.row)"
                  >编辑</el-button>
                </div>

                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="delGameInfo(scope.row)"
                >删除</el-button>
              </div>

            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="gamename" label="gamename" />
        <el-table-column align="center" prop="packagename" label="packagename" />
        <el-table-column align="center" prop="ip" label="ip" />
        <el-table-column align="center" prop="domain" label="domain" />
        <el-table-column align="center" prop="domainexpired" label="domainexpired" />
        <el-table-column align="center" prop="isssl" label="isssl" />
        <el-table-column align="center" prop="sslexpired" label="sslexpired" />
        <el-table-column align="center" prop="tag" label="tag" />

      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import { crudLpidcDomain, add, edit, del } from '@/api/mnt/lpidcDomain'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
// import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, gamename: null, packagename: null, ip: null, domain: null, domainexpired: null, isssl: null, sslexpired: null, tag: null }
export default {
  name: 'LpidcDomain',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'lpidcDomain', url: '/api/lpidcDomain/getLpidcDomainList', idField: 'id', sort: 'id,desc', crudMethod: { ...crudLpidcDomain }})
  },
  data() {
    return {
      isShowDelg: false,
      permission: {
        add: ['admin', 'lpidcDomain:add'],
        edit: ['admin', 'lpidcDomain:edit'],
        del: ['admin', 'lpidcDomain:del']
      },
      scopeData: { id: null, gamename: null, packagename: null, ip: null, domain: null, domainexpired: null, isssl: null, sslexpired: null, tag: null },
      rules: {
      },
      queryTypeOptions: [
        { key: 'ip', display_name: 'ip' },
        { key: 'domain', display_name: 'domain' }
      ],
      curdHook: '',
      delogTitle: ''
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    addGameInfo() {
      for (var key in this.scopeData) {
        this.scopeData[key] = null
      }
      this.isShowDelg = !this.isShowDelg
      this.crud.refresh()
      this.curdHook = 'add'
      this.delogTitle = '新增'
    },
    editGameServerInfo(data) {
      console.log(data)
      this.isShowDelg = !this.isShowDelg
      this.scopeData = data
      this.curdHook = 'edit'
      this.delogTitle = '编辑'
    },
    delGameInfo(data) {
      var params = []
      params.push(data.grid)
      this.$confirm(`确认删除选中的数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          del(params).then((res) => {
            this.crud.dleChangePage(1)
            this.crud.delSuccessNotify()
            this.crud.refresh()
          })
        })
        .catch(() => {})
    },
    getServiceValue() {
      switch (this.curdHook) {
        case 'add':
          add(this.scopeData).then((res) => {
            this.crud.addSuccessNotify()
            this.isShowDelg = !this.isShowDelg
            for (var key in this.scopeData) {
              this.scopeData[key] = null
            }
            this.crud.refresh()
          })
          break
        case 'edit':
          edit(this.scopeData).then((res) => {
            this.crud.editSuccessNotify()
            this.isShowDelg = !this.isShowDelg
            for (var key in this.scopeData) {
              this.scopeData[key] = null
            }
            this.crud.refresh()
          }).catch(err => {
            console.log(err)
          })
          break
      }
    },
    closeTip() {
      this.isShowDelg = !this.isShowDelg
      for (var key in this.scopeData) {
        this.scopeData[key] = null
      }
      this.crud.refresh()
    }
  }
}
</script>

<style lang="scss">
  .el-popover.chProo{
 position: absolute;
  background: #fff;
  min-width: 100px;
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  padding: 12px;
  z-index: 2000;
  color: #606266;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  -webkit-box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  word-break: break-all;
  .popper__arrow {
    left: 78px !important;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>

::v-deep .crud-opts-left {
  display: none;
}
.dise{
  display: flex !important;
  flex-direction: column !important;
  .edit{
    margin-bottom: 10px;
  }
}
.postin{
  position: absolute;
}

::v-deep .el-dialog__wrapper {
  .el-dialog {
    height: 80%;
    overflow: auto;
    .el-dialog__header {
      padding: 20px;
      padding-bottom: 10px;
      background: #438eb9;
      .el-dialog__title {
        line-height: 24px;
        font-size: 18px;
        color: #fff;
      }
      .el-dialog__headerbtn{
        .el-dialog__close{
          color: #fff;
        }
      }
    }
    .el-dialog__body {
      padding: 0 1px;
      color: #606266;
      font-size: 14px;
      word-break: break-all;
      .el-form-item {
        margin-bottom: 5px;
        border-bottom: 1px solid #ccc;
        padding: 5px 0;
        .el-form-item__content {
          line-height: 40px;
          position: relative;
          font-size: 14px;
          border-left: 1px solid #ccc;
          padding: 0 10px;
        }
      }
    }
    .el-dialog__footer {
      padding: 20px;
      padding-top: 10px;
      text-align: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-bottom: 1px solid #ccc;
    }
  }
}
</style>
