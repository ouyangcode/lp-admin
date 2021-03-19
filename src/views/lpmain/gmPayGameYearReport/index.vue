<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-select
          v-model="query.currType"
          clearable
          size="small"
          placeholder="币种"
          class="filter-item"
          style="width: 120px"
          @change="selectData"
        >
          <el-option
            v-for="item in currencyList"
            :key="item.key"
            :label="item.value"
            :value="item.currency"
          />
        </el-select>
        <el-date-picker
          v-model="query.sdate"
          class="date-item"
          value-format="yyyy"
          type="year"
          placeholder="选择年"
        />
        <rrOperation />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />

      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :header-cell-style="{background:'#eef1f6',color:'#606266'}" border :data="crud.data" size="small" style="width: 100%;">
        <el-table-column prop="gameCode" align="center" label="gameCode" />
        <el-table-column prop="2012" align="center" label="2012" />
        <el-table-column prop="2013" align="center" label="2013" />
        <el-table-column prop="2014" align="center" label="2014" />
        <el-table-column prop="2015" align="center" label="2015" />
        <el-table-column prop="2016" align="center" label="2016" />
        <el-table-column prop="2017" align="center" label="2017" />
        <el-table-column prop="2018" align="center" label="2018" />
        <el-table-column prop="2019" align="center" label="2019" />
        <el-table-column prop="2020" align="center" label="2020" />
        <el-table-column prop="2021" align="center" label="2021" />
      </el-table>
      <el-table ref="table" v-loading="crud.loading" :header-cell-style="{background:'#eef1f6',color:'#606266'}" border :data="crud.fillterData" size="small" style="width: 100%;">
        <el-table-column prop="totalPoint" align="center" label="总金额" />
        <el-table-column prop="2012" align="center" label="2012" />
        <el-table-column prop="2013" align="center" label="2013" />
        <el-table-column prop="2014" align="center" label="2014" />
        <el-table-column prop="2015" align="center" label="2015" />
        <el-table-column prop="2016" align="center" label="2016" />
        <el-table-column prop="2017" align="center" label="2017" />
        <el-table-column prop="2018" align="center" label="2018" />
        <el-table-column prop="2019" align="center" label="2019" />
        <el-table-column prop="2020" align="center" label="2020" />
        <el-table-column prop="2021" align="center" label="2021" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import { lpGmPayGameYearReport, download } from '@/api/lpmain/gmPayGameYearReport'
import { downloadFile } from '@/utils/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
const defaultForm = { gameCode: null, sdate: null }
export default {
  name: 'GmPayGameYearReport',
  components: { rrOperation, crudOperation, pagination },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'soho測試生成', url: 'api/gmPayGameYearReport/reportList', crudMethod: { ...lpGmPayGameYearReport }})
  },
  data() {
    return {
      permission: { },
      rules: {
      },
      queryTypeOptions: [
        { key: 'gameCode', display_name: '游戏代码' }
      ],
      gameData: [{ totalPoint: 'total' }],
      currencyList: [
        { currency: 'USD', value: 'USD' },
        { currency: 'TWD', value: 'TWD' }
      ],
      getSelectData: '',
      getSeleCurrctData: ''
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
    exportExels() {
      var params = this.crud.getQueryParams()
      params.gameCode = this.getSelectData
      download(params)
        .then((result) => {
          downloadFile(result, '列表数据', 'xlsx')
          this.crud.downloadLoading = false
        })
        .catch(() => {
          this.crud.downloadLoading = false
        })
    },
    selectData(data) {
      this.getSelectData = data
    },
    selectCurrData(data) {
      this.getSeleCurrctData = data
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped >
.open {

  border-bottom: 1px solid #dfe6ec;
  &:last-child {
    border-bottom: none;
  }
}

</style>
