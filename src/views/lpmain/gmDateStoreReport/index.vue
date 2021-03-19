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
          :disabled="!crud.data.length"
          class="filter-item"
          size="mini"
          type="warning"
          icon="el-icon-download"
          @click="exportExels(defaultTime)"
        >导出</el-button>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />

      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" border :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column prop="gameName" align="center" label="游戏名" />
        <el-table-column prop="gameCode" align="center" label="gameCode" />
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
import { lpGmDateStoreReport, gameCodeList, download } from '@/api/lpmain/gmDateStoreReport'
import { downloadFile } from '@/utils/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import pagination from '@crud/Pagination'
const defaultForm = { gameCode: null, sdate: null }
export default {
  name: 'GmDateStoreReport',
  components: { rrOperation, DateRangePicker, crudOperation, pagination },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'soho測試生成', url: 'api/gmDateStoreReport/reportList', crudMethod: { ...lpGmDateStoreReport }})
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
    console.log(this.crud)
    console.log(this.crud.data)
    this.getGameCodeData()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    getGameCodeData() {
      gameCodeList().then((res) => {
        console.log(res)
        this.gameOptions = res.gameCodeList
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
