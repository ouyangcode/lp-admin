<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-select
          v-model="query.gameCode"
          clearable
          size="small"
          placeholder="游戏"
          class="filter-item"
          style="width: 120px"
          @change="selectData"
        >
          <el-option
            v-for="item in crud.data.gameCodeList"
            :key="item.key"
            :label="item.gameName"
            :value="item.gameCode"
          />
        </el-select>

      </div>
      <rrOperation />
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />

      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :height="tableHeight" :header-cell-style="{background:'#eef1f6',color:'#606266'}" border :data="crud.data" size="small" style="width: 100%;">
        <el-table-column prop="gameName" align="center" label="游戏">
          <template slot-scope="scope">
            <p>{{ scope.row.gameName }}</p>
            <p>{{ scope.row.gameCode }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="toatalNum" align="center" label="总平台用户" />
        <el-table-column prop="dataList" align="center" label="来源">
          <template slot-scope="scope">
            <div
              v-for="item of Object.keys(scope.row.dataList)"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="num" align="center" label="平台用户">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dataList"
              :key="item.key"
              class="open"
            >
              {{ item.num }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="percent" align="center" label="占比">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dataList"
              :key="item.key"
              class="open"
            >
              {{ item.percent }}
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
import { lpGmGameUserPercentReport, download } from '@/api/lpmain/gmGameUserPercentReport'
import { downloadFile } from '@/utils/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
const defaultForm = { gameCode: null, sdate: null }
export default {
  name: 'GmGameUserPercentReport',
  components: { rrOperation, crudOperation, pagination },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'soho測試生成', url: 'api/gmGameUserPercentReport/reportList', crudMethod: { ...lpGmGameUserPercentReport }})
  },
  data() {
    return {
      permission: { },
      rules: {
      },
      queryTypeOptions: [
        { key: 'gameCode', display_name: '游戏代码' }
      ],
      gameOptions: [],
      currencyList: [
        { currency: 'USD', value: 'USD' },
        { currency: 'TWD', value: 'TWD' }
      ],
      getSelectData: '',
      getSeleCurrctData: '',
      tableHeight: 100
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
  mounted: function() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 50

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.table.$el.offsetTop - 50
      }
    })
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
::v-deep .crud-opts-left {
  display: none;
}
.open {

  border-bottom: 1px solid #dfe6ec;
  &:last-child {
    border-bottom: none;
  }
}

</style>
