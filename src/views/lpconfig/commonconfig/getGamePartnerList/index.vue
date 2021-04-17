<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.sitecode" clearable placeholder="sitecode" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
        <el-button
          v-if="crud.optShow.download"
          :loading="crud.downloadLoading"
          :disabled="!checkPer(['admin','gamePartner:add'])"
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
        top="1vh"
        height="95%"
        :title="dlogTitle"
      >
        <el-form
          ref="form"
          :model="scopeData"
          :rules="rules"
          size="small"
          label-width="120px"
        >
          <el-form-item label="网站名称">
            <el-input v-model="scopeData.name" placeholder="请输入网站名称" style="width: 80%" />
          </el-form-item>
          <el-form-item label="网站编码">
            <el-input v-model="scopeData.sitecode" placeholder="请输入网站编码" style="width: 80%" />
          </el-form-item>
          <el-form-item label="官网地址">
            <el-input v-model="scopeData.siteurl" placeholder="请输入官网地址" style="width: 80%" />
          </el-form-item>
          <el-form-item label="交互服务器IP">
            <el-input v-model="scopeData.serverIp" placeholder="请输入交互服务器IP" style="width: 80%" />
          </el-form-item>
          <el-form-item label="登录密钥">
            <el-input v-model="scopeData.loginkey" placeholder="请输入登录密钥" style="width: 80%" />
          </el-form-item>
          <el-form-item label="充值密钥">
            <el-input
              v-model="scopeData.paykey"
              placeholder="请输入充值密钥"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio v-model="scopeData.disabled" :label="0">正常</el-radio>
            <el-radio v-model="scopeData.disabled" :label="1">冻结</el-radio>
          </el-form-item>
          <el-form-item label="合作类型">
            <el-radio v-model="scopeData.type" label="user">导入用户</el-radio>
            <el-radio v-model="scopeData.type" label="game">游戏混合服</el-radio>
          </el-form-item>
          <el-form-item label="合作游戏(*表示全部)">
            <el-input v-model="scopeData.gamecode" style="width: 80%" />
          </el-form-item>
          <el-form-item label="合作伺服器(*表示全部)">
            <el-input v-model="scopeData.servercode" style="width: 80%" />
          </el-form-item>
          <el-form-item label="说明">
            <el-input v-model="scopeData.content" type="textarea" :rows="2" style="width: 80%" />
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
        <el-table-column align="center" prop="name" label="网站名称" />
        <el-table-column align="center" prop="sitecode" label="网站编码" />
        <el-table-column align="center" prop="disabled" label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.disabled === 0">{{ "正常" }}</div>
            <div v-if="scope.row.disabled === 1">{{ "冻结" }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="loginkey" label="登录密钥" width="200px" />
        <el-table-column align="center" prop="paykey" label="充值密钥" width="200px" />
        <el-table-column align="center" prop="serverIp" label="交互ip" width="150px" />
        <el-table-column align="center" prop="type" label="类型">
          <template slot-scope="scope">
            <div v-if="scope.row.type === 'user'">{{ '导入用户' }}</div>
            <div v-if="scope.row.type === 'game'">{{ '游戏混合服' }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="siteurl" label="官网地址" width="180px" />
        <el-table-column align="center" prop="gamecode" label="合作游戏" width="110px" />
        <el-table-column align="center" prop="servercode" label="合作伺服器" width="120px" />
        <el-table-column v-if="isShow" align="center" prop="gpid" label="gpid" />
        <el-table-column align="center" prop="content" label="说明" width="150px" />

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
                    :disabled="!checkPer(['admin','gamePartner:edit'])"
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
import { crudGamePartner, add, edit } from '@/api/lpconfig/commonconfig/gamePartner'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { gpid: null, sitecode: null, siteurl: null, disabled: null, loginkey: null, serverIp: null, type: null, content: null, name: null, paykey: null, gamecode: null, servercode: null }
export default {
  name: 'GamePartner',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'GamePartner', url: '/api/lpGamePartner/getGamePartnerList', idField: 'gpid', sort: 'gpid,desc', crudMethod: { ...crudGamePartner }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'gamePartner:add'],
        edit: ['admin', 'gamePartner:edit'],
        del: ['admin', 'gamePartner:del']
      },
      rules: {
        sitecode: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        siteurl: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        disabled: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        loginkey: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: 'name', trigger: 'blur' }
        ],
        paykey: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        gamecode: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        servercode: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'sitecode', display_name: 'sitecode' }
      ],
      isShowDelg: false,
      isShow: false,
      scopeData: {
        gpid: null, sitecode: null, siteurl: null, disabled: null, loginkey: null, serverIp: null, type: null, content: null, name: null, paykey: null, gamecode: null, servercode: null
      },
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
    height: 95%;
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
