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
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="isShow"
        :title="crud.status.title"
        width="500px"
      >
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          size="small"
          label-width="80px"
        >
          <el-form-item label="username" prop="username">
            <el-input v-model="form.username" style="width: 370px" />
          </el-form-item>
          <el-form-item label="password">
            <el-input v-model="form.password" style="width: 370px" />
          </el-form-item>
          <el-form-item label="regdate">
            <el-input v-model="form.regdate" style="width: 370px" />
          </el-form-item>
          <el-form-item label="disabled">
            <el-input v-model="form.disabled" style="width: 370px" />
          </el-form-item>
          <el-form-item label="regip">
            <el-input v-model="form.regip" style="width: 370px" />
          </el-form-item>
          <el-form-item label="id">
            <el-input v-model="form.id" style="width: 370px" />
          </el-form-item>
          <el-form-item label="userkey">
            <el-input v-model="form.userkey" style="width: 370px" />
          </el-form-item>
          <el-form-item label="sitecode" prop="sitecode">
            <el-input v-model="form.sitecode" style="width: 370px" />
          </el-form-item>
          <el-form-item label="siteUsername" prop="siteUsername">
            <el-input v-model="form.siteUsername" style="width: 370px" />
          </el-form-item>
          <el-form-item label="passport" prop="passport">
            <el-input v-model="form.passport" style="width: 370px" />
          </el-form-item>
          <el-form-item label="email">
            <el-input v-model="form.email" style="width: 370px" />
          </el-form-item>
          <el-form-item label="reallyName">
            <el-input v-model="form.reallyName" style="width: 370px" />
          </el-form-item>
          <el-form-item label="sex">
            <el-input v-model="form.sex" style="width: 370px" />
          </el-form-item>
          <el-form-item label="birthday">
            <el-input v-model="form.birthday" style="width: 370px" />
          </el-form-item>
          <el-form-item label="identityCard">
            <el-input v-model="form.identityCard" style="width: 370px" />
          </el-form-item>
          <el-form-item label="telephone">
            <el-input v-model="form.telephone" style="width: 370px" />
          </el-form-item>
          <el-form-item label="isupgrade">
            <el-input v-model="form.isupgrade" style="width: 370px" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button
            :loading="crud.status.cu === 2"
            type="primary"
            @click="crud.submitCU"
          >确认</el-button>
        </div>
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
        <el-table-column align="center" prop="index" label="序号" width="60px" />
        <el-table-column align="center" prop="username" label="用户账号" width="140px" />
        <el-table-column align="center" prop="passport" label="passport" width="155px" />
        <el-table-column
          align="center"
          prop="siteUsername"
          label="第三方用户id"
          width="165px"
        />
        <el-table-column align="center" prop="sitecode" label="来源" width="110px" />
        <el-table-column align="center" prop="email" label="邮箱" width="180px" />
        <el-table-column align="center" prop="regip" label="ip地址" width="130px" />
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
            <div v-if="scope.row.isupgrade === 1">
              {{ "是" }}
            </div>
            <div v-if="scope.row.isupgrade === 0">
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
        <el-table-column v-if="isShow" align="center" prop="password" label="密码" />
        <el-table-column v-if="isShow" align="center" prop="userkey" label="userkey" />

        <el-table-column
          v-if="checkPer(['admin', 'gameUser:edit', 'gameUser:del'])"
          label="操作"
          width="150px"
          align="center"
        >
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission" />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudGameUser from '@/api/lpuser/getGameUserList'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
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
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: 'getGameUserList',
      url: '/api/lpGameUser/getGameUserList',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudGameUser }
    })
  },
  data() {
    return {
      isShow: false,
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
      }
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    exportExels() {
      this.isShow = !this.isShow
    }
  }
}
</script>

<style scoped>
::v-deep .crud-opts-left {
  display: none;
}
</style>
