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
              :label="item.gamename + '(' + item.gamecode + ')'"
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
            style="width: 170px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-input
            v-model="query.packageName"
            clearable
            placeholder="包名"
            style="width: 175px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-input
            v-model="query.orderId"
            clearable
            placeholder="订单号"
            style="width: 180px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-input
            v-model="query.roleid"
            clearable
            placeholder="roleid"
            style="width: 110px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <van-calendar
            v-model="isVisible"
            :min-date="minDate"
            :max-date="maxDate"
            type="range"
            @confirm="onConfirm"
          />
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
              <i
                v-if="isHidd"
                class="el-icon-circle-close closeInp"
                @click="delInp"
              />
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
          :disabled="!checkPer(['admin', 'gamePointPaygame:download'])"
          class="filter-item postio"
          size="mini"
          type="warning"
          icon="el-icon-download"
          @click="exportExels()"
        >导出</el-button>
      </div>

      <crudOperation :permission="permission" />
      <el-dialog
        :visible.sync="isShowDelg"
        width="550px"
        top="10vh"
        height="45%"
        :title="delogTitle"
        :before-close="beforClose"
      >
        <el-form
          ref="form"
          :model="scopeData"
          :rules="rules"
          size="small"
          label-width="130px"
        >
          <el-form-item label="LP订单号">
            <el-input v-model="scopeData.orderId" style="width: 80%" />
          </el-form-item>
          <el-form-item v-if="ishidd" label="用户id">
            <el-input v-model="scopeData.passport" style="width: 80%" />
          </el-form-item>
          <el-form-item v-if="isforStatu" label="游戏服代码">
            <el-input v-if="ishidd" v-model="scopeData.servercode" style="width: 80%" />
            <el-select
              v-if="isShowSev"
              v-model="scopeData.servercode"
              clearable
              size="small"
              placeholder="状态"
              class="filter-item"
              style="width: 100px"
            >
              <el-option
                v-for="item in serverCodeList"
                :key="item.key"
                :label="item.servername"
                :value="item.servercode"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="ishidd" label="param">
            <el-input v-model="scopeData.param" style="width: 80%" />
          </el-form-item>
          <el-form-item v-if="ishidd" label="roleid">
            <el-input v-model="scopeData.roleid" style="width: 80%" />
          </el-form-item>
          <el-form-item v-if="ishidd" label="itemCode">
            <el-input v-model="scopeData.itemcode" style="width: 80%" />
          </el-form-item>
          <el-form-item v-if="isShowStatu" label="状态">
            <el-select
              v-model="scopeData.status"
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
          </el-form-item>
          <el-form-item label="操作密钥">
            <el-input v-model="scopeData.vercodeKey" style="width: 80%" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="closeTip">取消</el-button>
          <el-button
            :loading="crud.status.cu === 2"
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
        <el-table-column align="center" prop="status" label="状态" width="85px">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 10">
              {{ "需要补点" }}
            </div>
            <div v-if="scope.row.status !== 10">
              {{ gameOptions[scope.row.status] }}
            </div>
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
          prop="orderId"
          label="lp订单号"
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
        <el-table-column align="center" prop="param1" label="金额(USD)" />
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
        <el-table-column align="center" prop="param" label="param" />
        <el-table-column
          align="center"
          prop="crtime"
          label="储值时间"
          width="140px"
        />
        <el-table-column
          align="center"
          prop="roleid"
          label="roleid"
          width="110px"
        />
        <el-table-column
          align="center"
          prop="itemcode"
          label="itemcode"
          width="110px"
        />
        <el-table-column
          align="center"
          prop="registerdate"
          label="registerdate"
          width="140px"
        />
        <el-table-column fixed="right" align="center" label="操作" width="90px">
          <template slot-scope="scope">
            <div>
              <el-popover
                placement="bottom-end"
                popper-class="chProo"
                trigger="click"
              >
                <el-button slot="reference" size="mini" icon="el-icon-setting">
                  <i class="fa fa-caret-down" aria-hidden="true" />
                </el-button>
                <div class="dise">
                  <div class="edit">
                    <el-button
                      size="mini"
                      :disabled="!checkPer(['admin', 'gamePointPaygame:addPoint'])"
                      type="primary"
                      icon="el-icon-edit"
                      @click="addPointGamePointPaygame(scope.row)"
                    >兑换补点</el-button>
                  </div>
                  <div class="edit">
                    <el-button
                      size="mini"
                      :disabled="
                        !checkPer(['admin', 'gamePointPaygame:editGameServerCode'])
                      "
                      type="success"
                      icon="el-icon-magic-stick"
                      @click="editGameServerCode(scope.row)"
                    >更新服代码</el-button>
                  </div>
                  <div class="edit">
                    <el-button
                      size="mini"
                      :disabled="
                        !checkPer(['admin', 'gamePointPaygame:editStatus'])
                      "
                      type="warning"
                      icon="el-icon-refresh"
                      @click="editStatusGamePointPaygame(scope.row)"
                    >更新订单状态</el-button>
                  </div>
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import {
  GetGamePointPaygameList,
  addPointGamePointPaygame,
  editGameServerCode,
  editStatusGamePointPaygame,
  getAllServerCode
} from '@/api/lppaygame/getGamePointPaygameList'
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
      sort: 'gmid,desc',
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
        delStatus: null,
        status: null
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
      gameOptions: ['成功', '步骤1', '补点成功', '退还L点', '取消订单', '测试'],
      tagDL: [
        { label: '正式账单', value: '1' },
        { label: '内部测试账单', value: '2' }
      ],
      gameAdList: [
        { label: 'IOS官方储值', value: 'ios' },
        { label: 'Android官方储值', value: 'android' }
      ],
      gameItemList: [],
      serverCodeList: [],
      getSelVal: '',
      flag: null,
      isShowTime: true,
      isVisible: false,
      isHidd: false,
      startrtime: '',
      endrtime: '',
      minDate: new Date(2012, 1, 1),
      maxDate: new Date(2030, 1, 31),
      isShowSev: false,
      isShowStatu: false,
      ishidd: false,
      isforStatu: true,
      curdHook: '',
      delogTitle: ''
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
          .then(result => {
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
      const flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
      return flag
    },
    hiddenCode() {
      document.activeElement.blur()
    },
    addPointGamePointPaygame(data) {
      this.scopeData = JSON.parse(JSON.stringify(data))
      if (this.scopeData.status === 10) {
        this.isShowDelg = !this.isShowDelg
        this.ishidd = true
        this.curdHook = 'addPointGamePointPaygame'
        this.delogTitle = '兑换补点'
      } else {
        this.$message({
          message: '不能操作',
          type: 'warning'
        })
      }
    },
    editGameServerCode(data) {
      this.scopeData = JSON.parse(JSON.stringify(data))
      if (this.scopeData.status !== 0) {
        getAllServerCode(this.scopeData.gamecode).then(res => {
          console.log(res)
          this.serverCodeList = res
        })
        this.scopeData.servercode = null
        this.isShowDelg = !this.isShowDelg
        this.isShowSev = true
        this.curdHook = 'editGameServerCode'
        this.delogTitle = '更新服代码'
      } else {
        this.$message({
          message: '不能操作',
          type: 'warning'
        })
      }
    },
    editStatusGamePointPaygame(data) {
      this.isShowDelg = !this.isShowDelg
      this.isShowStatu = true
      this.isforStatu = false
      this.curdHook = 'editStatusGamePointPaygame'
      this.delogTitle = '更新订单状态'
      this.scopeData = JSON.parse(JSON.stringify(data))
      this.scopeData.status = null
    },
    closeTip() {
      this.isShowDelg = !this.isShowDelg
      this.scopeData = JSON.parse(JSON.stringify(this.scopeData))
      for (var key in this.scopeData) {
        this.scopeData[key] = null
      }
      if (this.isShowSev || this.isShowStatu || this.ishidd) {
        this.isShowSev = false
        this.isShowStatu = false
        this.ishidd = false
        this.isforStatu = true
      }
    },
    beforClose() {
      this.isShowDelg = !this.isShowDelg
      this.scopeData = JSON.parse(JSON.stringify(this.scopeData))
      for (var key in this.scopeData) {
        this.scopeData[key] = null
      }
      if (this.isShowSev || this.isShowStatu || this.ishidd) {
        this.isShowSev = false
        this.isShowStatu = false
        this.ishidd = false
        this.isforStatu = true
      }
    },
    getServiceValue() {
      switch (this.curdHook) {
        case 'addPointGamePointPaygame':
          addPointGamePointPaygame(this.scopeData).then(res => {
            this.scopeData = JSON.parse(JSON.stringify(this.scopeData))
            for (var key in this.scopeData) {
              this.scopeData[key] = null
            }
            this.isShowDelg = !this.isShowDelg
            if (this.ishidd || this.isShowSev) {
              this.ishidd = false
              this.isShowSev = false
            }
            this.crud.notify(res.msg, CRUD.NOTIFICATION_TYPE.SUCCESS)
            this.crud.refresh()
          })
          break
        case 'editGameServerCode':
          if (this.scopeData.orderId && this.scopeData.vercodeKey && this.scopeData.servercode) {
            editGameServerCode(this.scopeData).then(res => {
              this.crud.notify(res.msg, CRUD.NOTIFICATION_TYPE.SUCCESS)
              this.crud.refresh()
              this.scopeData = JSON.parse(JSON.stringify(this.scopeData))
              for (var key in this.scopeData) {
                this.scopeData[key] = null
              }
              if (this.isShowSev) {
                this.isShowSev = false
              }
              this.isShowDelg = !this.isShowDelg
            })
          } else {
            this.$message({
              message: '请填入必填参数',
              type: 'warning'
            })
          }
          break
        case 'editStatusGamePointPaygame':
          if (this.scopeData.orderId && this.scopeData.vercodeKey) {
            editStatusGamePointPaygame(
              this.scopeData
            ).then((res) => {
              this.crud.notify('设置成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
              this.scopeData = JSON.parse(JSON.stringify(this.scopeData))
              for (var key in this.scopeData) {
                this.scopeData[key] = null
              }
              this.crud.refresh()
              if (this.isShowStatu) {
                this.isShowStatu = false
                this.isforStatu = true
              }
              this.isShowDelg = !this.isShowDelg
            })
          } else {
            this.$message({
              message: '请填入必填参数',
              type: 'warning'
            })
          }
          break
      }
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

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .crud-opts-left {
  display: none;
}
.dise {
  display: flex !important;
  flex-direction: column !important;
  .edit {
    margin-bottom: 10px;
  }
}
.postin {
  position: absolute;
}
.game {
  padding: 10px;
}
::v-deep .el-dialog__wrapper {
  .el-dialog {
    height: 50%;
    overflow: auto;
    .el-dialog__header {
      padding: 6px;
      padding-bottom: 10px;
      background: #438eb9;
      .el-dialog__title {
        line-height: 24px;
        font-size: 18px;
        color: #fff;
      }
      .el-dialog__headerbtn {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 0;
        background: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        font-size: 16px;
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
          line-height: 30px;
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
</style>
