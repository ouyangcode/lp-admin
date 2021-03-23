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
        <van-calendar v-model="isVisible" type="range" @confirm="onConfirm" />
        <template v-if="!isShowTime">
          <div class="changDate">
            <input
              v-model="startrtime"
              clearable
              placeholder="开始时间"
              class="filter-item inp_enll"
              @click="hovePick"
            >
            <span>:</span>
            <input
              v-model="endrtime"
              clearable
              placeholder="结束时间"
              class="filter-item"
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
      <el-table ref="table" v-loading="crud.loading" :header-cell-style="{background:'#eef1f6',color:'#606266'}" border :data="crud.data" size="small" style="width: 100%;">
        <el-table-column prop="gameName" align="center" label="游戏名">
          <template slot-scope="scope">
            <p>{{ scope.row.gameName }}</p>
            <p>{{ scope.row.gameCode }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="allLpoint" align="center" label="总储值UID" />
        <el-table-column prop="allUSD" align="center" label="总储值USD(2020.5.16开始的数据)" />
        <el-table-column prop="allUid" align="center" label="总储值TWD" />
        <el-table-column prop="dayUid" align="center" width="100px" label="日储值UID">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayUid"
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
        <el-table-column prop="dayNewUid" align="center" label="日新增储值UID">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewUid"
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
        <el-table-column prop="dayUidIos" align="center" label="Ios日储值Uid">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayUidIos"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayUSDIos" align="center" label="Ios日储值USD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayUSDIos"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewUidIos" align="center" label="Ios日新增储值UID">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewUidIos"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewUSDIos" align="center" label="Ios日新增储值USD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewUSDIos"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayUidAndroid" align="center" label="Andr日储值Uid">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayUidAndroid"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayUSDAndroid" align="center" label="Andr日储值USD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayUSDAndroid"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewUidAndroid" align="center" label="Andr日新增储值UID">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewUidAndroid"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewUSDAndroid" align="center" label="Andr日新增储值USD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewUSDAndroid"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayUidFbins" align="center" label="fbins日储值Uid">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayUidFbins"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayUSDFbins" align="center" label="fbins日储值USD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayUSDFbins"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewUidFbins" align="center" label="fbins日新增储值UID">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewUidFbins"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewUSDFbins" align="center" label="fbins日新增储值USD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewUSDFbins"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayUidPartner" align="center" label="partner日储值Uid">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayUidPartner"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayUSDPartner" align="center" label="partner日储值USD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayUSDPartner"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewUidPartner" align="center" label="partner日新增储值UID">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewUidPartner"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayUidWebsite" align="center" label="Website日储值Uid">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayUidWebsite"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayUSDWebsite" align="center" label="Website日储值USD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayUSDWebsite"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewUidWebsite" align="center" label="Website日新增储值UID">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewUidWebsite"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewUSDWebsite" align="center" label="Website日新增储值USD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewUSDWebsite"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayUidOthers" align="center" label="others日储值Uid">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayUidOthers"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayUSDOthers" align="center" label="others日储值USD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayUSDOthers"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewUidOthers" align="center" label="others日新增储值UID">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewUidOthers"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewUSDOthers" align="center" label="others日新增储值USD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewUSDOthers"
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
        <el-table-column prop="dayLpointIos" align="center" label="Ios日储值TWD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayLpointIos"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewLpointIos" align="center" label="Ios日新增储值TWD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewLpointIos"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayLpointAndroid" align="center" label="Andr日储值TWD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayLpointAndroid"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewLpointAndroid" align="center" label="Andr日新增储值TWD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewLpointAndroid"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayLpointFbins" align="center" label="fbins日储值TWD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayLpointFbins"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewLpointFbins" align="center" label="fbins日新增储值TWD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewLpointFbins"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayLpointPartner" align="center" label="partner日储值TWD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayLpointPartner"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewLpointPartner" align="center" label="partner日新增储值TWD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewLpointPartner"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayLpointWebsite" align="center" label="Website日储值TWD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayLpointWebsite"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewLpointWebsite" align="center" label="Website日新增储值TWD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewLpointWebsite"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayLpointOthers" align="center" label="others日储值TWD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayLpointOthers"
              :key="item.key"
              class="open"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dayNewLpointOthers" align="center" label="others日新增储值TWD">
          <template slot-scope="scope">
            <div
              v-for="item of scope.row.dayNewLpointOthers"
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
import { lpGmDateStoreReport, download } from '@/api/lpmain/gmDateStoreReport'
import { downloadFile, parseTimes } from '@/utils/index'
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
      getSelectData: '',
      isShowTime: true,
      isVisible: false,
      isHidd: false,
      startrtime: '',
      endrtime: ''
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
  height: 30.5px !important;
  width: 230px !important;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  border-radius: 4px;
  padding: 0 15px;
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
    width: 39%;
    text-align: center;
    font-size: 14px;
    color: #606266;
  }
  .closeInp {
    position: absolute;
    top: 0.5rem;
    right: 0.35rem;
    font-size: 14px;
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
