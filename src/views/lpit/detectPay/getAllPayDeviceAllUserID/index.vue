<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.gameCode"
          clearable
          placeholder="游戏"
          style="width: 120px"
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
        <rrOperation />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <el-dialog
        title="设置密码"
        :visible.sync="centerDialogVisible"
        width="30%"
        center
      >
        <el-input
          v-model="userPassword"
          clearable
          placeholder="请输入密码"
          style="width: 80%"
          class="filter-item"
        />
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="toSendInfo">确 定</el-button>
        </span>
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
        <el-table-column align="center" prop="id" label="序号" width="65px" />

        <el-table-column prop="objKey" align="center" label="设备ID" />
        <el-table-column prop="objVal" align="center" label="用户passport">
          <template slot-scope="scope">
            <div
              v-for="(item,index) of scope.row.objVal"
              :key="index"
              class="open"
            >
              <span>{{ item }}</span>
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
  lpGetAllPayDeviceAllUserID,
  gameCodeList,
  toWhiteOrForbiddenDevice
} from '@/api/lpitmgr/detectPay/getAllPayDeviceAllUserID'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
const defaultForm = { gameCode: null, sdate: null }
export default {
  name: 'GetAllPayDeviceAllUserID',
  components: { rrOperation, crudOperation, pagination },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: 'soho測試生成',
      url: '/api/detectPay/getAllPayDeviceAllUserID',
      crudMethod: { ...lpGetAllPayDeviceAllUserID }
    })
  },
  data() {
    return {
      permission: {},
      rules: {},
      queryTypeOptions: [{ key: 'gameCode', display_name: '游戏代码' }],
      centerDialogVisible: false,
      gameOptions: [],
      keychainIDList: [],
      isBlocList: [],
      getIndex: null,
      keychainID: null,
      isBloc: null,
      isWhite: false,
      isWhiteList: [],
      currencyList: [
        { currency: 'USD', value: 'USD' },
        { currency: 'TWD', value: 'TWD' }
      ],
      getSelectData: '',
      getSeleCurrctData: '',
      userPassword: '',
      dt: ''
    }
  },
  created() {
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
      download: true
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    getGameCodeData() {
      // gameCodeList().then((res) => {
      //   console.log(res)
      //   this.gameOptions = res.gameCodeList
      // })
    },
    toBlickList(data) {
      console.log(data)
      this.centerDialogVisible = !this.centerDialogVisible
    },
    toSendInfo() {
      const params = {}
      params.gameCode = this.query.gameCode
      params.packageName = this.query.packageName
      params.passport = this.query.passport
      params.keychainID = this.keychainID
      params.pw = this.userPassword
      params.dt = this.dt

      toWhiteOrForbiddenDevice(params).then((res) => {
        console.log(res)
        if (res.content[0].rst.code === '1004') {
          this.$notify({
            message: res.content[0].rst.msg,
            type: 'warning'
          })
          this.userPassword = ''
          this.centerDialogVisible = !this.centerDialogVisible
        }
      })
    },
    toQueryParams() {
      var params = this.crud.getQueryParams()
      params.gameCode = this.query.gameCode
      params.packageName = this.query.packageName
      params.passport = this.query.passport
      gameCodeList(params).then((res) => {
        console.log(res)
        if (res.content[0].code === '001') {
          this.crud.page.page = 1
          this.crud.refresh()
          this.gameOptions = res.content[0].rst.deviceValue
          this.isBlocList = []
          for (var key in this.gameOptions) {
            // 通过遍历对象属性的方法，遍历键值对，获得key，然后通过 对象[key]获得对应的值
            var value = this.gameOptions[key]
            var valueArr = value.split(',')
            console.log(valueArr[0])
            if (valueArr[0] === 'notAllow' || valueArr[0] === 'forbidden') {
              this.isBloc = true
              this.isBlocList.push(this.isBloc)
            } else {
              this.isBloc = false
              this.isBlocList.push(this.isBloc)
            }
          }
          console.log(this.isBlocList)
        }
      })
    },
    toHiddenList(data, key) {
      this.centerDialogVisible = !this.centerDialogVisible
      this.getIndex = key
      this.keychainIDList = Object.keys(data)
      this.keychainID = this.keychainIDList[key]
      this.dt = 'forbidden'
    },
    toWhiteList(data, key) {
      this.centerDialogVisible = !this.centerDialogVisible
      this.getIndex = key
      this.keychainIDList = Object.keys(data)
      this.keychainID = this.keychainIDList[key]
      this.dt = 'whiteList'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped >
::v-deep .crud-opts-left {
  display: none;
}
.open {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #dfe6ec;
  &:last-child {
    border-bottom: none;
  }
}
</style>
