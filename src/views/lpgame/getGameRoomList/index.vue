<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.gamecode"
          clearable
          placeholder="gamecode"
          style="width: 140px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-select
          v-model="query.runstate"
          clearable
          size="small"
          placeholder="运营状态"
          class="filter-item"
          style="width: 150px"
        >
          <el-option
            v-for="item in runstateArr"
            :key="item.key"
            :label="item.label"
            :value="item.value"
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
          label-width="150px"
        >
          <el-form-item label="排序编号">
            <el-input v-model="scopeData.index" style="width: 80%" />
          </el-form-item>
          <el-form-item label="游戏名称">
            <el-input v-model="scopeData.gamename" style="width: 80%" />
          </el-form-item>
          <el-form-item label="游戏代码">
            <el-input v-model="scopeData.gamecode" style="width: 80%" />
          </el-form-item>
          <el-form-item label="游戏类型">
            <el-radio-group v-model="scopeData.gtid">
              <el-radio :label="4">网络页游</el-radio>
              <el-radio :label="5">网络手游</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="游戏所属平台">
            <el-select
              v-model="scopeData.pic10"
              placeholder="游戏所属平台"
              style="width: 130px"
            >
              <el-option
                v-for="item in gamePlatform"
                :key="item.id"
                :label="item.gamename"
                :value="item.gameplatform"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="经营类型">
            <template>
              <el-radio-group v-model="scopeData.opType">
                <el-radio label="own">自家经营</el-radio>
                <el-radio label="lianyin">联营</el-radio>
                <el-radio label="proxy">独家代理</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>
          <el-form-item label="是否屏蔽">
            <el-radio-group v-model="scopeData.disable">
              <el-radio :label="0">开放</el-radio>
              <el-radio :label="1">屏蔽</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="运营状态">
            <el-select
              v-model="scopeData.runstate"
              placeholder="运营状态"
              style="width: 130px"
            >
              <el-option
                v-for="item in runstateList"
                :key="item.id"
                :label="item.runstate"
                :value="item.runstateform"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="游戏兑换比例">
            <el-input
              v-model="scopeData.payepointnumber"
              placeholder="这里输入L点数"
              style="width: 30%"
            />
            /
            <el-input
              v-model="scopeData.payglodnumber"
              placeholder="这里输入游戏币数"
              style="width: 30%"
            />
          </el-form-item>

          <el-form-item label="游戏币名称">
            <el-input v-model="scopeData.coinname" style="width: 80%" />
          </el-form-item>
          <el-form-item label="IOS下载地址">
            <el-input v-model="scopeData.gotogameurl" style="width: 80%" />
          </el-form-item>
          <el-form-item label="GooGle下载地址">
            <el-input v-model="scopeData.downloadurl" style="width: 80%" />
          </el-form-item>
          <el-form-item label="游戏官网">
            <el-input v-model="scopeData.gamehome" style="width: 80%" />
          </el-form-item>
          <el-form-item label="fb粉丝页地址">
            <el-input v-model="scopeData.facebookurl" style="width: 80%" />
          </el-form-item>
          <el-form-item label="手游二维码链接">
            <el-input v-model="scopeData.pic1" style="width: 80%" />
          </el-form-item>
          <el-form-item label="平台手游星级图标">
            <el-select
              v-model="scopeData.pic2"
              placeholder="平台手游星级图标"
              style="width: 180px"
            >
              <el-option
                v-for="item in statList"
                :key="item.id"
                :label="item.stat"
                :value="item.statform"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="官网icon15*15">
            <el-input v-model="scopeData.pic4" style="width: 80%" />
          </el-form-item>
          <el-form-item label="平台首页推荐图">
            <el-input v-model="scopeData.pic7" style="width: 80%" />
          </el-form-item>
          <el-form-item label="平台游戏列表图(页游[51*51],手游[130*130])">
            <el-input v-model="scopeData.pic8" style="width: 80%" />
          </el-form-item>
          <el-form-item label="平台手游二维码图(android和ios整合一张)">
            <el-input v-model="scopeData.pic9" style="width: 80%" />
          </el-form-item>
          <el-form-item label="游戏描述">
            <el-input
              v-model="scopeData.content"
              type="textarea"
              :rows="2"
              style="width: 80%"
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
      <el-table
        ref="table"
        v-loading="crud.loading"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        border
        :data="crud.data"
        size="small"
        style="width: 100%"
      >
        <el-table-column
          v-if="isShow"
          align="center"
          prop="grid"
          label="grid"
          width="60px"
        />
        <el-table-column
          align="center"
          prop="index"
          label="序号"
          width="60px"
        />
        <el-table-column
          v-permission="[
            'admin',
            'gameRoom:edit',
            'gameRoom:add',
            'gameRoom:del',
          ]"
          label="操作"
          width="90px"
          align="center"
        >
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
                    icon="el-icon-edit"
                    @click="editGameServerInfo(scope.row)"
                  >编辑</el-button>
                </div>
                <div class="del">
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-edit"
                    @click="delGameInfo(scope.row)"
                  >删除</el-button>
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
        <el-table-column
          align="center"
          prop="gamename"
          label="游戏名"
          width="100px"
        />
        <el-table-column align="center" prop="gamecode" label="游戏代码" />
        <el-table-column align="center" prop="coinname" label="游戏币" />
        <el-table-column align="center" prop="payepointnumber" label="兑换比例">
          <template slot-scope="scope">
            {{ scope.row.payepointnumber }} / {{ scope.row.payglodnumber }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="gtid" label="游戏类型">
          <template slot-scope="scope">
            <div v-if="scope.row.gtid === 4">{{ "頁游" }}</div>
            <div v-if="scope.row.gtid === 5">{{ "手游" }}</div>
            <div v-if="scope.row.gtid === 6">{{ "單機" }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="opType" label="经营类型">
          <template slot-scope="scope">
            <div v-if="scope.row.opType === 'own'">{{ "自家经营" }}</div>
            <div v-if="scope.row.opType === 'lianyin'">{{ "联营" }}</div>
            <div v-if="scope.row.opType === 'proxy'">{{ "代理独家经营" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="pic10"
          label="所属平台"
          width="120px"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.pic10 === '0'">{{ "港澳臺平臺" }}</div>
            <div v-if="scope.row.pic10 === '1'">{{ "新馬泰平臺" }}</div>
            <div v-if="scope.row.pic10 === '2'">{{ "港澳平臺" }}</div>
            <div v-if="scope.row.pic10 === '3'">{{ "台灣平臺" }}</div>
            <div v-if="scope.row.pic10 === '4'">{{ "大陸平臺" }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="disable" label="展示">
          <template slot-scope="scope">
            <div v-if="scope.row.disable === 1">{{ "展示" }}</div>
            <div v-if="scope.row.disable === 0">{{ "屏蔽" }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="runstate" label="运行状态">
          <template slot-scope="scope">
            <div v-if="scope.row.runstate === 0">{{ "準備中0" }}</div>
            <div v-if="scope.row.runstate === 1">{{ "公測1" }}</div>
            <div v-if="scope.row.runstate === 2">{{ "封測2" }}</div>
            <div v-if="scope.row.runstate === 3">{{ "停止運營3" }}</div>
            <div v-if="scope.row.runstate === 4">{{ "熱門推薦4" }}</div>
            <div v-if="scope.row.runstate === 5">{{ "熱門推薦5" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="addtime"
          label="添加时间"
          width="180px"
        />
        <el-table-column
          align="center"
          prop="address"
          label="链接地址"
          width="320px"
        >
          <template slot-scope="scope">
            <el-link
              :underline="false"
              :href="scope.row.gamecode"
              type="primary"
            >官网</el-link>
            <span>|</span>
            <el-link
              :underline="false"
              :href="scope.row.facebookurl"
              type="primary"
            >fb粉丝页</el-link>
            <span>|</span>
            <el-link
              :underline="false"
              :href="scope.row.gotogameurl"
              type="primary"
            >ios下载页</el-link>
            <span>|</span>
            <el-link
              :underline="false"
              :href="scope.row.downloadurl"
              type="primary"
            >gp下载</el-link>
            <span>|</span>
            <el-link
              :underline="false"
              :href="scope.row.gamecode"
              type="primary"
            >二维码地址</el-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="photoaddress"
          label="图片地址"
          width="325px"
        >
          <template slot-scope="scope">
            <el-link
              :underline="false"
              :href="scope.row.pic2"
              type="primary"
            >星级图标</el-link>
            <span>|</span>
            <el-link
              :underline="false"
              :href="scope.row.pic4"
              type="primary"
            >icon</el-link>
            <span>|</span>
            <el-link
              :underline="false"
              :href="scope.row.pic7"
              type="primary"
            >平台推荐</el-link>
            <span>|</span>
            <el-link
              :underline="false"
              :href="scope.row.pic8"
              type="primary"
            >平台列表</el-link>
            <span>|</span>
            <el-link
              :underline="false"
              :href="scope.row.pic9"
              type="primary"
            >平台二维码</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import { crudGameRoom, add, edit, del, gameRoomCleanCache } from '@/api/lpgame/gameRoom'
import { parseTime } from '@/utils/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  grid: null,
  gamename: null,
  pic1: null,
  pic2: null,
  pic3: null,
  pic4: null,
  pic5: null,
  pic6: null,
  pic7: null,
  pic8: null,
  pic9: null,
  pic10: null,
  content: null,
  gamehome: null,
  gtid: null,
  disable: null,
  payepointnumber: null,
  payglodnumber: null,
  gamecode: null,
  gamebbs: null,
  runstate: null,
  coinname: null,
  downloadurl: null,
  orderid: null,
  gotogameurl: null,
  type: null,
  facebookurl: null,
  companyrate: null,
  developer: null,
  gamesize: null,
  downtag: null,
  addtime: null,
  facebookappurl: null,
  opType: null
}
export default {
  name: 'GameRoom',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: 'getGameRoomList',
      url: '/api/lpgameroom/getGameRoomList',
      idField: 'grid',
      sort: 'grid,desc',
      crudMethod: { ...crudGameRoom }
    })
  },
  data() {
    return {
      isShowDelg: false,
      isShow: false,
      scopeData: {
        index: null,
        gamename: null,
        gamecode: null,
        coinname: null,
        opType: null,
        payepointnumber: null,
        payglodnumber: null,
        disable: null,
        runstate: null,
        facebookurl: null,
        gamehome: null,
        gotogameurl: null,
        downloadurl: null,
        Developer: null,
        pic2: null,
        pic4: null,
        pic7: null,
        pic8: null,
        pic9: null,
        pic10: null
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
        { label: '准备中', value: 0 },
        { label: '公测', value: 1 },
        { label: '封测', value: 2 },
        { label: '停止运营', value: 3 },
        { label: '热门推荐', value: 5 }
      ],
      fileList: [],
      permission: {
        add: ['admin', 'gameRoom:add'],
        edit: ['admin', 'gameRoom:edit'],
        del: ['admin', 'gameRoom:del']
      },
      rules: {
        gamecode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        runstate: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      queryTypeOptions: [
        { key: 'gamecode', display_name: 'gamecode' },
        { key: 'runstate', display_name: 'runstate' }
      ],
      curdHook: ''
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
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
      params.push(data.grid)
      this.$confirm(`确认删除选中的数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          del(params).then((res) => {
            this.crud.dleChangePage(1)
            this.crud.delSuccessNotify()
            this.crud.refresh()
          })
        })
        .catch(() => {})
    },
    typeIndex(index) {
      const vm = this // 处理分页数据的 index
      return (vm.pageNo - 1) * vm.pageSize + index + 1
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
    },
    uploadGameInfo(data) {
      gameRoomCleanCache(data.gamecode).then((res) => {
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
    handleRemove() {},
    handlePreview() {}
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
    height: 66%;
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
