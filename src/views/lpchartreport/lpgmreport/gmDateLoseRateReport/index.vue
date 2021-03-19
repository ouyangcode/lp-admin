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
            v-for="item in gameOptions"
            :key="item.key"
            :label="item.gameName"
            :value="item.gameCode"
          />
        </el-select>
        <date-range-picker v-model="query.sdate" class="date-item" />
        <rrOperation />
        <el-button
          v-if="crud.optShow.download"
          :loading="crud.downloadLoading"
          class="filter-item"
          size="mini"
          type="warning"
          icon="el-icon-download"
          @click="saveFile()"
        >导出</el-button>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />

      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :header-cell-style="{background:'#eef1f6',color:'#606266'}" border :data="crud.data" size="small" style="width: 100%;">
        <el-table-column prop="dateStr" align="center" label="时间" width="200px" />
        <el-table-column prop="totalLoginNum" align="center" label="日登入DAU" />
        <el-table-column prop="totalPayNum" align="center" label="日儲值用戶DAU" />
        <el-table-column prop="dayAllEverPayUidNum" align="center" label="日总储值UID" />
        <el-table-column prop="LostLogingNum" align="center" label="日流失縂用戶數" />
        <el-table-column prop="LostPayNum" align="center" label="日流失儲值用戶數" />
        <el-table-column prop="LostLoginRate" align="center" label="日縂流失率" />
        <el-table-column prop="LostPayRate" align="center" label="日儲值用戶流失率" />
        <el-table-column prop="LostPayloginRate" align="center" label="日流失儲值用戶占縂流失用戶比例" />
        <el-table-column
          v-permission="['admin']"
          label="下載流失的儲值用戶平臺id"
          width="125px"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-download"
              @click="saveFile(scope.row)"
            />

          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import { lpGmDateLoseRateReport, gameCodeList, download, todownForPage } from '@/api/lpmain/gmDateLoseRateReport'
import { downloadFile } from '@/utils/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import pagination from '@crud/Pagination'
const defaultForm = { gameCode: null, sdate: null }
export default {
  name: 'GmDateLoseRateReport',
  components: { rrOperation, DateRangePicker, crudOperation, pagination },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'soho測試生成', url: 'api/gmDateLoseRateReport/reportList', crudMethod: { ...lpGmDateLoseRateReport }})
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

    this.getGameCodeData()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    getGameCodeData() {
      gameCodeList().then((res) => {
        this.gameOptions = res.content
      })
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
