<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.gamecode" clearable placeholder="gamecode" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.packagename" clearable placeholder="packagename" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
        <el-button
          v-if="crud.optShow.download"
          :loading="crud.downloadLoading"
          :disabled="!checkPer(['admin','transactionExchangerateDict:add'])"
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
        :rules="rules"
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
          label-width="120px"
        >
          <el-form-item label="currencyName">
            <el-input v-model="scopeData.currencyname" placeholder="请输入汇率名" style="width: 80%" />
          </el-form-item>
          <el-form-item label="currencyCode">
            <el-input v-model="scopeData.currencycode" placeholder="请输入汇率代码" style="width: 80%" />
          </el-form-item>
          <el-form-item label="currencyRate">
            <el-input v-model="scopeData.currencyrate" placeholder="请输入汇率值" style="width: 80%" />
          </el-form-item>
          <el-form-item label="是否有效">
            <el-radio v-model="scopeData.stag" :label="0">开放</el-radio>
            <el-radio v-model="scopeData.stag" :label="1">禁用</el-radio>
          </el-form-item>
          <el-form-item label="操作密钥">
            <el-input v-model="scopeData.mykey" placeholder="请输入操作密钥" style="width: 80%" />
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
        <el-table-column align="center" prop="currencyname" label="currencyName" width="120px" />
        <el-table-column align="center" prop="currencycode" label="currencyCode" width="120px" />
        <el-table-column align="center" prop="currencyrate" label="currencyRate" width="120px" />
        <el-table-column align="center" prop="pw" label="pw" width="240px" />
        <el-table-column align="center" prop="stag" label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.stag === 0">{{ "开放" }}</div>
            <div v-if="scope.row.stag === 1">{{ "禁用" }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="cacheInfo" label="Redis缓存值" width="350px">
          <template slot-scope="scope">
            <span>{{ scope.row.cacheInfo }}</span><span v-if="scope.row.isfix === '✔'" style="color:green">{{ scope.row.isfix }}</span>
            <span v-if="scope.row.isfix === '×'" style="color:red">{{ scope.row.isfix }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="suser" label="操作人" width="120px" />
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
                    :disabled="!checkPer(['admin','transactionExchangerateDict:edit'])"
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
import { crudTransactionExchangerateDictList, add, edit } from '@/api/lpconfig/commonconfig/getTransactionExchangerateDictList'
import { parseTime } from '@/utils/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, channel: null, status: null, content: null, name: null, paykey: null, serverIp: null }
export default {
  name: 'TransactionExchangerateDictList',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'TransactionExchangerateDictList', url: '/api/lpTransactionExchangerateDict/getTransactionExchangerateDictList', idField: 'id', sort: 'id,desc', crudMethod: { ...crudTransactionExchangerateDictList }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'transactionChannel:add'],
        edit: ['admin', 'transactionChannel:edit'],
        del: ['admin', 'transactionChannel:del']
      },
      rules: {
        mykey: [
          { required: true, message: '请输入密钥', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'channel', display_name: 'channel' }
      ],
      isShowDelg: false,
      isShow: false,
      scopeData: {
        currencyname: null, currencycode: null, currencyrate: null, stag: null, mykey: null, id: null
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
          this.scopeData.stime = parseTime(new Date())
          add(this.scopeData).then((res) => {
            if (res.code === '1') {
              this.$notify({
                title: '警告',
                message: res.msg,
                type: 'warning'
              })
            } else {
              this.crud.addSuccessNotify()
            }
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
              if (res.code === '1') {
                this.$notify({
                  title: '警告',
                  message: res.msg,
                  type: 'warning'
                })
              } else {
                this.crud.editSuccessNotify()
              }

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
    height: 66%;
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

