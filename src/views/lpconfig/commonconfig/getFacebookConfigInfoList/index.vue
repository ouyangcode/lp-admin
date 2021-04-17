<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.appId" clearable placeholder="appId" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.gamecode" clearable placeholder="gamecode" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
        <el-button
          v-if="crud.optShow.download"
          :loading="crud.downloadLoading"
          :disabled="!checkPer(['admin','facebookConfigInfo:add'])"
          class="filter-item postin"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="addGameInfo()"
        >新增</el-button>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog
        :visible.sync="isShowDelg"
        width="750px"
        top="5vh"
        height="95%"
        :title="dlogTitle"
      >
        <el-form
          ref="form"
          :model="scopeData"
          :rules="rules"
          size="small"
          label-width="140px"
        >
          <!-- <el-form-item label="游戏名称">
            <el-select
              v-model="serviceValue"
              placeholder="全部游戏查询"
              style="width: 130px"
            >
              <el-option
                v-for="item in servicePeople"
                :key="item.id"
                :label="item.nickname"
                :value="item.username"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="说明">
            <el-input v-model="scopeData.content" style="width: 80%" />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio v-model="scopeData.state" :label="0">正常</el-radio>
            <el-radio v-model="scopeData.state" :label="1">冻结</el-radio>
          </el-form-item>
          <el-form-item label="应用代码">
            <el-input v-model="scopeData.gamecode" style="width: 80%" />
          </el-form-item>
          <el-form-item label="appId">
            <el-input v-model="scopeData.appId" style="width: 80%" />
          </el-form-item>
          <el-form-item label="apiKey">
            <el-input v-model="scopeData.apiKey" style="width: 80%" />
          </el-form-item>
          <el-form-item label="secretKey">
            <el-input
              v-model="scopeData.secretKey"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="appAccessToken">
            <el-input
              v-model="scopeData.appAccessToken"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="appUrl">
            <el-input
              v-model="scopeData.appUrl"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="appEfunfunUrl">
            <el-input
              v-model="scopeData.appEfunfunUrl"
              style="width: 80%"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeTip">取消</el-button>
          <el-button
            :loading="crud.cu === 2"
            type="primary"
            @click="getServiceValue"
          >确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" border :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column align="center" prop="index" label="序号" />
        <el-table-column align="center" prop="content" label="说明" width="180px" />
        <el-table-column align="center" prop="state" label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.state === 0">{{ "正常" }}</div>
            <div v-if="scope.row.state === 1">{{ "冻结" }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="gamecode" label="应用代码" width="110px" />
        <el-table-column align="center" prop="appId" label="appId" width="180px" />
        <el-table-column align="center" prop="apiKey" label="apiKey" width="150px" />
        <el-table-column align="center" prop="secretKey" label="secretKey" width="550px" />
        <el-table-column align="center" prop="appAccessToken" label="appAccessToken" width="140px" />
        <el-table-column align="center" prop="appUrl" label="appUrl" width="130px" />
        <el-table-column align="center" prop="appEfunfunUrl" label="appEfunfunUrl" width="140px" />
        <el-table-column v-if="isShow" align="center" prop="disable" label="state" />
        <el-table-column align="center" prop="stime" label="stime" width="150px" />
        <el-table-column label="操作" width="90px" align="center" fixed="right">
          <template slot-scope="scope">
            <el-popover
              placement="bottom-end"
              popper-class="chProo"
              width="150px"
              trigger="click"
            >
              <el-button slot="reference" size="mini" icon="el-icon-setting">
                <i class="fa fa-caret-down" aria-hidden="true" />
              </el-button>
              <div class="dise">
                <div class="edit">
                  <el-button
                    size="mini"
                    type="primary"
                    :disabled="!checkPer(['admin','facebookConfigInfo:edit'])"
                    icon="el-icon-edit"
                    @click="editGameServerInfo(scope.row)"
                  >编辑</el-button>
                </div>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import { crudFacebookConfigInfo, add, edit } from '@/api/lpconfig/commonconfig/facebookConfigInfo'
import { parseTime } from '@/utils/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, apiKey: null, secretKey: null, appUrl: null, appId: null, state: null, content: null, gamecode: null, appEfunfunUrl: null, stime: null, appAccessToken: null, disable: null }
export default {
  name: 'FacebookConfigInfo',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'facebookConfigInfo', url: '/api/lpFacebookConfigInfo/getFacebookConfigInfoList', idField: 'id', sort: 'id,desc', crudMethod: { ...crudFacebookConfigInfo }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'facebookConfigInfo:add'],
        edit: ['admin', 'facebookConfigInfo:edit'],
        del: ['admin', 'facebookConfigInfo:del']
      },
      rules: {
      },
      queryTypeOptions: [
        { key: 'appId', display_name: 'appId' },
        { key: 'gamecode', display_name: 'gamecode' }
      ],
      isShowDelg: false,
      isShow: false,
      scopeData: { id: null, apiKey: null, secretKey: null, appUrl: null, appId: null, state: null, content: null, gamecode: null, appEfunfunUrl: null, stime: null, appAccessToken: null, disable: null },
      curdHook: '',
      dlogTitle: ''
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
      this.dlogTitle = '新增'
    },
    editGameServerInfo(data) {
      console.log(data)
      this.isShowDelg = !this.isShowDelg
      this.scopeData = data
      this.curdHook = 'edit'
      this.dlogTitle = '编辑'
    },
    getServiceValue() {
      switch (this.curdHook) {
        case 'add':
          this.scopeData.stime = parseTime(new Date())
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
          console.log(this.scopeData)
          edit(this.scopeData)
            .then((res) => {
              this.crud.editSuccessNotify()
              this.isShowDelg = !this.isShowDelg
              for (var key in this.scopeData) {
                this.scopeData[key] = null
              }
              this.crud.refresh()
            })
            .catch((err) => {
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
.el-popover.chProo {
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
<style rel="stylesheet/scss" lang="scss" scoped >
::v-deep .crud-opts-left {
  display: none;
}
.dise {
  display: flex;
  flex-direction: column;
  .edit {
    margin-bottom: 10px;
  }
  .del {
    margin-bottom: 10px;
  }
}

.postin {
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
      .el-dialog__headerbtn {
        .el-dialog__close {
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
