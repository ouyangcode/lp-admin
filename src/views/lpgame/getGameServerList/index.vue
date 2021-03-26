<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.gamecode" clearable placeholder="gamecode" style="width: 140px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select
          v-model="query.runstate"
          clearable
          size="small"
          placeholder="全部游戏查询"
          class="filter-item"
          style="width: 150px"
        >
          <el-option
            v-for="item in gameCodeList"
            :key="item.key"
            :label="item.gamename +'(' + item.gamecode+')'"
            :value="item.gamecode"
          />
        </el-select>
        <rrOperation :crud="crud" />
        <el-button
          v-if="crud.optShow.download"
          :loading="crud.downloadLoading"
          class="filter-item postin"
          size="mini"
          type="warning"
          icon="el-icon-download"
          @click="addGameInfo()"
        >新增</el-button>
      </div>

      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog
        :visible.sync="isShowDelg"
        width="1000px"
        top="1vh"
        height="95%"
        title="新增"
      >
        <el-form
          ref="form"
          :model="scopeData"
          :rules="rules"
          size="small"
          label-width="150px"
        >
          <el-form-item label="所属游戏">
            <el-select
              v-model="scopeData.gamecode"
              clearable
              size="small"
              placeholder="全部游戏查询"
              class="filter-item"
              style="width: 150px"
            >
              <el-option
                v-for="item in gameCodeList"
                :key="item.key"
                :label="item.gamename"
                :value="item.gamecode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="服务器名">
            <el-input v-model="scopeData.servername" style="width: 80%" />
          </el-form-item>
          <el-form-item label="服务器代码">
            <el-input
              v-model="scopeData.servercode"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="经营类型">
            <el-radio-group v-model="scopeData.opType">
              <el-radio label="own">自家经营</el-radio>
              <el-radio label="lianyin">联营</el-radio>
              <el-radio label="proxy">独家代理</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="开服时间">
            <template>
              <el-date-picker
                v-model="scopeData.opentime"
                type="datetime"
                placeholder="选择日期时间"
              />
            </template>
          </el-form-item>
          <el-form-item label="充值开关">
            <template>
              <el-radio-group v-model="scopeData.paysign">
                <el-radio :label="0">开放</el-radio>
                <el-radio :label="1">屏蔽</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>
          <el-form-item label="登入开关">
            <el-radio-group v-model="scopeData.goinsign">
              <el-radio :label="0">开放</el-radio>
              <el-radio :label="1">屏蔽</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="充值域名">
            <el-input
              v-model="scopeData.paydomain"
              placeholder="这里输入L点数"
              style="width: 80%"
            />
          </el-form-item>

          <el-form-item label="登入域名">
            <el-input
              v-model="scopeData.gamedomain"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="登入加密串">
            <el-input
              v-model="scopeData.loginKey"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="充值加密串">
            <el-input
              v-model="scopeData.payKey"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="获取角色加密串">
            <el-input
              v-model="scopeData.infoKey"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="所属地区">
            <el-radio-group v-model="scopeData.serversgin">
              <el-radio :label="1">港澳地区</el-radio>
              <el-radio :label="2">台湾地区</el-radio>
              <el-radio :label="3">新马泰地区</el-radio>
              <el-radio :label="4">港澳台地区</el-radio>
              <el-radio :label="5">大陆地区</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否推荐">
            <el-radio-group v-model="scopeData.serverrcommend">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否热门">
            <el-radio-group v-model="scopeData.hotdegree">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否新服">
            <el-radio-group v-model="scopeData.newserver">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="平台是否展示">
            <el-radio-group v-model="scopeData.isshow">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
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
        <el-table-column v-if="isShow" align="center" prop="gsid" label="gsid" width="60px" />
        <el-table-column align="center" prop="index" label="序号" width="60px" />
        <el-table-column v-permission="['admin', 'gameRoom:edit', 'gameRoom:add', 'gameRoom:del']" label="操作" width="90px" align="center">
          <template slot-scope="scope">
            <el-popover placement="bottom-end" popper-class="chProo" trigger="click">
              <el-button slot="reference" size="mini" icon="el-icon-setting">
                <i class="fa fa-caret-down" aria-hidden="true" />
              </el-button>
              <div class="dise">
                <div class="edit">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="editGameServerInfo(scope.row)"
                  >编辑</el-button>
                </div>

                <el-button
                  size="mini"
                  type="success"
                  icon="el-icon-refresh"
                  @click="uploadGameInfo(scope.row)"
                >更新缓存</el-button>
              </div>

            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="gamecode" label="游戏代码" />
        <el-table-column align="center" prop="servername" label="服务器名" />
        <el-table-column align="center" prop="servercode" label="服务器编码" width="120px" />
        <el-table-column align="center" prop="opType" label="经营类型" />
        <el-table-column align="center" prop="opentime" label="开服时间" width="160px" />
        <el-table-column align="center" prop="paysign" label="充值开关">
          <template slot-scope="scope">
            <div v-if="scope.row.paysign === 1">
              {{ "开" }}
            </div>
            <div v-if="scope.row.paysign === 0">
              {{ "关" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goinsign" label="入口开关">
          <template slot-scope="scope">
            <div v-if="scope.row.paysign === 1">
              {{ "开" }}
            </div>
            <div v-if="scope.row.paysign === 0">
              {{ "关" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="isshow" label="平台展示">
          <template slot-scope="scope">
            <div v-if="scope.row.paysign === 1">
              {{ "开" }}
            </div>
            <div v-if="scope.row.paysign === 0">
              {{ "关" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="paydomain" label="充值域名" width="210px" />
        <el-table-column align="center" prop="gamedomain" label="登入域名" />
        <el-table-column align="center" prop="loginKey" label="登录加密串" width="160px" />
        <el-table-column align="center" prop="payKey" label="登录加密串" width="160px" />
        <el-table-column align="center" prop="infoKey" label="获取角色加密串" width="160px" />
        <el-table-column align="center" prop="serversgin" label="所属地区" />
        <el-table-column align="center" prop="serverrcommend" label="是否推荐">
          <template slot-scope="scope">
            <div v-if="scope.row.paysign === 1">
              {{ "开" }}
            </div>
            <div v-if="scope.row.paysign === 0">
              {{ "关" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="hotdegree" label="是否热门">
          <template slot-scope="scope">
            <div v-if="scope.row.paysign === 1">
              {{ "开" }}
            </div>
            <div v-if="scope.row.paysign === 0">
              {{ "关" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="newserver" label="是否新服">
          <template slot-scope="scope">
            <div v-if="scope.row.paysign === 1">
              {{ "开" }}
            </div>
            <div v-if="scope.row.paysign === 0">
              {{ "关" }}
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
import { crudGetGameServerList, add, edit, del, getAllGameCode, gameServerCleanCache } from '@/api/lpgame/getGameServerList'
import { parseTime } from '@/utils/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { grid: null, gamename: null, pic1: null, pic2: null, pic3: null, pic4: null, pic5: null, pic6: null, pic7: null, pic8: null, pic9: null, pic10: null, content: null, gamehome: null, gtid: null, disable: null, payepointnumber: null, payglodnumber: null, gamecode: null, gamebbs: null, runstate: null, coinname: null, downloadurl: null, orderid: null, gotogameurl: null, type: null, facebookurl: null, companyrate: null, developer: null, gamesize: null, downtag: null, addtime: null, facebookappurl: null, opType: null }
export default {
  name: 'GetGameServerList',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'getGameRoomList', url: '/api/lpgameserver/getGameServerList', idField: 'gsid', sort: 'gsid,desc', crudMethod: { ...crudGetGameServerList }})
  },
  data() {
    return {
      isShowDelg: false,
      isShow: false,
      scopeData: {
        servername: null,
        gamecode: null,
        servercode: null,
        opType: null,
        gamedomain: null,
        payglodnumber: null,
        goinsign: null,
        hotdegree: null,
        infoKey: null,
        isshow: null,
        loginKey: null,
        serversgin: null,
        opentime: null,
        payKey: null,
        paydomain: null,
        paysign: null,
        serverrcommend: null
      },
      gamePlatform: [
        { gamename: '港澳台', gameplatform: '0' },
        { gamename: '新马泰', gameplatform: '1' },
        { gamename: '港澳', gameplatform: '2' },
        { gamename: '台湾', gameplatform: '3' },
        { gamename: '大陆', gameplatform: '4' },
        { gamename: '全球', gameplatform: '5' }
      ],
      runstateList: [
        { runstate: '准备中', runstateform: 0 },
        { runstate: '公测', runstateform: 1 },
        { runstate: '封测', runstateform: 2 },
        { runstate: '停止运营', runstateform: 3 },
        { runstate: '热门推荐', runstateform: 5 }
      ],
      statList: [
        { stat: '5星', statform: '/images/xingxing/50.png' },
        { stat: '4.5星', statform: '/images/xingxing/45.png' },
        { stat: '4星', statform: '/images/xingxing/40.png' },
        { stat: '3.5星', statform: '/images/xingxing/35.png' },
        { stat: '3星', statform: '/images/xingxing/30.png' }
      ],
      runstateArr: [
        { label: '正常运营', value: '4' },
        { label: '停止运营', value: '3' }
      ],
      fileList: [],
      permission: {
        add: ['admin', 'gameRoom:add'],
        edit: ['admin', 'gameRoom:edit'],
        del: ['admin', 'gameRoom:del']
      },
      rules: {
        gamecode: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        runstate: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'gamecode', display_name: 'gamecode' },
        { key: 'runstate', display_name: 'runstate' }
      ],
      gameCodeList: [],
      curdHook: ''
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
        console.log(res)
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
    },
    editGameServerInfo(data) {
      console.log(data)
      this.isShowDelg = !this.isShowDelg
      this.scopeData = data
      this.curdHook = 'edit'
    },
    delGameInfo(data) {
      var params = []
      params.push(data.gsid)
      del(params).then(res => {
        this.crud.dleChangePage(1)
        this.crud.delSuccessNotify()
        this.crud.refresh()
      })
    },
    getServiceValue() {
      switch (this.curdHook) {
        case 'add':
          this.scopeData.addtime = parseTime(new Date())
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
          edit(this.scopeData).then((res) => {
            this.crud.editSuccessNotify()
            this.isShowDelg = !this.isShowDelg
            for (var key in this.scopeData) {
              this.scopeData[key] = null
            }
            this.crud.refresh()
          }).catch(err => {
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
    },
    uploadGameInfo(data) {
      gameServerCleanCache(data.servercode).then((res) => {
        if (res.rst === 1) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
        } else if (res.rst === 0) {
          this.$message({
            message: '参数不能为空',
            type: 'danger'
          })
        }
      })
    },
    handlePreview() {},
    handleRemove() {}
  }
}
</script>

<style lang="scss">
  .el-popover.chProo{
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
.dise{
  display: flex !important;
  flex-direction: column !important;
  .edit{
    margin-bottom: 10px;
  }
}
.postin{
  position: absolute;
}

::v-deep .el-dialog__wrapper {
  .el-dialog {
    height: 95%;
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
      .el-dialog__headerbtn{
        .el-dialog__close{
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
