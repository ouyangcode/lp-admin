<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->

        <el-input v-model="query.userid" clearable placeholder="请输入用户id" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <el-button
        v-if="crud.optShow.download"
        :loading="crud.downloadLoading"
        class="filter-item postin"
        size="mini"
        type="warning"
        icon="el-icon-download"
        @click="addGameInfo()"
      >新增</el-button>
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
          <el-form-item label="userid">
            <el-input v-model="scopeData.userid" style="width: 80%" />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="scopeData.status">
              <el-radio label="0">正常</el-radio>
              <el-radio label="1">删除</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="游戏代码">
            <template>
              <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="(item,index) in crud.data.gameCodeList" :key="index" :label="item.gameCode">{{ item.gameName }}</el-checkbox>
              </el-checkbox-group>
            </template>
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
        <el-table-column align="center" prop="id" label="id" width="60px" />
        <el-table-column align="center" prop="userid" label="用户ID" />
        <el-table-column align="center" prop="createbyuser" label="创建人" />
        <el-table-column align="center" prop="gamecode" label="游戏代码" />
        <el-table-column align="center" prop="ctime" label="创建时间" />
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status === '0'">
              {{ '正常' }}
            </div>
            <div v-if="scope.row.status === '1'">
              {{ '删除' }}
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="ip" label="ip" />
        <el-table-column align="center" prop="modifyuser" label="修改人" />
        <el-table-column align="center" prop="modifytime" label="修改时间" />

        <el-table-column v-permission="['admin', 'gameRoom:edit', 'gameRoom:add', 'gameRoom:del']" label="操作" width="100px" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editGameServerInfo(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="isShow"
              size="mini"
              type="danger"
              icon="el-icon-edit"
              @click="delGameInfo(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import { crudGameRoom, add, edit, del } from '@/api/lpconfig/lpuserconfig/getLpuserGamelimitList'
import { parseTime } from '@/utils/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { grid: null, gamename: null, pic1: null, pic2: null, pic3: null, pic4: null, pic5: null, pic6: null, pic7: null, pic8: null, pic9: null, pic10: null, content: null, gamehome: null, gtid: null, disable: null, payepointnumber: null, payglodnumber: null, gamecode: null, gamebbs: null, runstate: null, coinname: null, downloadurl: null, orderid: null, gotogameurl: null, type: null, facebookurl: null, companyrate: null, developer: null, gamesize: null, downtag: null, addtime: null, facebookappurl: null, opType: null }
export default {
  name: 'GameRoom',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'getGameRoomList', url: '/api/lpuserGamelimit/getLpuserGamelimitList', idField: 'id', sort: 'id,desc', crudMethod: { ...crudGameRoom }})
  },
  data() {
    return {
      isShow: false,
      isShowDelg: false,
      scopeData: {
        userid: null,
        gamecode: [],
        status: null
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
        { stat: '5星', statform: '50' },
        { stat: '4.5星', statform: '45' },
        { stat: '4星', statform: '40' },
        { stat: '3.5星', statform: '35' },
        { stat: '3星', statform: '30' }
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
      statusList: [
        { label: '正常', value: '0' },
        { label: '删除', value: '1' }
      ],
      curdHook: '',
      checkedCities: [],
      allgameTitle: 'allgame'
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
      this.checkedCities = []
      this.scopeData.gamecode = ''
      this.isShowDelg = !this.isShowDelg
      this.curdHook = 'add'
    },
    editGameServerInfo(data) {
      console.log(data)
      if (!data.gamecode) {
        data.gamecode = ''
      }
      console.log(this.crud.data.gameCodeList)
      var splitArr = data.gamecode.split(',')

      var getSplitArr = []
      this.crud.data.gameCodeList.forEach((item, index) => {
        if (splitArr.indexOf(item.gameCode) !== -1) {
          getSplitArr.push(item.gameCode)
        }
      })
      this.checkedCities = getSplitArr
      this.isShowDelg = !this.isShowDelg
      this.scopeData = data
      this.curdHook = 'edit'
    },
    delGameInfo(data) {
      var params = []
      params.push(data.grid)
      del(params).then(res => {
        this.crud.dleChangePage(1)
        this.crud.delSuccessNotify()
        this.crud.refresh()
      })
    },
    getServiceValue() {
      switch (this.curdHook) {
        case 'add':
          console.log(this.scopeData)
          this.scopeData.ctime = parseTime(new Date())
          if (this.scopeData.userid && this.scopeData.status && this.scopeData.gamecode) {
            add(this.scopeData).then((res) => {
              this.crud.addSuccessNotify()
              this.isShowDelg = !this.isShowDelg
              for (var key in this.scopeData) {
                this.scopeData[key] = null
              }
              this.crud.refresh()
            })
          } else {
            this.$message({
              message: '请填入必填参数',
              type: 'warning'
            })
          }

          break
        case 'edit':
          this.scopeData.modifytime = parseTime(new Date())
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
    handleCheckedCitiesChange(value) {
      console.log(value)
      value.forEach((item, index) => {
        if (item === 'allgame') {
          this.checkedCities = ['allgame']
          value = ['allgame']
        }
      })
      this.scopeData.gamecode = value.join(',')
      console.log(this.scopeData.gamecode)
    },
    checkData(value) {
      if (value) {
        this.scopeData.gamecode = 'allgame'
      }
    },
    handleRemove() {}
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .crud-opts-left {
  display: none;
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
