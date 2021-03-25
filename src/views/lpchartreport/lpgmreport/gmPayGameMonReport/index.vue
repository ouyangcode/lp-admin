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
          style="width: 100px"
          @change="selectData"
        >
          <el-option
            v-for="item in crud.data.gameCodeList"
            :key="item.key"
            :label="item.gameName"
            :value="item.gameCode"
          />
        </el-select>
        <el-select
          v-model="query.currType"
          clearable
          size="small"
          placeholder="币种"
          class="filter-item"
          style="width: 120px"
          @change="selectCurrData"
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
        <el-table-column prop="dateList" align="center" label="日期">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dateList"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="pointList" align="center" label="金额">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.pointList"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="currType" align="center" label="币种" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import { lpGmPayGameMonReport, download } from '@/api/lpmain/gmPayGameMonReport'
import { downloadFile } from '@/utils/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
const defaultForm = { gameCode: null, sdate: null }
export default {
  name: 'GmPayGameMonReport',
  components: { rrOperation, crudOperation, pagination },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'soho測試生成', url: 'api/gmPayGameMonReport/reportList', crudMethod: { ...lpGmPayGameMonReport }})
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
      tableHeight: null
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
    if (this.isMobile() && (window.innerWidth < 486)) {
      this.$nextTick(function() {
        this.tableHeight =
          window.innerHeight - this.$refs.table.$el.offsetTop + 50

        // 监听窗口大小变化
        const self = this
        window.onresize = function() {
          self.tableHeight =
            window.innerHeight - self.$refs.table.$el.offsetTop + 50
        }
      })
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
    isMobile() {
      const flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
      return flag
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
