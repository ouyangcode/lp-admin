<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.gamecode"
          clearable
          placeholder="gamecode"
          style="width: 150px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-input
          v-model="query.passport"
          clearable
          placeholder="passport"
          style="width: 150px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-input
          v-model="query.lunplayOrderId"
          clearable
          placeholder="lunplay订单号"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-input
          v-model="query.transactionid"
          clearable
          placeholder="paypal订单号"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-input
          v-model="query.email"
          clearable
          placeholder="用户邮箱"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-select
          v-model="query.state"
          clearable
          size="small"
          placeholder="状态"
          class="filter-item"
          style="width: 130px"
        >
          <el-option
            v-for="item in statusLists"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-model="defaultSetTime"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @input="changeTime"
        />
        <rrOperation :item-class="isVisible" />
        <el-button v-if="crud.optShow.reset" class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="clearQueryData">重置</el-button>
        <el-button
          v-if="crud.optShow.download"
          :loading="crud.downloadLoading"
          :disabled="!checkPer(['admin','transactionPaypal:download'])"
          class="filter-item"
          size="mini"
          type="warning"
          icon="el-icon-download"
          @click="exportExels()"
        >导出</el-button>
      </div>

      <crudOperation :permission="permission" />
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        :data="crud.data"
        size="small"
        style="width: 100%"
        border
      >
        <el-table-column
          align="center"
          prop="index"
          label="序号"
          width="85px"
        />
        <el-table-column
          show-overflow-tooltip
          align="center"
          prop="state"
          label="状态"
          width="120px"
        >
          <template slot-scope="scope">
            {{ statusList[scope.row.state] }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="passport"
          label="用户id"
          width="180px"
        />
        <el-table-column
          align="center"
          prop="username"
          label="用户名"
          width="180px"
        />
        <el-table-column
          align="center"
          prop="lunplayOrderId"
          label="平台订单号"
          width="200px"
        />
        <el-table-column
          align="center"
          prop="transactionid"
          label="PayPal订单号"
          width="200px"
        />
        <el-table-column
          align="center"
          prop="money"
          label="金额"
          width="100px"
        />
        <el-table-column
          align="center"
          prop="time"
          label="储值时间"
          width="180px"
        />
        <el-table-column
          align="center"
          prop="gamecode"
          label="游戏"
          width="110px"
        />
        <el-table-column
          align="center"
          prop="servercode"
          label="游戏服"
          width="120px"
        />
        <el-table-column
          align="center"
          prop="point"
          label="点数"
          width="120px"
        />
        <el-table-column
          align="center"
          prop="number"
          label="储值张数"
          width="100px"
        />
        <el-table-column
          align="center"
          prop="paygameLpoint"
          label="储值进游戏点数"
          width="120px"
        />
        <el-table-column
          align="center"
          prop="effamt"
          label="PayPal手续费"
          width="130px"
        />
        <el-table-column
          align="center"
          prop="amt"
          label="实际到账金额"
          width="130px"
        />
        <el-table-column
          align="center"
          prop="sitecode"
          label="渠道代码"
          width="130px"
        />
        <el-table-column
          align="center"
          prop="paytype"
          label="储值渠道"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="tele"
          label="手机号码"
          width="130px"
        />
        <el-table-column
          align="center"
          prop="email"
          label="用户填写邮箱"
          width="160px"
        />
        <el-table-column
          v-if="isShow"
          align="center"
          prop="businessemail"
          label="企业邮箱"
          width="160px"
        />
        <el-table-column
          align="center"
          prop="currencycode"
          label="储值币种"
          width="130px"
        />
        <el-table-column
          align="center"
          prop="disabled"
          label="是否显示"
          width="110px"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.disabled === 0">{{ "否" }}</div>
            <div v-if="scope.row.disabled === 1">{{ "是" }}</div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import { transaction } from '@/api/lptransaction/transactionPaypal'
import { download } from '@/api/data'
import { downloadFile, parseTimes, setDefaultStratime, setDefaultEndtime } from '@/utils/index'
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
  name: 'CusQuestionList',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: ' paypal 储值流水',
      url: '/api/transactionPaypal',
      sort: 'id,desc',
      crudMethod: { ...transaction }
    })
  },
  data() {
    return {
      isShow: false,
      isVisible: true,
      isVisibles: false,
      isHidd: false,
      permission: {
        add: ['admin', 'getTransactionList:add'],
        edit: ['admin', 'getTransactionList:edit'],
        del: ['admin', 'getTransactionList:del']
      },
      rules: {
        ansStatus: [
          { required: true, message: '回复状态不能为空', trigger: 'blur' }
        ],
        delStatus: [
          { required: true, message: '是否删除状态不能为空', trigger: 'blur' }
        ]
      },
      statusList: ['', '步骤1', '步骤2', '成功', '首次使用PayPal储值,需要客服验证,需要补点', '储值失败,补单状态,需要补点'],
      statusLists: [
        { label: '步骤1', value: 1 },
        { label: '步骤2', value: 2 },
        { label: '成功', value: 3 },
        { label: '首次使用PayPal储值,需要客服验证,需要补点', value: 4 },
        { label: '储值失败,补单状态,需要补点', value: 5 }
      ],
      oContent: {},
      msgs: [],
      serviceValue: '',
      startrtime: '',
      endrtime: '',
      flag: null,
      isShowTime: true,
      show: false,
      data: [],
      defaultSetTime: [],
      defaultGetTime: [],
      minDate: new Date(2012, 1, 1),
      maxDate: new Date(2030, 1, 31),
      defaultStart: new Date(),
      defaultEnd: new Date()
    }
  },
  created: function() {
    if (this.isMobile()) {
      this.isShowTime = false
    }
    this.setDefaultTime()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    hovePick() {
      this.isVisible = !this.isVisible
    },
    onConfirm(date) {
      const [start, end] = [parseTimes(date[0]), parseTimes(date[1])]
      console.log([start, end])
      this.isHidd = !this.isHidd
      this.startrtime = start
      this.endrtime = end
      this.query.ctrime = [start, end]
      this.isVisible = !this.isVisible
    },
    delInp() {
      this.startrtime = ''
      this.endrtime = ''
      this.isHidd = !this.isHidd
    },
    isMobile() {
      const flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
      return flag
    },
    hiddenCode() {
      document.activeElement.blur()
    },
    setDefaultTime() {
      this.defaultStart = setDefaultStratime(new Date(this.defaultStart.setTime(this.defaultStart.getTime() - 3600 * 1000 * 24 * 7)))
      this.defaultEnd = setDefaultEndtime(this.defaultEnd)
      this.defaultSetTime = [this.defaultStart, this.defaultEnd]
      this.defaultGetTime = [this.defaultStart, this.defaultEnd]
    },
    changeTime(data) {
      this.query.time = data
    },
    clearQueryData(toQuery = true) {
      const defaultQuery = JSON.parse(JSON.stringify(this.crud.defaultQuery))
      const query = this.crud.query
      Object.keys(query).forEach(key => {
        query[key] = defaultQuery[key]
      })
      // 重置参数
      this.params = {}
      if (toQuery) {
        this.crud.toQuery()
      }

      this.query.time = this.defaultGetTime
      this.defaultSetTime = this.defaultGetTime
      this.crud.refresh()
    },
    exportExels() {
      var params = this.crud.getQueryParams()
      params.gameCode = this.getSelectData
      this.crud.downloadLoading = true
      download('/api/transactionPaypal/download', params).then(result => {
        downloadFile(result, this.crud.title + '数据', 'xlsx')
        this.crud.downloadLoading = false
      }).catch(() => {
        this.crud.downloadLoading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
// .crud-opts {
//   // display: none;
// }

.changDate {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 10px;
  height: 30.5px !important;
  width: 230px !important;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  border-radius: 4px;
  padding: 0 15px;
  box-sizing: border-box;
  span {
    margin: 0 10px;
  }
  input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    outline: none;
    display: inline-block;
    height: 100%;
    margin: 0;
    padding: 0;
    width: 39%;
    text-align: center;
    font-size: 14px;
    color: #606266;
  }
  .closeInp {
    position: absolute;
    top: 0.5rem;
    right: 0.35rem;
    font-size: 14px;
  }
}
::v-deep .crud-opts-left {
  display: none;
}
::v-deep .cell {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

::v-deep .el-dialog {
  margin-top: 5vh;
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
.userinfo {
  width: 100%;
  height: 150px;
  display: flex;
  .userinfo-left {
    flex: 1;
  }
  .userinfo-center {
    flex: 1;
  }
  .userinfo-right {
    flex: 1;
  }
  .userinfo-top {
    flex: 1;
  }
}
.showMsg {
  position: absolute;
  top: 22px;
  left: 110px;
  font-size: 18px;
  color: red;
  font-weight: 600;
}
.el-dialog__body {
  padding: 0px 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}
.sockTip {
  width: 100%;
  height: 300px;
  .chartContent {
    width: 100%;
    height: 250px;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.1);
    overflow: auto;
    .content {
      width: 100%;
      border-radius: 5px;
      .left-content {
        padding: 10px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .msg-date {
          text-align: center;
          color: gray;
          font-size: 16px;
          padding-left: 16px;
        }
        .usercontent {
          float: left;
          word-wrap: break-word;
          word-break: break-all;
          margin-left: 10px;
          margin-top: 5px;
          background-color: #fff;
          width: 75%;
          padding: 6px 10px;
          border-radius: 10px;
          font-size: 16px;
        }
        .left-start {
          padding-left: 17px;
        }
      }
      .right-content {
        padding: 10px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .msg-date {
          text-align: center;
          color: gray;
          font-size: 16px;
          padding-right: 18px;
        }
        .servicecontent {
          word-wrap: break-word;
          word-break: break-all;
          margin-right: 10px;
          margin-top: 5px;
          color: #fff;
          background-color: green;
          width: 75%;
          padding: 6px 10px;
          border-radius: 10px;
          font-size: 16px;
          font-family: "Courier New", Courier, monospace;
        }
        .right-start {
          padding-right: 20px;
        }
      }
    }
  }
}
.chatting-input {
  display: flex;
  height: 40px;
  width: 100%;
  margin-top: 12px;
  .el-input {
    flex: 1;
    padding-left: 10px;
    // padding-top: 10px;
    height: 100%;
    font-size: 18px;
  }
  button {
    width: 90px;
    height: 33px;
    line-height: 8px;
    background-color: #2196f3;
    color: #fff;
    font-size: 18px;
  }
}
.serviceDel {
  position: absolute;
  top: 25px;
  right: 23px;
}
</style>
