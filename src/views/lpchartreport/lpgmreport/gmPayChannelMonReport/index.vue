<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
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
      <el-table ref="table" v-loading="crud.loading" :height="tableHeight" :header-cell-style="{background:'#eef1f6',color:'#606266'}" border :data="crud.data" size="medium" style="width: 100%;">
        <el-table-column prop="month" align="center" label="日期" width="110px" />
        <el-table-column prop="totalPoint" align="center" label="总金额" width="110px" />
        <el-table-column prop="channelInfo" align="center" label="渠道" min-width="180px">
          <template slot-scope="scope">
            <div
              v-for="item of Object.keys(scope.row.channelInfo)"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="point" align="center" label="渠道金额" min-width="120px">
          <template slot-scope="scope">
            <div
              v-for="item of (scope.row.channelInfo)"
              :key="item.key"
              class="open"
            >
              {{ item.point }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="percent" align="center" label="渠道占比" min-width="150px">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.channelInfo"
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
import { lpGmPayChannelMonReport, download } from '@/api/lpmain/gmPayChannelMonReport'
import { downloadFile } from '@/utils/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
const defaultForm = { gameCode: null, sdate: null }
export default {
  name: 'GmPayChannelMonReport',
  components: { rrOperation, crudOperation, pagination },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'soho測試生成', url: 'api/gmPayChannelMonReport/reportList', crudMethod: { ...lpGmPayChannelMonReport }})
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
      getSelectData: '',
      tableHeight: null,
      minDate: new Date(2012, 1, 1),
      maxDate: new Date(2030, 1, 31)
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
    selectData(data) {
      this.getSelectData = data
    },
    isMobile() {
      const flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
      return flag
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
