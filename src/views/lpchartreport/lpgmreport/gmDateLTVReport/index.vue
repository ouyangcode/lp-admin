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
            v-for="item in gameOptions"
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
        <rrOperation />
      </div>

      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />

      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :height="tableHeight" :header-cell-style="{background:'#eef1f6',color:'#606266'}" border :data="crud.data" size="small" style="width: 100%;">
        <el-table-column prop="gameCode" align="center" label="gameCode" width="120px">
          <template>
            {{ query.gameCode }}
          </template>
        </el-table-column>
        <el-table-column prop="date" align="center" label="时间" width="150px" />
        <el-table-column prop="index0" align="center" label="1日" width="110px">
          <template slot-scope="scope">
            <div v-if="scope.row.index0">{{ scope.row.index0 }}</div>

          </template>
        </el-table-column>
        <el-table-column prop="index1" align="center" label="3日" width="110px">
          <template slot-scope="scope">
            <div v-if="scope.row.index1">{{ scope.row.index1 }}</div>

          </template>
        </el-table-column>
        <el-table-column prop="index2" align="center" label="5日" width="110px">
          <template slot-scope="scope">
            <div v-if="scope.row.index2">{{ scope.row.index2 }}</div>

          </template>
        </el-table-column>
        <el-table-column prop="index3" align="center" label="7日" width="110px">
          <template slot-scope="scope">
            <div v-if="scope.row.index3">{{ scope.row.index3 }}</div>

          </template>
        </el-table-column>
        <el-table-column prop="index4" align="center" label="15日" width="110px">
          <template slot-scope="scope">
            <div v-if="scope.row.index4">{{ scope.row.index4 }}</div>

          </template>
        </el-table-column>
        <el-table-column prop="index5" align="center" label="30日" width="110px">
          <template slot-scope="scope">
            <div v-if="scope.row.index5">{{ scope.row.index5 }}</div>

          </template>
        </el-table-column>
        <el-table-column prop="index6" align="center" label="60日" width="110px">
          <template slot-scope="scope">
            <div v-if="scope.row.index6"> {{ scope.row.index6 }}</div>

          </template>
        </el-table-column>
        <el-table-column prop="index7" align="center" label="90日" width="110px">
          <template slot-scope="scope">
            <div v-if="scope.row.index7"> {{ scope.row.index7 }}</div>

          </template>
        </el-table-column>
        <el-table-column prop="index8" align="center" label="120日" width="110px">
          <template slot-scope="scope">
            <div v-if="scope.row.index8">{{ scope.row.index8 }}</div>

          </template>
        </el-table-column>
        <el-table-column prop="index9" align="center" label="180日" width="110px">
          <template slot-scope="scope">
            <div v-if="scope.row.index9"> {{ scope.row.index9 }}</div>

          </template>
        </el-table-column>
        <el-table-column prop="index10" align="center" label="240日" width="110px">
          <template slot-scope="scope">
            <div v-if="scope.row.index10">{{ scope.row.index10 }}</div>

          </template>
        </el-table-column>
        <el-table-column prop="index11" align="center" label="360日" width="110px">
          <template slot-scope="scope">
            <div v-if="scope.row.index11">{{ scope.row.index11 }}</div>

          </template>
        </el-table-column>
        <el-table-column prop="index12" align="center" label="360日以上" width="110px">
          <template slot-scope="scope">
            <div v-if="scope.row.index12">{{ scope.row.index12 }}</div>

          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import { lpGmDateLoseRateReport, gameCodeList } from '@/api/lpmain/gmDateLTVReport'
import { parseTimes } from '@/utils/index'
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
    return CRUD({ title: 'soho測試生成', url: '/api/gmDateLTVReport/reportList', crudMethod: { ...lpGmDateLoseRateReport }})
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
    this.getGameCodeData()
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
    getGameCodeData() {
      gameCodeList().then((res) => {
        this.gameOptions = res.content
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
    width: 215px!important;
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
