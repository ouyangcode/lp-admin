
<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <div class="select_tool">
          <!-- 搜索 -->
          <el-input
            v-model="query.gameCode"
            clearable
            placeholder="游戏"
            style="width: 100px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-input
            v-model="query.packageName"
            clearable
            placeholder="包名"
            style="width: 180px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
        </div>
        <rrOperation />
        <el-button
          v-if="crud.optShow.download"
          :loading="crud.downloadLoading"
          class="filter-item poasin"
          size="mini"
          type="warning"
          icon="el-icon-download"
          @click="addIosPro()"
        >新增</el-button>
      </div>

      <crudOperation :permission="permission" />
      <el-dialog
        :visible.sync="isShowDelg"
        width="750px"
        top="5vh"
        height="53%"
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
          <el-form-item label="gameName">
            <el-input v-model="scopeData.gameName" placeholder="请输入gameName" style="width: 50%" />
          </el-form-item>
          <el-form-item label="packageName">
            <el-input
              v-model="scopeData.packageName"
              placeholder="请输入packageName"
              style="width: 50%"
            />
          </el-form-item>
          <el-form-item label="currency">
            <el-input
              v-model="scopeData.currency"
              placeholder="输入货币以,隔开"
              style="width: 50%"
            />
          </el-form-item>

          <el-form-item label="操作密钥">
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
      <el-table ref="table" v-loading="crud.loading" :header-cell-style="{background:'#eef1f6',color:'#606266'}" border :data="crud.data" size="small" style="width: 100%;">
        <el-table-column
          v-permission="['admin', 'cusQuestionList:edit']"
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
        <el-table-column prop="id" align="center" label="序号" width="60px" />
        <el-table-column prop="gameName" align="center" label="gameName" width="120px" />
        <el-table-column prop="gameCode" align="center" label="gameCode" width="120px" />
        <el-table-column prop="packageName" align="center" label="packageName" width="160px" />
        <el-table-column prop="currency" align="center" label="currency" />
        <el-table-column prop="stag" align="center" label="stag" width="120px" />
        <el-table-column prop="stime" align="center" label="stime" width="160px" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import { GetAllowCurrencyPayIOS, toSetPay } from '@/api/lpitmgr/detectPay/getAllowCurrencyPayIOS'
import { parseTime } from '@/utils/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  id: null,
  gamecode: null,
  servercode: null,
  roleid: null,
  passport: null,
  packagename: null,
  content: null,
  imageArray: null,
  qusType: null,
  type: null,
  language: null,
  os: null,
  deviceInformation: null,
  deviceVersion: null,
  createtime: null,
  ipaddress: null,
  country: null,
  ansStatus: null,
  delStatus: null
}
export default {
  name: 'GetAllowCurrencyPayIOS',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  cruds() {
    return CRUD({
      title: 'ios品项配置',
      url: '/api/detectPay/getAllowCurrencyPayIOS',
      sort: 'id,desc',
      crudMethod: { ...GetAllowCurrencyPayIOS }
    })
  },
  data() {
    return {
      isShow: false,
      isShowDelg: false,
      isPlayVideo: false,
      isShowOtherType: true,
      checkedSel: false,
      inputContent: '',
      timer: null,
      getMsg: '',
      getDefualDate: null,
      getLastDate: null,
      isSendMsg: true,
      activeIndex: '1',
      defaultTime: [],
      valuenum: null,
      scopeData: {
        currency: null,
        gameCode: null,
        gameName: null,
        packageName: null,
        recordID: null
      },
      permission: {
        add: ['admin', 'cusQuestionList:add'],
        edit: ['admin', 'cusQuestionList:edit'],
        del: ['admin', 'cusQuestionList:del']
      },
      rules: {
        ansStatus: [
          { required: true, message: '回复状态不能为空', trigger: 'blur' }
        ],
        delStatus: [
          { required: true, message: '是否删除状态不能为空', trigger: 'blur' }
        ]
      },
      gameItemList: [],
      oContent: {},
      msgs: [],
      serviceValue: '',
      curdHook: '',
      degioName: ''
    }
  },
  created: function() {
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },

    changeStatus(data) {
      this.isShowDelg = !this.isShowDelg
    },
    selectGameCode(data) {
      this.scopeData.game_code = data
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
      this.scopeData = data
      this.curdHook = 'edit'
    },

    getServiceValue() {
      switch (this.curdHook) {
        case 'add':
          this.scopeData.stime = parseTime(new Date())
          console.log(this.scopeData)
          toSetPay(this.scopeData).then((res) => {
            console.log(res)
            if (res.content[0].code === '003') {
              this.$notify({
                message: res.content[0].rst.msg,
                type: 'warning'
              })
            } else {
              this.$notify({
                message: '新增成功',
                type: 'warning'
              })
            }
          })
          break
        case 'edit':
          // this.scopeData.edittime = parseTime(new Date())
          toSetPay(this.scopeData).then((res) => {
            console.log(res)
            if (res.content[0].code === '003') {
              this.$notify({
                message: res.content[0].rst.msg,
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
    },
    changeDelete(data) {
      console.log(data)
    },
    chnageRoides() {
      console.log('cuihua')
    },
    getInputNum(value) {
      this.valuenum = value.length
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.open {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #dfe6ec;
  &:last-child {
    border-bottom: none;
  }
}
.poasin{
  position: absolute;
}
::v-deep .crud-opts-left {
  display: none;
}
// .crud-opts {
//   // display: none;
// }
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
    height: 53%;
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
      border-bottom: 1px solid #ccc;
    }
  }
}
</style>
