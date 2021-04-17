<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.gamecode" clearable placeholder="gamecode" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.packagename" clearable placeholder="packagename" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
        <el-button
          v-if="crud.optShow.download"
          :loading="crud.downloadLoading"
          :disabled="!checkPer(['admin','transactionApplepayProduct:add'])"
          class="filter-item postin"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="addGameInfo()"
        >新增</el-button>
      </div>
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog
        :visible.sync="isShowDelg"
        width="750px"
        top="5vh"
        height="95%"
        title="新增"
      >
        <el-form
          ref="form"
          :model="scopeData"
          :rules="rules"
          size="small"
          label-width="120px"
        >
          <el-form-item label="游戏名称">
            <el-select
              v-model="scopeData.gamecode"
              placeholder="全部游戏查询"
              style="width: 130px"
            >
              <el-option
                v-for="item in gameCodeList"
                :key="item.key"
                :label="item.gamename+'-'+item.gamecode"
                :value="item.gamecode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="siteCode">
            <el-input v-model="scopeData.sitecode" style="width: 80%" />
          </el-form-item>
          <el-form-item label="packageName">
            <el-input v-model="scopeData.packagename" style="width: 80%" />
          </el-form-item>
          <el-form-item label="品项ID">
            <el-input
              v-model="scopeData.productid"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="money">
            <el-input
              v-model="scopeData.money"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="rgmoney">
            <el-input
              v-model="scopeData.rgmoney"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="游戏币">
            <el-input
              v-model="scopeData.lpoint"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="货币">
            <el-input
              v-model="scopeData.currency"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="开放国家">
            <el-input
              v-model="scopeData.country"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="是否展示">
            <el-radio v-model="scopeData.status" label="0">删除</el-radio>
            <el-radio v-model="scopeData.status" label="1">展示</el-radio>
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
        <el-table-column align="center" prop="gamecode" label="gamecode" width="110px" />
        <el-table-column v-if="isShow" align="center" prop="servercode" label="servercode" width="120px" />
        <el-table-column align="center" prop="sitecode" label="sitecode" width="110px" />
        <el-table-column align="center" prop="packagename" label="packagename" width="130px" />
        <el-table-column align="center" prop="productid" label="productid" width="120px" />
        <el-table-column align="center" prop="money" label="money" />
        <el-table-column align="center" prop="lpoint" label="游戏币" />
        <el-table-column align="center" prop="currency" label="currency" />
        <el-table-column align="center" prop="status" label="status">
          <template slot-scope="scope">
            <div v-if="scope.row.status === '0'">{{ "删除" }}</div>
            <div v-if="scope.row.status === '1'">{{ "展示" }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="rgmoney" label="rgmoney" />
        <el-table-column align="center" prop="country" label="country" />
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
                    :disabled="!checkPer(['admin','transactionApplepayProduct:edit'])"
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
import { crudTransactionApplepayProduct, add, edit } from '@/api/lpconfig/storeItemConfig/transactionApplepayProduct'
import { getAllGameCode } from '@/api/lpgame/getGameServerList'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, gamecode: null, servercode: null, sitecode: null, packagename: null, productid: null, money: null, lpoint: null, currency: null, status: null, rgmoney: null, country: null }
export default {
  name: 'TransactionApplepayProduct',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'transactionApplepayProduct', url: '/api/lpTransactionApplepayProduct/getTransactionApplepayProductList', idField: 'id', sort: 'id,desc', crudMethod: { ...crudTransactionApplepayProduct }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'transactionApplepayProduct:add'],
        edit: ['admin', 'transactionApplepayProduct:edit'],
        del: ['admin', 'transactionApplepayProduct:del']
      },
      rules: {
      },
      isShowDelg: false,
      isShow: false,
      scopeData: { id: null, gamecode: null, servercode: null, sitecode: null, packagename: null, productid: null, money: null, lpoint: null, currency: null, status: null, rgmoney: null, country: null },
      curdHook: '',
      dlogTitle: '',
      gameCodeList: []
    }
  },
  created() {
    this.getGameCodeList()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    getGameCodeList() {
      getAllGameCode().then(res => {
        this.gameCodeList = res
      })
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
