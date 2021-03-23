<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.passport"
          clearable
          placeholder="passport"
          style="width: 150px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-input
          v-model="query.serialNumber"
          clearable
          placeholder="lunplay订单号"
          style="width: 200px"
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
      </div>
      <rrOperation />
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
        <el-table-column align="center" prop="tid" label="序号" width="65px" />
        <el-table-column
          align="center"
          prop="channel"
          label="交易渠道"
          width="85px"
        />
        <el-table-column
          align="center"
          prop="passport"
          label="用户id"
          width="200px"
        />
        <el-table-column
          align="center"
          prop="serialNumber"
          label="订单号"
          width="200px"
        />
        <el-table-column
          align="center"
          prop="tradePoint"
          label="交易点数"
          width="100px"
        />
        <el-table-column
          align="center"
          prop="pointPreTrade"
          label="交易前点数"
          width="100px"
        />
        <el-table-column
          align="center"
          prop="pointAfterTrade"
          label="交易后点数"
          width="100px"
        />
        <el-table-column
          align="center"
          prop="cost"
          label="交易的金额"
          width="100px"
        />
        <el-table-column align="center" prop="type" label="状态" width="180px">
          <template slot-scope="scope">
            <div v-if="scope.row.type === 0">{{ "平台用户兑换" }}</div>
            <div v-if="scope.row.type === 1">{{ "平台用户充值" }}</div>
            <div v-if="scope.row.type === 2">{{ "FB用户充值直接进游戏" }}</div>
            <div v-if="scope.row.type === 5">{{ "合作商充值直接进游戏" }}</div>
            <div v-if="scope.row.type === 6">
              {{ "转点,回馈点数或者储值错账号" }}
            </div>
            <div v-if="scope.row.type === 7">{{ "补点" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="交易类型"
          width="200px"
        >
          <template slot-scope="scope">
            {{ gameOptions[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="content"
          label="交易说明"
          width="200px"
        />
        <el-table-column align="center" prop="ip" label="ip" width="130px" />
        <el-table-column
          align="center"
          prop="tradeTime"
          label="交易时间"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
          width="150px"
        />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import { transaction } from '@/api/lppaygame/getTransactionList'
import { parseTimes } from '@/utils/index'
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
      title: '交易流水列表',
      url: '/api/lpTransaction/getTransactionList',
      sort: 'tid',
      crudMethod: { ...transaction }
    })
  },
  data() {
    return {
      isShow: false,
      isVisible: false,
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
      gameOptions: [
        '减L点',
        '加L点',
        '加完即减L点',
        '退点,游戏点数退还成L点',
        '退款,L点退还成现金',
        '直充游戏点数',
        '转点',
        '为玩家补游戏币'
      ],
      oContent: {},
      msgs: [],
      serviceValue: '',
      startrtime: '',
      endrtime: '',
      flag: null,
      isShowTime: true,
      show: false,
      data: []
    }
  },
  created: function() {
    if (this.isMobile()) {
      this.isShowTime = false
    }
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
