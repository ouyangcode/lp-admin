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
        <el-input
          v-model="query.serialNumber"
          clearable
          placeholder="mol订单号"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
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

        <rrOperation />
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
          prop="orderId"
          label="mol订单号"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="orderId"
          label="储值金额种类"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="orderId"
          label="储值L点种类"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="orderId"
          label="储值张数"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="orderId"
          label="总金额"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="orderId"
          label="总L点"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="orderId"
          label="储值进游戏L点"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="registerdate"
          label="储值时间"
          width="140px"
        />
        <el-table-column
          align="center"
          prop="registerdate"
          label="MOLUsername"
          width="140px"
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
          prop="sitecode"
          label="sitecode"
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
          prop="paytag"
          label="paytag"
          width="120px"
        />
        <el-table-column
          align="center"
          prop="userIp"
          label="payGame_lpoint"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="userIp"
          label="userIP"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="tele"
          label="tele"
        />
        <el-table-column
          align="center"
          prop="email"
          label="email"
        />

      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import {
  transaction
} from '@/api/lppaygame/getTransactionList'
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
      isShowDelg: false,
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
      gameOptions: ['减L点', '加L点', '加完即减L点', '退点,游戏点数退还成L点', '退款,L点退还成现金', '直充游戏点数', '转点', '为玩家补游戏币'],
      serviceValue: '',
      statusList: [
        { id: 0, type: '成功' },
        { id: 1, type: '步骤1' },
        { id: 2, type: '补点成功' },
        { id: 3, type: '退还L点' },
        { id: 4, type: '取消订单' },
        { id: 5, type: '测试' },
        { id: 10, type: '需要补点' }
      ]
    }
  },
  created: function() {

  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
