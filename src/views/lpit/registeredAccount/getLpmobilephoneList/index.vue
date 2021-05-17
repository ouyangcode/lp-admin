<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.phonenumber" clearable placeholder="phonenumber" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-date-picker
          v-model="query.exdate"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-select
          v-model="query.cardkind"
          clearable
          size="small"
          placeholder="卡的用途"
          class="filter-item"
          style="width: 100px"
        >
          <el-option
            v-for="item in cardList"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="query.isdisable"
          clearable
          size="small"
          placeholder="是否删除"
          class="filter-item"
          style="width: 120px"
        >
          <el-option
            v-for="item in isdisableList"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <rrOperation :crud="crud" />
        <el-button
          v-if="crud.optShow.download"
          :loading="crud.downloadLoading"
          :disabled="!checkPer(['admin','lpmobilephone:add'])"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="addGameInfo()"
        >新增</el-button>
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
      </div>

      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog
        :visible.sync="isShowDelg"
        :rules="rules"
        width="750px"
        top="1vh"
        height="95%"
        :title="dlogTitle"
      >
        <el-form
          ref="form"
          :model="scopeData"
          :rules="rules"
          size="small"
          label-width="120px"
        >
          <el-form-item label="phonenumber">
            <el-input v-model="scopeData.phonenumber" placeholder="请输入电话号码" style="width: 80%" />
          </el-form-item>
          <el-form-item label="FB使用">
            <el-radio v-model="scopeData.fbuse" :label="1">否</el-radio>
            <el-radio v-model="scopeData.fbuse" :label="0">是</el-radio>
            <el-radio v-model="scopeData.fbuse" :label="2">废</el-radio>
          </el-form-item>
          <el-form-item label="GP使用">
            <el-radio v-model="scopeData.gpuse" :label="1">否</el-radio>
            <el-radio v-model="scopeData.gpuse" :label="0">是</el-radio>
            <el-radio v-model="scopeData.gpuse" :label="2">废</el-radio>
          </el-form-item>
          <el-form-item label="IOS使用">
            <el-radio v-model="scopeData.iosuse" :label="1">否</el-radio>
            <el-radio v-model="scopeData.iosuse" :label="0">是</el-radio>
            <el-radio v-model="scopeData.iosuse" :label="2">废</el-radio>
          </el-form-item>
          <el-form-item label="华为使用">
            <el-radio v-model="scopeData.huaweiuse" :label="1">否</el-radio>
            <el-radio v-model="scopeData.huaweiuse" :label="0">是</el-radio>
            <el-radio v-model="scopeData.huaweiuse" :label="2">废</el-radio>
          </el-form-item>
          <el-form-item label="微软使用">
            <el-radio v-model="scopeData.weiruanuse" :label="1">否</el-radio>
            <el-radio v-model="scopeData.weiruanuse" :label="0">是</el-radio>
            <el-radio v-model="scopeData.weiruanuse" :label="2">废</el-radio>
          </el-form-item>
          <el-form-item label="抖音使用">
            <el-radio v-model="scopeData.tiktokuse" :label="1">否</el-radio>
            <el-radio v-model="scopeData.tiktokuse" :label="0">是</el-radio>
            <el-radio v-model="scopeData.tiktokuse" :label="2">废</el-radio>
          </el-form-item>
          <el-form-item label="line使用">
            <el-radio v-model="scopeData.lineuse" :label="1">否</el-radio>
            <el-radio v-model="scopeData.lineuse" :label="0">是</el-radio>
            <el-radio v-model="scopeData.lineuse" :label="2">废</el-radio>
          </el-form-item>
          <el-form-item label="twitter使用">
            <el-radio v-model="scopeData.twitteruse" :label="1">否</el-radio>
            <el-radio v-model="scopeData.twitteruse" :label="0">是</el-radio>
            <el-radio v-model="scopeData.twitteruse" :label="2">废</el-radio>
          </el-form-item>
          <el-form-item label="八达通使用">
            <el-radio v-model="scopeData.badatonguse" :label="1">否</el-radio>
            <el-radio v-model="scopeData.badatonguse" :label="0">是</el-radio>
            <el-radio v-model="scopeData.badatonguse" :label="2">废</el-radio>
          </el-form-item>
          <el-form-item label="咖啡屋使用">
            <el-radio v-model="scopeData.cofeewuuse" :label="1">否</el-radio>
            <el-radio v-model="scopeData.cofeewuuse" :label="0">是</el-radio>
            <el-radio v-model="scopeData.cofeewuuse" :label="2">废</el-radio>
          </el-form-item>
          <el-form-item label="snapchat使用">
            <el-radio v-model="scopeData.snapchatuse" :label="1">否</el-radio>
            <el-radio v-model="scopeData.snapchatuse" :label="0">是</el-radio>
            <el-radio v-model="scopeData.snapchatuse" :label="2">废</el-radio>
          </el-form-item>
          <el-form-item label="其他用途">
            <el-radio v-model="scopeData.otheruse" :label="1">否</el-radio>
            <el-radio v-model="scopeData.otheruse" :label="0">是</el-radio>
            <el-radio v-model="scopeData.otheruse" :label="2">废</el-radio>
          </el-form-item>
          <el-form-item label="卡的用途">
            <el-radio v-model="scopeData.cardkind" :label="1">Skype</el-radio>
            <el-radio v-model="scopeData.cardkind" :label="2">国内卡</el-radio>
            <el-radio v-model="scopeData.cardkind" :label="3">香港卡</el-radio>
          </el-form-item>
          <el-form-item label="有效期">
            <el-date-picker v-model="scopeData.exdate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 50%;" />
          </el-form-item>
          <el-form-item label="说明">
            <el-input v-model="scopeData.cont" type="textarea" placeholder="请输入说明" style="width: 80%" />
          </el-form-item>
          <el-form-item label="是否删除">
            <el-radio v-model="scopeData.isdisable" :label="1">是</el-radio>
            <el-radio v-model="scopeData.isdisable" :label="0">否</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeTip">取消</el-button>
          <el-button
            :loading="crud.cu === 2"
            type="primary"
            @click="getServiceValue"
          >确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" border :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column align="center" prop="index" label="序号" />
        <el-table-column align="center" prop="phonenumber" label="电话号码" width="130px" />
        <el-table-column align="center" prop="exdate" label="有效期" width="150px" />
        <el-table-column align="center" prop="fbuse" label="FB使用" width="120px">
          <template slot-scope="scope">
            <div v-if="scope.row.fbuse === 0" style="color:#67C23A">{{ "是" }}</div>
            <div v-if="scope.row.fbuse === 1" style="color:#C0C4CC">{{ "否" }}</div>
            <div v-if="scope.row.fbuse === 2" style="color:#F56C6C">{{ "废" }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="gpuse" label="GP使用" width="120px">
          <template slot-scope="scope">
            <div v-if="scope.row.gpuse === 0" style="color:#67C23A">{{ "是" }}</div>
            <div v-if="scope.row.gpuse === 1" style="color:#C0C4CC">{{ "否" }}</div>
            <div v-if="scope.row.gpuse === 2" style="color:#F56C6C">{{ "废" }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="iosuse" label="IOS使用" width="120px">
          <template slot-scope="scope">
            <div v-if="scope.row.iosuse === 0" style="color:#67C23A">{{ "是" }}</div>
            <div v-if="scope.row.iosuse === 1" style="color:#C0C4CC">{{ "否" }}</div>
            <div v-if="scope.row.iosuse === 2" style="color:#F56C6C">{{ "废" }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="huaweiuse" label="华为使用" width="120px">
          <template slot-scope="scope">
            <div v-if="scope.row.huaweiuse === 0" style="color:#67C23A">{{ "是" }}</div>
            <div v-if="scope.row.huaweiuse === 1" style="color:#C0C4CC">{{ "否" }}</div>
            <div v-if="scope.row.huaweiuse === 2" style="color:#F56C6C">{{ "废" }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="weiruanuse" label="微软使用" width="120px">
          <template slot-scope="scope">
            <div v-if="scope.row.weiruanuse === 0" style="color:#67C23A">{{ "是" }}</div>
            <div v-if="scope.row.weiruanuse === 1" style="color:#C0C4CC">{{ "否" }}</div>
            <div v-if="scope.row.weiruanuse === 2" style="color:#F56C6C">{{ "废" }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="tiktokuse" align="center" label="抖音使用" width="120px">
          <template slot-scope="scope">
            <div v-if="scope.row.tiktokuse === 0" style="color:#67C23A">{{ "是" }}</div>
            <div v-if="scope.row.tiktokuse === 1" style="color:#C0C4CC">{{ "否" }}</div>
            <div v-if="scope.row.tiktokuse === 2" style="color:#F56C6C">{{ "废" }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="lineuse" align="center" label="line使用" width="120px">
          <template slot-scope="scope">
            <div v-if="scope.row.lineuse === 0" style="color:#67C23A">{{ "是" }}</div>
            <div v-if="scope.row.lineuse === 1" style="color:#C0C4CC">{{ "否" }}</div>
            <div v-if="scope.row.lineuse === 2" style="color:#F56C6C">{{ "废" }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="twitteruse" align="center" label="twitter使用" width="120px">
          <template slot-scope="scope">
            <div v-if="scope.row.twitteruse === 0" style="color:#67C23A">{{ "是" }}</div>
            <div v-if="scope.row.twitteruse === 1" style="color:#C0C4CC">{{ "否" }}</div>
            <div v-if="scope.row.twitteruse === 2" style="color:#F56C6C">{{ "废" }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="badatonguse" align="center" label="八达通使用" width="120px">
          <template slot-scope="scope">
            <div v-if="scope.row.badatonguse === 0" style="color:#67C23A">{{ "是" }}</div>
            <div v-if="scope.row.badatonguse === 1" style="color:#C0C4CC">{{ "否" }}</div>
            <div v-if="scope.row.badatonguse === 2" style="color:#F56C6C">{{ "废" }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="cofeewuuse" align="center" label="咖啡屋使用" width="120px">
          <template slot-scope="scope">
            <div v-if="scope.row.cofeewuuse === 0" style="color:#67C23A">{{ "是" }}</div>
            <div v-if="scope.row.cofeewuuse === 1" style="color:#C0C4CC">{{ "否" }}</div>
            <div v-if="scope.row.cofeewuuse === 2" style="color:#F56C6C">{{ "废" }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="otheruse" align="center" label="其他用途" width="120px">
          <template slot-scope="scope">
            <div v-if="scope.row.otheruse === 0" style="color:#67C23A">{{ "是" }}</div>
            <div v-if="scope.row.otheruse === 1" style="color:#C0C4CC">{{ "否" }}</div>
            <div v-if="scope.row.otheruse === 2" style="color:#F56C6C">{{ "废" }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="snapchatuse" align="center" label="snapchat使用" width="120px">
          <template slot-scope="scope">
            <div v-if="scope.row.snapchatuse === 0" style="color:#67C23A">{{ "是" }}</div>
            <div v-if="scope.row.snapchatuse === 1" style="color:#C0C4CC">{{ "否" }}</div>
            <div v-if="scope.row.snapchatuse === 2" style="color:#F56C6C">{{ "废" }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="cont" label="说明" width="130px" />
        <el-table-column align="center" prop="sdate" label="日期" width="150px" />
        <el-table-column align="center" prop="isdisable" label="是否删除">
          <template slot-scope="scope">
            <div v-if="scope.row.isdisable === 0">{{ "否" }}</div>
            <div v-if="scope.row.isdisable === 1">{{ "是" }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="cardkind" align="center" label="cardkind">
          <template slot-scope="scope">
            <div v-if="scope.row.cardkind === 1">{{ "Skype" }}</div>
            <div v-if="scope.row.cardkind === 2">{{ "国内卡" }}</div>
            <div v-if="scope.row.cardkind === 3">{{ "香港卡" }}</div>
          </template>
        </el-table-column>
        <el-table-column v-if="isShow" align="center" prop="ex1" label="ex1" />
        <el-table-column v-if="isShow" align="center" prop="ex2" label="ex2" />
        <el-table-column v-if="isShow" align="center" prop="ex3" label="ex3" />
        <el-table-column label="操作" width="90px" align="center" fixed="right">
          <template slot-scope="scope">
            <el-popover
              placement="bottom-end"
              popper-class="chProo"
              width="150px"
              trigger="click"
            >
              <el-button slot="reference" size="mini" icon="el-icon-setting">
                <i class="fa fa-caret-down" aria-hidden="true" />
              </el-button>
              <div class="dise">
                <div class="edit">
                  <el-button
                    size="mini"
                    type="primary"
                    :disabled="!checkPer(['admin','lpmobilephone:edit'])"
                    icon="el-icon-edit"
                    @click="editGameServerInfo(scope.row)"
                  >编辑</el-button>
                </div>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import { crudLpmobilephone, add, edit } from '@/api/lpitmgr/registeredAccount/getLpmobilephoneList'
import { download } from '@/api/data'
import { downloadFile, parseTime } from '@/utils/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, phonenumber: null, exdate: null, fbuse: null, gpuse: null, iosuse: null, huaweiuse: null, weiruanuse: null, tiktokuse: null, lineuse: null, twitteruse: null, badatonguse: null, cofeewuuse: null, otheruse: null, snapchatuse: null, cont: null, sdate: null, isdisable: null, cardkind: null, ex1: null, ex2: null, ex3: null }
export default {
  name: 'Lpmobilephone',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'lpmobilephone', url: '/api/lpmobilephone/getLpmobilephoneList', idField: 'id', sort: 'exdate,asc', crudMethod: { ...crudLpmobilephone }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'lpmobilephone:add'],
        edit: ['admin', 'lpmobilephone:edit'],
        del: ['admin', 'lpmobilephone:del']
      },
      rules: {
      },
      queryTypeOptions: [
        { key: 'phonenumber', display_name: 'phonenumber' },
        { key: 'isdisable', display_name: 'isdisable' }
      ],
      isdisableList: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      cardList: [
        { label: 'Skype', value: 1 },
        { label: '国内卡', value: 2 },
        { label: '香港卡', value: 3 }
      ],
      isShowDelg: false,
      isShow: false,
      scopeData: { id: null, phonenumber: null, exdate: null, fbuse: null, gpuse: null, iosuse: null, huaweiuse: null, weiruanuse: null, tiktokuse: null, lineuse: null, twitteruse: null, badatonguse: null, cofeewuuse: null, otheruse: null, snapchatuse: null, cont: null, sdate: null, isdisable: null, cardkind: null, ex1: null, ex2: null, ex3: null },
      curdHook: '',
      dlogTitle: ''
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    addGameInfo() {
      for (var key in this.scopeData) {
        this.scopeData[key] = null
      }
      this.isShowDelg = !this.isShowDelg
      this.crud.refresh()
      this.curdHook = 'add'
      this.dlogTitle = '新增'
    },
    editGameServerInfo(data) {
      console.log(data)
      this.isShowDelg = !this.isShowDelg
      this.scopeData = data
      this.curdHook = 'edit'
      this.dlogTitle = '编辑'
    },
    exportExels() {
      var params = this.crud.getQueryParams()
      params.gameCode = this.getSelectData
      this.crud.downloadLoading = true
      download('/api/lpmobilephone/download', params).then(result => {
        downloadFile(result, this.crud.title + '数据', 'xlsx')
        this.crud.downloadLoading = false
      }).catch(() => {
        this.crud.downloadLoading = false
      })
    },
    getServiceValue() {
      switch (this.curdHook) {
        case 'add':
          this.scopeData.exdate = parseTime(this.scopeData.exdate)
          this.scopeData.sdate = parseTime(new Date())
          add(this.scopeData).then((res) => {
            if (res.code === '1') {
              this.$notify({
                title: '警告',
                message: res.msg,
                type: 'warning'
              })
            } else {
              this.crud.addSuccessNotify()
            }
            this.isShowDelg = !this.isShowDelg
            for (var key in this.scopeData) {
              this.scopeData[key] = null
            }
            this.crud.refresh()
          })
          break
        case 'edit':
          console.log(this.scopeData)
          this.scopeData.sdate = parseTime(new Date())
          edit(this.scopeData)
            .then((res) => {
              if (res.code === '1') {
                this.$notify({
                  title: '警告',
                  message: res.msg,
                  type: 'warning'
                })
              } else {
                this.crud.editSuccessNotify()
              }

              this.isShowDelg = !this.isShowDelg
              for (var key in this.scopeData) {
                this.scopeData[key] = null
              }
              this.crud.refresh()
            })
            .catch((err) => {
              console.log(err)
            })
          break
      }
    },
    closeTip() {
      this.isShowDelg = !this.isShowDelg
      for (var key in this.scopeData) {
        this.scopeData[key] = null
      }
      this.crud.refresh()
    }
  }
}
</script>

<style lang="scss">
.el-popover.chProo {
  position: absolute;
  background: #fff;
  min-width: 100px;
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  padding: 12px;
  z-index: 2000;
  color: #606266;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  -webkit-box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  word-break: break-all;
  .popper__arrow {
    left: 78px !important;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped >
::v-deep .crud-opts-left {
  display: none;
}
.dise {
  display: flex;
  flex-direction: column;
  .edit {
    margin-bottom: 10px;
  }
  .del {
    margin-bottom: 10px;
  }
}

.postin {
  position: absolute;
}

::v-deep .el-dialog__wrapper {
  .el-dialog {
    height: 95%;
    overflow: auto;
    .el-dialog__header {
      padding: 20px;
      padding-bottom: 10px;
      background: #438eb9;
      .el-dialog__title {
        line-height: 24px;
        font-size: 18px;
        color: #fff;
      }
      .el-dialog__headerbtn {
        .el-dialog__close {
          color: #fff;
        }
      }
    }
    .el-dialog__body {
      padding: 0 1px;
      color: #606266;
      font-size: 14px;
      word-break: break-all;
      .el-form-item {
        margin-bottom: 5px;
        border-bottom: 1px solid #ccc;
        padding: 5px 0;
        .el-form-item__content {
          line-height: 40px;
          position: relative;
          font-size: 14px;
          border-left: 1px solid #ccc;
          padding: 0 10px;
        }
      }
    }
    .el-dialog__footer {
      padding: 20px;
      padding-top: 10px;
      text-align: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-bottom: 1px solid #ccc;
    }
  }
}
</style>

