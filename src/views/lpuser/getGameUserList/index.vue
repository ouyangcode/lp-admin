<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <div class="select_tool">
          <!-- 搜索 -->
          <el-input
            v-model="query.username"
            clearable
            placeholder="用户账号"
            style="width: 120px"
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
            v-model="query.siteUsername"
            clearable
            placeholder="第三方用户id"
            style="width: 140px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-input
            v-model="query.regip"
            clearable
            placeholder="regip"
            style="width: 150px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-input
            v-model="query.email"
            clearable
            placeholder="email"
            style="width: 170px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-select
            v-model="query.sitecode"
            clearable
            size="small"
            placeholder="用户来源"
            class="filter-item"
            style="width: 120px"
            @change="crud.toQuery"
          >
            <el-option
              v-for="item in gameOptions"
              :key="item.key"
              :label="item.data"
              :value="item.id"
            />
          </el-select>
          <el-select
            v-model="query.isupgrade"
            clearable
            size="small"
            placeholder="是否升级"
            class="filter-item"
            style="width: 120px"
            @change="crud.toQuery"
          >
            <el-option
              v-for="item in upgradeList"
              :key="item.key"
              :label="item.data"
              :value="item.id"
            />
          </el-select>
          <el-select
            v-model="query.disabled"
            clearable
            size="small"
            placeholder="是否冻结"
            class="filter-item"
            style="width: 120px"
          >
            <el-option
              v-for="item in disabledList"
              :key="item.key"
              :label="item.data"
              :value="item.id"
            />
          </el-select>
          <rrOperation />
        </div>
      </div>

      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog
        :visible.sync="isShowDelg"
        width="450px"
        top="25vh"
        height="30%"
        :title="delogTitle"
        :before-close="beforClose"
      >
        <el-form
          ref="form"
          :model="scopeData"
          :rules="rules"
          size="small"
          label-width="150px"
        >
          <el-form-item label="用户passport">
            <el-input
              v-model="scopeData.passport"
              disabled
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="验证密钥">
            <el-input v-model="scopeData.vercodeKey" style="width: 80%" />
          </el-form-item>
          <el-form-item v-if="isHidden" label="用户Email">
            <el-input v-model="scopeData.email" style="width: 80%" />
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
      <el-dialog title="用户游戏" :visible.sync="isShowGame" width="30%">
        <div class="game">
          <span>{{ gameDataList }}</span>
        </div>
        <span slot="footer" class="dialog-footer" />
      </el-dialog>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        border
        :data="crud.data"
        size="small"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          prop="index"
          label="序号"
          width="60px"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="90px"
          align="center"
        >
          <template slot-scope="scope">
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
                    :disabled="!checkPer(['admin','GameUser:editPassword'])"
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="updatePass(scope.row)"
                  >重置密码</el-button>
                </div>
                <div class="edit">
                  <el-button
                    :disabled="!checkPer(['admin','GameUser:editEmail'])"
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="updateEmail(scope.row)"
                  >设置邮箱</el-button>
                </div>
                <div class="edit">
                  <el-button
                    :disabled="!checkPer(['admin','GameUser:gameUserPlaygames'])"
                    size="mini"
                    type="warning"
                    icon="el-icon-s-open"
                    @click="getGameUserPlayGames(scope.row)"
                  >获取游戏</el-button>
                </div>
                <div v-if="scope.row.disabled === 0" class="edit">
                  <el-button
                    :disabled="!checkPer(['admin','GameUser:lockGameUser'])"
                    size="mini"
                    type="danger"
                    icon="el-icon-warning-outline"
                    @click="lockGameUser(scope.row)"
                  >冻结用户</el-button>
                </div>
                <div v-if="scope.row.disabled === -1" class="edit">
                  <el-button
                    :disabled="!checkPer(['admin','GameUser:disLockGameUser'])"
                    size="mini"
                    type="danger"
                    icon="el-icon-warning-outline"
                    @click="disLockGameUser(scope.row)"
                  >解除冻结</el-button>
                </div>
                <el-button
                  :disabled="!checkPer(['admin','GameUser:cleanCache'])"
                  size="mini"
                  type="success"
                  icon="el-icon-refresh"
                  @click="uploadGameInfo(scope.row)"
                >更新缓存</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="username"
          label="用户账号"
          width="140px"
        />
        <el-table-column
          align="center"
          prop="passport"
          label="passport"
          width="155px"
        />
        <el-table-column
          align="center"
          prop="siteUsername"
          label="第三方用户id"
          width="165px"
        />
        <el-table-column
          align="center"
          prop="sitecode"
          label="来源"
          width="110px"
        />
        <el-table-column
          align="center"
          prop="email"
          label="邮箱"
          width="180px"
        />
        <el-table-column
          align="center"
          prop="regip"
          label="ip地址"
          width="130px"
        />
        <el-table-column align="center" prop="isupgrade" label="是否升级">
          <template slot-scope="scope">
            <div v-if="scope.row.isupgrade === 1">
              {{ "是" }}
            </div>
            <div v-if="scope.row.isupgrade === 0">
              {{ "否" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="disabled" label="是否冻结">
          <template slot-scope="scope">
            <div v-if="scope.row.disabled === -1">
              {{ "是" }}
            </div>
            <div v-if="scope.row.disabled === 0">
              {{ "否" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="regdate"
          label="注册日期"
          width="160px"
        />
        <el-table-column align="center" prop="reallyName" label="真实名" />
        <el-table-column align="center" prop="sex" label="性别" />
        <el-table-column align="center" prop="birthday" label="生日" />
        <el-table-column align="center" prop="identityCard" label="身份证" />
        <el-table-column align="center" prop="telephone" label="电话" />
        <el-table-column
          v-if="isShow"
          align="center"
          prop="password"
          label="密码"
        />
        <el-table-column
          v-if="isShow"
          align="center"
          prop="userkey"
          label="userkey"
        />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import {
  GameUser,
  updatePass,
  updateEmail,
  gameUserCleanCache,
  lockGameUser,
  disLockGameUser,
  getGameUserPlayGames
} from '@/api/lpuser/getGameUserList'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
// import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  username: null,
  password: null,
  regdate: null,
  disabled: null,
  regip: null,
  id: null,
  userkey: null,
  sitecode: null,
  siteUsername: null,
  passport: null,
  email: null,
  reallyName: null,
  sex: null,
  birthday: null,
  identityCard: null,
  telephone: null,
  isupgrade: null
}
export default {
  name: 'GameUser',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: 'getGameUserList',
      url: '/api/lpGameUser/getGameUserList',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...GameUser }
    })
  },
  data() {
    return {
      isShow: false,
      isShowGame: false,
      isShowDelg: false,
      isHidden: false,
      scopeData: {
        passport: null,
        vercodeKey: null,
        email: null
      },
      gameDataList: [],
      permission: {
        add: ['admin', 'gameUser:add'],
        edit: ['admin', 'gameUser:edit'],
        del: ['admin', 'gameUser:del']
      },
      gameOptions: [
        { id: 'lunplay', data: 'lunplay' },
        { id: 'mobile_fs', data: 'mobile_fs' },
        { id: 'lunplaymb', data: 'lunplaymb' },
        { id: 'facebook', data: 'facebook' },
        { id: 'google', data: 'google' },
        { id: 'plurk', data: 'plurk' },
        { id: 'pixnet', data: 'pixnet' },
        { id: 'msn', data: 'msn' },
        { id: 'yahoo', data: 'yahoo' },
        { id: 'twitter', data: 'twitter' },
        { id: 'gamer', data: 'gamer' },
        { id: 'gamerMy', data: 'gamerMy' },
        { id: 'nakuz', data: 'nakuz' },
        { id: '2000 FUN', data: '2000 FUN' },
        { id: 'memoriki', data: 'memoriki' },
        { id: 'gameView', data: 'gameView' },
        { id: 'selegamesBerryPayGame', data: 'selegamesBerryPayGame' },
        { id: 'minimax', data: 'minimax' },
        { id: 'i - gamer', data: 'i - gamer' },
        { id: 'kyo', data: 'kyo' },
        { id: 'olgame', data: 'olgame' },
        { id: 'tysop', data: 'tysop' },
        { id: 'GENKIGAME', data: 'GENKIGAME' },
        { id: 'lanx724', data: 'lanx724' },
        { id: '157 play', data: '157 play' },
        { id: 'muxplay', data: 'muxplay' },
        { id: 'gb_gb', data: 'gb_gb' },
        { id: 'gb_hinet', data: 'gb_hinet' },
        { id: 'gb_asus', data: 'gb_asus' },
        { id: 'yahooqm', data: 'yahooqm' },
        { id: 'googlePlus', data: 'googlePlus' },
        { id: 'gamexddmb', data: 'gamexddmb' },
        { id: 'pubgamemb', data: 'pubgamemb' },
        { id: 'tongzhen', data: 'tongzhen' },
        { id: 'udfunmb', data: 'udfunmb' },
        { id: 'huawei', data: 'huawei' }
      ],
      upgradeList: [
        { id: 0, data: '未升级' },
        { id: 1, data: '升级' }
      ],
      disabledList: [
        { id: 0, data: '未冻结' },
        { id: 1, data: '冻结' }
      ],
      rules: {
        username: [{ required: true, message: '不能为空', trigger: 'blur' }],
        sitecode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        siteUsername: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        passport: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      curdHook: '',
      delogTitle: ''
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    exportExels() {
      this.isShow = !this.isShow
    },
    updatePass(data) {
      this.isShowDelg = !this.isShowDelg
      this.curdHook = 'updatePass'
      this.delogTitle = '重置密码'
      this.scopeData.passport = data.passport
    },
    updateEmail(data) {
      this.isShowDelg = !this.isShowDelg
      this.curdHook = 'updateEmail'
      this.delogTitle = '设置邮箱'
      this.isHidden = true
      this.scopeData.passport = data.passport
    },
    lockGameUser(data) {
      this.isShowDelg = !this.isShowDelg
      this.curdHook = 'lockGameUser'
      this.delogTitle = '冻结用户'
      this.scopeData.passport = data.passport
    },
    disLockGameUser(data) {
      this.isShowDelg = !this.isShowDelg
      this.curdHook = 'disLockGameUser'
      this.delogTitle = '解除冻结'
      this.scopeData.passport = data.passport
    },
    uploadGameInfo(data) {
      this.crud.loading = true
      gameUserCleanCache(data.passport).then((res) => {
        this.crud.loading = false
        this.crud.notify('更新成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.crud.refresh()
      })
    },
    getGameUserPlayGames(data) {
      this.crud.loading = true
      getGameUserPlayGames(data.passport).then((res) => {
        this.crud.loading = false
        this.crud.notify('获取成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.gameDataList = res.rst
        this.isShowGame = true
      })
    },
    closeTip() {
      this.isShowDelg = !this.isShowDelg
      this.scopeData.vercodeKey = ''
      if (this.isHidden) {
        this.isHidden = false
      }
    },
    beforClose() {
      this.isShowDelg = !this.isShowDelg
      this.scopeData.vercodeKey = ''
      if (this.isHidden) {
        this.isHidden = false
      }
    },
    getServiceValue() {
      switch (this.curdHook) {
        case 'updatePass':
          if (this.scopeData.passport && this.scopeData.vercodeKey) {
            updatePass(this.scopeData.passport, this.scopeData.vercodeKey).then(
              (res) => {
                this.crud.notify('重置成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
                this.crud.refresh()
                this.scopeData.vercodeKey = ''
                if (this.isHidden) {
                  this.isHidden = false
                }
                this.isShowDelg = !this.isShowDelg
              }
            )
          } else {
            this.$message({
              message: '请填入必填参数',
              type: 'warning'
            })
          }

          break
        case 'updateEmail':
          if (
            this.scopeData.passport &&
            this.scopeData.vercodeKey &&
            this.scopeData.email
          ) {
            updateEmail(
              this.scopeData.passport,
              this.scopeData.vercodeKey,
              this.scopeData.email
            ).then((res) => {
              this.crud.notify('设置成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
              this.crud.refresh()
              this.scopeData.vercodeKey = ''
              if (this.isHidden) {
                this.isHidden = false
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
        case 'lockGameUser':
          if (this.scopeData.passport && this.scopeData.vercodeKey) {
            lockGameUser(
              this.scopeData.passport,
              this.scopeData.vercodeKey
            ).then((res) => {
              this.crud.notify('冻结成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
              this.crud.refresh()
              this.scopeData.vercodeKey = ''
              if (this.isHidden) {
                this.isHidden = false
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
        case 'disLockGameUser':
          if (this.scopeData.passport && this.scopeData.vercodeKey) {
            disLockGameUser(
              this.scopeData.passport,
              this.scopeData.vercodeKey
            ).then((res) => {
              this.crud.notify('解冻成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
              this.crud.refresh()
              this.scopeData.vercodeKey = ''
              if (this.isHidden) {
                this.isHidden = false
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
    height: 35%;
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
</style>
