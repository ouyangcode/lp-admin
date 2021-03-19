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
          placeholder="渠道"
          class="filter-item"
          style="width: 120px"
          @change="selectData"
        >
          <el-option
            v-for="item in crud.data.gameCodeList"
            :key="item.key"
            :label="item.channelName"
            :value="item.channelCode"
          />
        </el-select>
        <!-- <el-date-picker
          v-model="query.getDateValue"
          value-format="yyyy-MM"
          class="date-item"
          type="monthrange"
          range-separator=":"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
        /> -->
        <date-range-picker v-model="query.sdate" class="date-item" />
        <rrOperation />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />

      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :header-cell-style="{background:'#eef1f6',color:'#606266'}" border :data="crud.data" size="small">
        <el-table-column prop="channel" align="center" label="channel" />
        <el-table-column prop="dateList" align="center" label="时间">
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
        <el-table-column prop="point" align="center" label="point">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.point"
              :key="item.key"
              class="open"
            >
              {{ item }}
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
import { lpGmPayChannelDayReport, download, todownForPage } from '@/api/lpmain/gmPayChannelDayReport'
import { downloadFile } from '@/utils/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import pagination from '@crud/Pagination'
const defaultForm = { gameCode: null, sdate: null }
export default {
  name: 'GmPayChannelDayReport',
  components: { rrOperation, DateRangePicker, crudOperation, pagination },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'soho測試生成', url: 'api/gmPayChannelDayReport/reportList', crudMethod: { ...lpGmPayChannelDayReport }})
  },
  data() {
    return {
      permission: { },
      rules: {
      },
      queryTypeOptions: [
        { key: 'gameCode', display_name: '游戏代码' }
      ],
      getDateValue: '',
      isShow: false,
      gameOptions: [],
      gameData: [],
      arrToString: [],
      getSelectData: ''
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
    exportExels(date) {
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
    saveFile(userpay) {
      todownForPage().then(res => {
        if (res.state === 1) {
          var data = userpay.LostPayUser
          this.arrToString = data.join('\n')
          var name = '下載流失的儲值用戶平臺id.txt'// 文件名
          this.exportRaw(this.arrToString, name)
        }
      })
    },
    exportRaw(data, name) {
      var urlObject = window.URL || window.webkitURL || window
      var export_blob = new Blob([data])
      var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
      save_link.href = urlObject.createObjectURL(export_blob)
      save_link.download = name
      save_link.click()
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
