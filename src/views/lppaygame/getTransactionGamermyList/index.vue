<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <div class="select_tool">
          <!-- 搜索 -->
          <el-select
            v-model="query.gamecode"
            clearable
            size="small"
            placeholder="全部游戏查询"
            class="filter-item"
            style="width: 130px"
          >
            <el-option
              v-for="item in gameItemList"
              :key="item.key"
              :label="item.gamename +'(' + item.gamecode+')'"
              :value="item.gamecode"
            />
          </el-select>
          <el-input
            v-model="query.passport"
            clearable
            placeholder="lp平台用户ID"
            style="width: 150px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-input
            v-model="query.gamermyUserId"
            clearable
            placeholder="联运商用户ID"
            style="width: 150px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-input
            v-model="query.lunplayOrderId"
            clearable
            placeholder="lp订单号"
            style="width: 170px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-input
            v-model="query.gamermyOrderId"
            clearable
            placeholder="联运商订单号"
            style="width: 175px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-select
            v-model="query.sitecode"
            clearable
            size="small"
            placeholder="联运商代码"
            class="filter-item"
            style="width: 120px"
          >
            <el-option
              v-for="item in sitecodeList"
              :key="item.key"
              :label="item.type"
              :value="item.id"
            />
          </el-select>
          <el-select
            v-model="query.status"
            clearable
            size="small"
            placeholder="订单状态"
            class="filter-item"
            style="width: 100px"
          >
            <el-option
              v-for="item in statusList"
              :key="item.key"
              :label="item.type"
              :value="item.id"
            />
          </el-select>
          <van-calendar v-model="isVisible" :min-date="minDate" :max-date="maxDate" type="range" @confirm="onConfirm" />
          <template v-if="!isShowTime">
            <div class="changDate">
              <input
                v-model="startrtime"
                clearable
                placeholder="开始时间"
                class="filter-item inp_enll"
                @click="hovePick"
                @focus="hiddenCode"
              >
              <span>:</span>
              <input
                v-model="endrtime"
                clearable
                placeholder="结束时间"
                class="filter-item"
                @click="hovePick"
                @focus="hiddenCode"
              >
              <i v-if="isHidd" class="el-icon-circle-close closeInp" @click="delInp" />
            </div>
          </template>
          <el-date-picker
            v-if="isShowTime"
            v-model="query.stime"
            :default-time="['00:00:00', '23:59:59']"
            type="daterange"
            range-separator=":"
            size="small"
            class="date-item"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </div>
        <rrOperation />
        <el-button
          v-if="crud.optShow.download"
          :loading="crud.downloadLoading"
          :disabled="!checkPer(['admin','transactionGamermy:download'])"
          class="filter-item postio"
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
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        :data="crud.data"
        size="small"
        style="width: 100%"
        border
        @selection-change="crud.selectionChangeHandler"
      >

        <el-table-column
          align="center"
          prop="index"
          label="序号"
          width="85px"
        />
        <el-table-column
          align="center"
          prop="status"
          label="状态"
          width="85px"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.status === 1">{{ "步驟1" }}</div>
            <div v-if="scope.row.status === 2">{{ "成功" }}</div>
            <div v-if="scope.row.status === 3">{{ "需要补点" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="passport"
          label="用户id"
          width="200px"
        />
        <el-table-column
          align="center"
          prop="lunplayOrderId"
          label="lp订单号"
          width="220px"
        />
        <el-table-column
          align="center"
          prop="gamermyOrderId"
          label="联运商订单号"
          width="220px"
        />
        <el-table-column
          align="center"
          prop="gamermyUserId"
          label="联运商用户ID"
          width="220px"
        />
        <el-table-column
          align="center"
          prop="gamecode"
          label="游戏代码"
          width="100px"
        />
        <el-table-column
          align="center"
          prop="servercode"
          label="游戏服代码"
          width="100px"
        />
        <el-table-column
          align="center"
          prop="amount"
          label="金额"
        />
        <el-table-column
          align="center"
          prop="disabled"
          label="是不展示"
          width="80px"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.disabled === 0">{{ "否" }}</div>
            <div v-if="scope.row.disabled === 1">{{ "是" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="stime"
          label="储值时间"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="userip"
          label="ip"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="username"
          label="用户名"
          width="110px"
        />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import { GetGamePointPaygameList } from '@/api/lppaygame/getTransactionGamermyList'
import { getAllGameCode } from '@/api/lpgame/getGameServerList'
import { download } from '@/api/data'
import { downloadFile, parseTimes, parseTime } from '@/utils/index'
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
  name: 'GetGamePointPaygameList',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '联运商储值流水',
      url: '/api/lpTransactionGamermy/getTransactionGamermyList',
      sort: 'id,desc',
      crudMethod: { ...GetGamePointPaygameList }
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
        id: null,
        status: null,
        passport: null,
        username: null,
        lunplay_orderID: null,
        money: null,
        productID: null,
        serverCode: null,
        payGame_lpoint: null,
        time: null,
        packageName: null,
        siteCode: null,
        ipAddress: null,
        country: null,
        pay_tag: null,
        Lpoint: null,
        gameCode: null,
        transactionID: null,
        roleid: null
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
      statusList: [
        { id: 1, type: '步骤1' },
        { id: 2, type: '成功' },
        { id: 3, type: '需要补点' }
      ],
      sitecodeList: [
        { id: 'memoriki', type: 'memoriki' },
        { id: 'pubgamemb', type: 'pubgamemb' }
      ],
      gameOptions: [
        '成功', '步骤1', '补点成功', '退还L点', '取消订单', '测试'
      ],
      tagDL: [
        { label: '正式账单', value: '1' },
        { label: '内部测试账单', value: '2' }
      ],
      gameAdList: [
        { label: 'IOS官方储值', value: 'ios' },
        { label: 'Android官方储值', value: 'android' }
      ],
      gameItemList: [],
      getSelVal: '',
      flag: null,
      isShowTime: true,
      isVisible: false,
      isHidd: false,
      startrtime: '',
      endrtime: '',
      minDate: new Date(2012, 1, 1),
      maxDate: new Date(2030, 1, 31)
    }
  },
  created: function() {
    this.getAllGame()
    if (this.isMobile()) {
      this.isShowTime = false
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    getAllGame() {
      getAllGameCode().then(res => {
        this.gameItemList = res
      })
    },

    selectData(data) {
      console.log(data)
      this.query.gamecode = data
    },
    exportExels() {
      var params = this.crud.getQueryParams()
      if (this.query.stime) {
        params.stime = this.query.stime
        download('/api/lpTransactionGamermy/download', params)
          .then((result) => {
            downloadFile(result, '列表数据', 'xlsx')
            this.crud.downloadLoading = false
          })
          .catch(() => {
            this.crud.downloadLoading = false
          })
      } else {
        this.$notify({
          message: '请选择时间',
          type: 'warning'
        })
      }
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
      this.query.stime = [parseTime(date[0]), parseTime(date[1])]
      this.isVisible = !this.isVisible
    },
    delInp() {
      this.startrtime = ''
      this.endrtime = ''
      this.isHidd = !this.isHidd
    },
    isMobile() {
      const flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag
    },
    hiddenCode() {
      document.activeElement.blur()
    }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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

.postio{
    position: absolute;
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
