<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.gameCode"
          clearable
          placeholder="游戏"
          style="width: 120px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <rrOperation />
      </div>
      <el-button
        v-if="crud.optShow.download"
        :loading="crud.downloadLoading"
        class="filter-item posti"
        size="mini"
        type="warning"
        icon="el-icon-download"
        @click="addIosPro()"
      >新增</el-button>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <el-dialog
        :visible.sync="isShowDelg"
        width="550px"
        top="5vh"
        height="50%"
        :title="degioName"
        @close="clearValue"
      >
        <el-form
          ref="form"
          :model="scopeData"
          :rules="rules"
          size="small"
          label-width="120px"
        >
          <el-form-item label="gameCode">
            <el-input v-model="scopeData.gameCode" placeholder="请输入gameCode" style="width: 50%" />
          </el-form-item>

          <el-form-item label="packageName">
            <el-input
              v-model="scopeData.packageName"
              placeholder="请输入packageName"
              style="width: 50%"
            />
          </el-form-item>
          <el-form-item label="itemCode">
            <el-input
              v-model="scopeData.itemCode"
              placeholder="请输入品项ID"
              style="width: 50%"
            />
          </el-form-item>

          <el-form-item v-if="isShow" label="操作密钥">
            <el-input
              v-model="scopeData.recordID"
              placeholder="请输入密钥"
              style="width: 50%"
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
      <el-table
        ref="table"
        v-loading="crud.loading"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        border
        :data="crud.data"
        size="small"
        style="width: 100%"
      >
        <el-table-column
          v-permission="['admin', 'detectThirdPartyPayOpen:edit']"
          label="操作"
          width="125px"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">

            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editIosPro(scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="id" label="序号" width="65px" />
        <el-table-column align="center" prop="gameCode" label="gameCode" width="120px">
          <template>

            {{ query.gameCode }}
          </template>
        </el-table-column>

        <el-table-column prop="objKey" align="center" label="packageName" />
        <el-table-column prop="objVal" align="center" label="itemCode(最新的为金额)" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import {
  lpGetStoreItemCodeList,
  toSetAllowCurrencyPayIOS
} from '@/api/lpitmgr/detectThirdPartyPayOpen/getStoreItemCodeList'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
const defaultForm = { gameCode: null, sdate: null }
export default {
  name: 'GetStoreItemCodeList',
  components: { rrOperation, crudOperation, pagination },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: 'soho測試生成',
      url: '/api/detectThirdPartyPayOpen/getStoreItemCodeList',
      crudMethod: { ...lpGetStoreItemCodeList }
    })
  },
  data() {
    return {
      permission: {},
      rules: {},
      queryTypeOptions: [{ key: 'gameCode', display_name: '游戏代码' }],
      centerDialogVisible: false,
      gameOptions: [],
      keychainIDList: [],
      isBlocList: [],
      getIndex: null,
      keychainID: null,
      isBloc: null,
      isShowDelg: false,
      isShow: false,
      isWhiteList: [],
      currencyList: [
        { currency: 'USD', value: 'USD' },
        { currency: 'TWD', value: 'TWD' }
      ],
      scopeData: {
        gameCode: null,
        packageName: null,
        itemCode: null
      },
      getSelectData: '',
      getSeleCurrctData: '',
      userPassword: '',
      dt: '',
      degioName: '',
      curdHook: ''
    }
  },
  created() {
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
      download: true
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    getGameCodeData() {
      // gameCodeList().then((res) => {
      //   console.log(res)
      //   this.gameOptions = res.gameCodeList
      // })
    },
    toBlickList(data) {
      console.log(data)
      this.centerDialogVisible = !this.centerDialogVisible
    },
    addIosPro() {
      for (var key in this.scopeData) {
        this.scopeData[key] = null
      }
      this.crud.refresh()
      this.degioName = '新增'
      this.isShowDelg = !this.isShowDelg
      this.curdHook = 'add'
    },
    editIosPro(data) {
      console.log(data)
      this.degioName = '编辑'
      this.isShowDelg = !this.isShowDelg
      this.scopeData.gameCode = this.query.gameCode
      this.scopeData.packageName = data.objKey
      this.scopeData.itemCode = data.objVal
      this.curdHook = 'edit'
    },

    getServiceValue() {
      switch (this.curdHook) {
        case 'add':
          console.log(this.scopeData)
          if (this.scopeData.gameCode === null || this.scopeData.packageName === null || this.scopeData.itemCode === null) {
            this.$notify({
              message: '请输入必填参数',
              type: 'warning'
            })
          } else {
            toSetAllowCurrencyPayIOS(this.scopeData).then((res) => {
              console.log(res)
              if (res.content[0].code === '003') {
                this.$notify({
                  message: res.content[0].code,
                  type: 'warning'
                })
              } else {
                this.$notify({
                  message: '新增成功',
                  type: 'warning'
                })
              }
            })
          }

          break
        case 'edit':
          console.log(this.scopeData)
          toSetAllowCurrencyPayIOS(this.scopeData).then((res) => {
            console.log(res)
            if (res.content[0].code === '003') {
              this.$notify({
                message: res.content[0].code,
                type: 'success'
              })
            } else {
              this.$notify({
                message: '编辑成功',
                type: 'success'
              })
            }
          })
          break
      }
    },
    clearValue() {
      console.log('1')
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

<style rel="stylesheet/scss" lang="scss" scoped>
// .crud-opts {
//   // display: none;
// }
.posti{
  position: absolute;
}
::v-deep .crud-opts-left {
  display: none;
}
::v-deep .cell {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.serviceSel {
  float: right;
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

::v-deep .el-dialog__wrapper {
  .el-dialog {
    height: 38%;
    .el-dialog__header {
      padding: 20px;
      padding-bottom: 10px;
      background: #438eb9;
      .el-dialog__title {
        line-height: 24px;
        font-size: 18px;
        color: #fff;
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
        padding: 10px 0;
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
    }
  }
}
.open {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #dfe6ec;
  &:last-child {
    border-bottom: none;
  }
}
</style>
