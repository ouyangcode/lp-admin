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
            v-if="isShow"
            v-model="query.tagDL"
            clearable
            size="small"
            placeholder="账单查询"
            class="filter-item"
            style="width: 120px"
          >
            <el-option
              v-for="item in tagDL"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
            v-model="query.gamecode"
            clearable
            placeholder="游戏代码"
            style="width: 100px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-input
            v-model="query.servercode"
            clearable
            placeholder="游戏服"
            style="width: 100px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-input
            v-model="query.passport"
            clearable
            placeholder="passport"
            style="width: 180px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-input
            v-model="query.orderId"
            clearable
            placeholder="订单号"
            style="width: 220px"
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
          <el-input
            v-model="query.roleid"
            clearable
            placeholder="roleid"
            style="width: 120px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <van-calendar v-model="isVisible" type="range" @confirm="onConfirm" />
          <template v-if="!isShowTime">
            <div class="changDate">
              <input
                v-model="startrtime"
                clearable
                placeholder="开始时间"
                class="filter-item inp_enll"
                @click="hovePick"
              >
              <span>:</span>
              <input
                v-model="endrtime"
                clearable
                placeholder="结束时间"
                class="filter-item"
              >
              <i v-if="isHidd" class="el-icon-circle-close closeInp" @click="delInp" />
            </div>
          </template>
          <el-date-picker
            v-if="isShowTime"
            v-model="query.crtime"
            :default-time="['00:00:00', '23:59:59']"
            type="daterange"
            range-separator=":"
            size="small"
            class="date-item"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />

          <el-select
            v-model="query.status"
            clearable
            size="small"
            placeholder="状态"
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
          <el-select
            v-model="query.param"
            clearable
            size="small"
            placeholder="储值查询"
            class="filter-item"
            style="width: 100px"
          >
            <el-option
              v-for="item in gameAdList"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <rrOperation />
        <el-button
          v-if="crud.optShow.download"
          :loading="crud.downloadLoading"
          :disabled="!crud.data.length"
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

        <el-table-column align="center" prop="gmid" label="序号" width="65px" />
        <el-table-column
          align="center"
          prop="status"
          label="状态"
          width="85px"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.status === '10'">
              {{ '需要补点' }}
            </div>
            <div v-if="scope.row.status !== '10'">
              {{ gameOptions[scope.row.status] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="roleid"
          label="用户id"
          width="200px"
        />
        <el-table-column
          align="center"
          prop="orderId"
          label="lp订单号"
          width="150px"
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
          prop="lpoint"
          label="储值L点"
          width="80px"
        />
        <el-table-column
          align="center"
          prop="gamepiont"
          label="储值游戏币"
          width="100px"
        />
        <el-table-column
          align="center"
          prop="packageName"
          label="游戏包"
          width="120px"
        />
        <el-table-column
          align="center"
          prop="userIp"
          label="ip"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="userArea"
          label="用户国家"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="param"
          label="param"
        />
        <el-table-column
          align="center"
          prop="param1"
          label="param1"
        />
        <el-table-column
          align="center"
          prop="registerdate"
          label="储值时间"
          width="140px"
        />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import { GetGamePointPaygameList } from '@/api/lppaygame/getGamePointPaygameList'
import { getAllGameCode } from '@/api/lpgame/getGameServerList'
import { download } from '@/api/data'
import { downloadFile, parseTimes } from '@/utils/index'
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
      title: '用户兑换流水',
      url: '/api/lpGamePointPaygame/getGamePointPaygameList',
      sort: 'gmid',
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
        { id: 0, type: '成功' },
        { id: 1, type: '步骤1' },
        { id: 2, type: '补点成功' },
        { id: 3, type: '退还L点' },
        { id: 4, type: '取消订单' },
        { id: 5, type: '测试' },
        { id: 10, type: '需要补点' }
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
      endrtime: ''
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
      if (this.query.crtime) {
        params.crtime = this.query.crtime
        download('/api/lpGamePointPaygame/download', params)
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
      this.query.ctrime = [start, end]
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
