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
        <!-- <el-date-picker
          v-model="query.getDateValue"
          value-format="yyyy-MM"
          class="date-item"
          type="monthrange"
          range-separator=":"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
        /> -->
        <van-calendar v-model="isVisible" :min-date="minDate" :max-date="maxDate" type="range" @confirm="onConfirm" />
        <template v-if="!isShowTime">
          <div class="changDate">
            <input
              v-model="startrtime"
              clearable
              placeholder="开始时间"
              class="filter-item inp_enll"
              @focus="hiddenCode"
              @click="hovePick"
            >
            <span>:</span>
            <input
              v-model="endrtime"
              clearable
              placeholder="结束时间"
              class="filter-item"
              @click="hovePick"
              @focus="hiddenCode"
            >
            <i v-if="isHidd" class="el-icon-circle-close closeInp" @click="delInp" />
          </div>
        </template>
        <date-range-picker v-if="isShowTime" v-model="query.sdate" class="date-item" />
      </div>
      <rrOperation />
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />

      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :height="tableHeight" :header-cell-style="{background:'#eef1f6',color:'#606266'}" border :data="crud.data" size="small" style="width: 100%;">
        <el-table-column prop="gameName" fixed align="center" label="游戏" width="120px">
          <template slot-scope="scope">
            <p>{{ scope.row.gameName }}</p>
            <p>{{ scope.row.gameCode }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="dateList" align="center" label="时间" width="200px">
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
        <el-table-column prop="allTotalCountList" align="center" label="all">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.allTotalCountList"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="iosTotalCountList" align="center" label="ios">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.iosTotalCountList"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="androidTotalCountList" align="center" label="android">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.androidTotalCountList"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="partnerTotalCountList" align="center" label="partner">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.partnerTotalCountList"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="websiteTotalCountList" align="center" label="website">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.websiteTotalCountList"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fbinsTotalCountList" align="center" label="fbins">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.fbinsTotalCountList"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="othersTotalCountList" align="center" label="other">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.othersTotalCountList"
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
import { lpGmDateDAUReport, download, todownForPage } from '@/api/lpmain/gmDateDAUReport'
import { downloadFile, parseTimes } from '@/utils/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import pagination from '@crud/Pagination'
const defaultForm = { gameCode: null, sdate: null }
export default {
  name: 'GmDateDAUReport',
  components: { rrOperation, DateRangePicker, crudOperation, pagination },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'soho測試生成', url: 'api/gmDateDAUReport/reportList', crudMethod: { ...lpGmDateDAUReport }})
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
      getSelectData: '',
      stisShowTime: true,
      isShowTime: true,
      isVisible: false,
      isHidd: false,
      startrtime: '',
      endrtime: '',
      minDate: new Date(2012, 1, 1),
      maxDate: new Date(2030, 1, 31),
      tableHeight: null,
      scroll: null
    }
  },
  created() {
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
      download: true
    }
    if (this.isMobile()) {
      this.isShowTime = false
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
    },
    hovePick() {
      this.isVisible = !this.isVisible
    },
    onConfirm(date) {
      const [start, end] = [parseTimes(date[0]), parseTimes(date[1])]
      console.log([start, end])
      this.isHidd = !this.isHidd
      this.startrtime = start
      this.endrtime = end
      this.query.sdate = [start, end]
      this.isVisible = !this.isVisible
    },
    delInp() {
      this.startrtime = ''
      this.endrtime = ''
      this.isHidd = !this.isHidd
    },
    isMobile() {
      const flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
      return flag
    },
    hiddenCode() {
      document.activeElement.blur()
    },
    scrollTop() {
      this.scroll = document.documentElement.scrollTop || document.body.scrollTop
      console.log(this.scroll)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped >
.changDate {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
    height: 30.5px!important;
    width: 199px!important;
    border: 1px solid #dcdfe6;
    background-color: #fff;
    border-radius: 4px;
    padding: 0px 14px;
  box-sizing: border-box;
  span {
    margin: 0 10px;
  }
  input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    outline: none;
    display: inline-block;
    height: 100%;
    margin: 0;
    padding: 0;
    width: 40%;
    text-align: center;
    font-size: 13px;
    color: #606266;
  }
  .closeInp {
    position: absolute;
    top: 8px;
    right: 6px;
    font-size: 14px;
    z-index: 10;
  }
}
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
