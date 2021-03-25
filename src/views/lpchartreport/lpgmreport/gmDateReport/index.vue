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
        <van-calendar v-model="isVisible" :min-date="minDate" :max-date="maxDate" type="range" @confirm="onConfirm" />
        <template v-if="!isShowTime">
          <div class="changDate">
            <input
              v-model="startrtime"
              clearable
              placeholder="开始时间"
              class="filter-item inp_enll"
              @click="hovePick"
              @focus="hiddenCode"
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
      <el-button
        v-if="crud.optShow.download"
        :loading="crud.downloadLoading"
        :disabled="!crud.data.length"
        class="filter-item"
        size="mini"
        type="warning"
        icon="el-icon-download"
        @click="exportExels()"
      >导出</el-button>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />

      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :height="tableHeight" :header-cell-style="{background:'#eef1f6',color:'#606266'}" border :data="crud.data" size="small" style="width: 100%;">
        <el-table-column prop="gameName" align="center" fixed label="游戏名">
          <template slot-scope="scope">
            <p>{{ scope.row.gameName }}</p>
            <p>{{ scope.row.gameCode }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="totalGameUserNum" align="center" label="总用户" />
        <el-table-column prop="totalGameUserNumIos" align="center" label="总用户IOS" />
        <el-table-column prop="totalGameUserNumAndroid" align="center" label="总用户安卓" />
        <el-table-column prop="totalGameUserNumFbins" align="center" label="总用fbins" />
        <el-table-column prop="dateList" align="center" width="100px" label="日期">
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
        <el-table-column prop="dayLoginUid" align="center" label="日登入DAU">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayLoginUid"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayAllEverPayUid" align="center" label="日儲值用戶DAU">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayAllEverPayUid"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayPayUid" align="center" label="日总储值UID">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayPayUid"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewRegUid" align="center" label="日注册UID">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewRegUid"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewPayUid" align="center" label="日新增储值UID">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewPayUid"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewRegPayUid" align="center" label="日注册儲值UID">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewRegPayUid"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayUSD" align="center" label="日储值USD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayUSD"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewUSD" align="center" label="日新增储值USD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewUSD"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewRegUSD" align="center" label="日注册储值USD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewRegUSD"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayPayRate" align="center" label="日付费率">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayPayRate"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewRegPayRate" align="center" label="日注冊付费率">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewRegPayRate"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayUsdArpu" align="center" label="日Arpu[USD]">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayUsdArpu"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayUsdArppu" align="center" label="日Arppu[USD]">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayUsdArppu"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayLpoint" align="center" label="日储值TWD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayLpoint"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewLpoint" align="center" label="日新增储值TWD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewLpoint"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewRegLpoint" align="center" label="日注册储值TWD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewRegLpoint"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayArpu" align="center" label="日Arpu">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayArpu"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayArppu" align="center" label="日Arppu">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayArppu"
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
import { lpGmDateReport } from '@/api/lpmain/gmDateReport'
import { download } from '@/api/data'
import { downloadFile, parseTimes } from '@/utils/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import pagination from '@crud/Pagination'
const defaultForm = { gameCode: null, sdate: null }
export default {
  name: 'GmDateReport',
  components: { rrOperation, DateRangePicker, crudOperation, pagination },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '游戏日数据报表', url: 'api/gmDateReport/reportList', crudMethod: { ...lpGmDateReport }})
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
      isShowTime: true,
      isVisible: false,
      isHidd: false,
      startrtime: '',
      endrtime: '',
      minDate: new Date(2012, 1, 1),
      maxDate: new Date(2030, 1, 31),
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

    exportExels() {
      var params = this.crud.getQueryParams()
      params.gameCode = this.getSelectData
      this.crud.downloadLoading = true
      download('/api/gmDateReport/download', params).then(result => {
        downloadFile(result, this.crud.title + '数据', 'xlsx')
        this.crud.downloadLoading = false
      }).catch(() => {
        this.crud.downloadLoading = false
      })
    },
    selectData(data) {
      this.getSelectData = data
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
