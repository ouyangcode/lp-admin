<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.gameCode" clearable placeholder="输入gameCode查询" style="width: 200px" class="filter-item" @keyup.enter.native="crud.gameCode" />
        <date-range-picker v-model="query.sdate" class="date-item" />
        <rrOperation />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />

      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="gameName" label="游戏名" />
        <el-table-column prop="gameCode" label="gameCode" />
        <el-table-column prop="totalGameUserNum" label="总用户" />
        <el-table-column prop="totalGameUserNumIos" label="总用户IOS" />
        <el-table-column prop="totalGameUserNumAndroid" label="总用户安卓" />
        <el-table-column prop="totalGameUserNumFbins" label="总用fbins" />
        <el-table-column prop="dayLoginUid" label="日登入DAU" />
        <el-table-column prop="dayAllEverPayUid" label="日儲值用戶DAU" />
        <el-table-column prop="dayPayUid" label="日总储值UID" />
        <el-table-column prop="dayNewRegUid" label="日注册UID" />
        <el-table-column prop="dayNewPayUid" label="日新增储值UID" />
        <el-table-column prop="dayNewRegPayUid" label="日注册儲值UID" />
        <el-table-column prop="dayUSD" label="日储值USD" />
        <el-table-column prop="dayNewUSD" label="日新增储值USD" />
        <el-table-column prop="dayNewRegUSD" label="日注册储值USD" />
        <el-table-column prop="dayPayRate" label="日付费率" />
        <el-table-column prop="dayNewRegPayRate" label="日注冊付费率" />
        <el-table-column prop="dayUsdArpu" label="日Arpu[USD]" />
        <el-table-column prop="dayUsdArppu" label="日Arppu[USD]" />
        <el-table-column prop="dayLpoint" label="日储值TWD" />
        <el-table-column prop="dayNewLpoint" label="日新增储值TWD" />
        <el-table-column prop="dayNewRegLpoint" label="日注册储值TWD" />
        <el-table-column prop="dayArpu" label="日Arpu" />
        <el-table-column prop="dayArppu" label="日Arppu" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
  import lpGmDateReport from '@/api/lpmain/gmDateReport'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import DateRangePicker from '@/components/DateRangePicker'
  import pagination from '@crud/Pagination'
  const defaultForm = { gameCode: null, sdate: null }
  export default {
    name: 'gmDateReport',
    components: {rrOperation, DateRangePicker,crudOperation,pagination },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    cruds() {
      return CRUD({ title: 'soho測試生成', url: 'api/gmDateReport', crudMethod: { ...lpGmDateReport }})
    },
    data() {
      return {
        permission: {   }
        ,
        rules: {
        },
        queryTypeOptions: [
          { key: 'gameCode', display_name: '游戏代码' }
        ]
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
      }
    }
  }
</script>

<style scoped>

</style>
