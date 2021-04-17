<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.passport" clearable placeholder="转出passport" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.gotopassport" clearable placeholder="接收passport" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.remark" clearable placeholder="备注" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
        <el-button
          v-if="crud.optShow.download"
          :loading="crud.downloadLoading"
          :disabled="!checkPer(['admin','lptransactionpointcheck:add'])"
          class="filter-item postin"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="addGameInfo()"
        >申请转点</el-button>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog
        :visible.sync="isShowDelg"
        width="500px"
        top="25vh"
        height="45%"
        :title="delogTitle"
        :before-close="beforClose"
      >
        <el-form ref="form" :model="scopeData" :rules="rules" size="small" label-width="130px">
          <el-form-item v-if="isShowChec" label="转出点数passport">
            <el-input v-model="scopeData.passport" style="width: 50%;" />
          </el-form-item>
          <el-form-item v-if="isShowTip" label="id">
            <el-input v-model="scopeData.id" disabled style="width: 50%;" />
          </el-form-item>
          <el-form-item v-if="isShowChec" label="接收点数passport">
            <el-input v-model="scopeData.gotoPassport" style="width: 50%;" />
          </el-form-item>
          <el-form-item v-if="isShowChec" label="点数">
            <el-input v-model="scopeData.lpoint" style="width: 50%;" />
          </el-form-item>
          <el-form-item label="密钥">
            <el-input v-model="scopeData.vercodeKey" style="width: 50%;" />
          </el-form-item>
          <el-form-item v-if="isShowChec" label="备注">
            <el-input v-model="scopeData.remark" style="width: 50%;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="closeTip">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="getServiceValue">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" border :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column align="center" prop="index" label="序号" />
        <el-table-column align="center" prop="passport" label="passport" width="160px" />
        <el-table-column align="center" prop="gotopassport" label="接收点的账户" width="160px" />
        <el-table-column align="center" prop="addr1" label="点数" />
        <el-table-column v-if="isShow" align="center" prop="lpoint" label="点数" />
        <el-table-column align="center" prop="roleid" label="角色ID" />
        <el-table-column align="center" prop="rolename" label="角色名" />
        <el-table-column align="center" prop="createtime" label="创建时间" width="150px" />
        <el-table-column align="center" prop="confimroleid" label="确认人id" />
        <el-table-column align="center" prop="confimrolename" label="确认人名字" width="110px" />
        <el-table-column align="center" prop="confimtime" label="确认时间" width="150px" />
        <el-table-column align="center" prop="status" label="状态" />
        <el-table-column align="center" prop="ipaddress" label="申请IP" width="130px" />
        <el-table-column align="center" prop="confimipaddress" label="确认IP" width="130px" />
        <el-table-column align="center" prop="addr2" label="addr2" />
        <el-table-column align="center" prop="remark" label="备注" />
        <el-table-column fixed="right" align="center" label="操作" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 1 || scope.row.status === 2">{{ "已经审核" }}</div>
            <div v-if="scope.row.status === 0">
              <el-popover
                placement="bottom-end"
                popper-class="chProo"
                trigger="click"
              >
                <el-button slot="reference" size="mini" icon="el-icon-setting">
                  <i class="fa fa-caret-down" aria-hidden="true" />
                </el-button>
                <div class="dise">
                  <div class="edit">
                    <el-button
                      size="mini"
                      :disabled="!checkPer(['admin','lptransactionpointcheck:agree'])"
                      type="primary"
                      icon="el-icon-edit"
                      @click="agreeTrUserPoint(scope.row)"
                    >确认转点</el-button>
                  </div>
                  <div class="edit">
                    <el-button
                      size="mini"
                      :disabled="!checkPer(['admin','lptransactionpointcheck:refuse'])"
                      type="warning"
                      icon="el-icon-edit"
                      @click="refuseTrUserPoint(scope.row)"
                    >拒绝转点</el-button>
                  </div>
                </div>
              </el-popover>
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
import { crudLptransactionpointcheck, refuseTrUserPoint, agreeTrUserPoint, createTrUserPoint } from '@/api/lpitmgr/transferPoints/lptransactionpointcheck'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, passport: null, gotopassport: null, roleid: null, rolename: null, createtime: null, confimroleid: null, confimrolename: null, confimtime: null, status: null, ipaddress: null, confimipaddress: null, addr1: null, addr2: null, lpoint: null, remark: null }
export default {
  name: 'LpTransactionpointcheck',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '客服转点申请', url: '/api/lpTransactionpointcheck/getLpTransactionpointcheckList', idField: 'id', sort: 'id,desc', crudMethod: { ...crudLptransactionpointcheck }})
  },
  data() {
    return {
      isShowDelg: false,
      isShow: false,
      isShowTip: false,
      isShowChec: false,
      permission: {
        add: ['admin', 'lptransactionpointcheck:add'],
        edit: ['admin', 'lptransactionpointcheck:edit'],
        del: ['admin', 'lptransactionpointcheck:del']
      },
      rules: {
        passportFrom: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        passportTo: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        point: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        operateUser: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        crtime: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      scopeData: {
        id: null,
        vercodeKey: null,
        passport: null,
        gotoPassport: null,
        lpoint: null,
        remark: null
      },
      queryTypeOptions: [
        { key: 'passport', display_name: 'passport' },
        { key: 'gotopassport', display_name: 'gotopassport' },
        { key: 'remark', display_name: 'remark' }
      ],
      curdHook: '',
      delogTitle: ''
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    agreeTrUserPoint(data) {
      this.isShowDelg = !this.isShowDelg
      this.isShowTip = true
      this.curdHook = 'agreeTrUserPoint'
      this.delogTitle = '确认转点'
      this.scopeData.id = data.id
    },
    refuseTrUserPoint(data) {
      this.isShowDelg = !this.isShowDelg
      this.isShowTip = true
      this.curdHook = 'refuseTrUserPoint'
      this.delogTitle = '拒绝转点'
      this.scopeData.id = data.id
    },
    addGameInfo() {
      for (var key in this.scopeData) {
        this.scopeData[key] = null
      }
      this.isShowDelg = !this.isShowDelg
      this.isShowChec = true
      this.crud.refresh()
      this.curdHook = 'add'
      this.delogTitle = '转点申请'
    },
    closeTip() {
      this.isShowDelg = !this.isShowDelg
      this.scopeData.vercodeKey = ''
      if (this.isShowTip || this.isShowChec) {
        this.isShowTip = false
        this.isShowChec = false
      }
    },
    beforClose() {
      this.isShowDelg = !this.isShowDelg
      this.scopeData.vercodeKey = ''
      if (this.isShowTip || this.isShowChec) {
        this.isShowTip = false
        this.isShowChec = false
      }
    },
    getServiceValue() {
      switch (this.curdHook) {
        case 'add':
          createTrUserPoint(this.scopeData).then((res) => {
            this.crud.addSuccessNotify()
            this.isShowDelg = !this.isShowDelg
            for (var key in this.scopeData) {
              this.scopeData[key] = null
            }
            if (this.isShowChec) {
              this.isShowChec = false
            }
            this.crud.notify(res.msg, CRUD.NOTIFICATION_TYPE.SUCCESS)
            this.crud.refresh()
          })
          break
        case 'agreeTrUserPoint':
          if (this.scopeData.id && this.scopeData.vercodeKey) {
            agreeTrUserPoint(this.scopeData).then(
              (res) => {
                if (res.status === 2) {
                  this.crud.notify(res.msg, CRUD.NOTIFICATION_TYPE.ERROR)
                } else {
                  this.crud.notify(res.msg, CRUD.NOTIFICATION_TYPE.SUCCESS)
                }
                this.crud.refresh()
                this.scopeData.vercodeKey = ''
                if (this.isShowTip) {
                  this.isShowTip = false
                }
                this.isShowDelg = !this.isShowDelg
              }
            )
          } else {
            this.$message({
              message: '请填入必填参数',
              type: 'warning'
            })
          }
          break
        case 'refuseTrUserPoint':
          if (
            this.scopeData.id &&
            this.scopeData.vercodeKey
          ) {
            refuseTrUserPoint(
              this.scopeData
            ).then((res) => {
              if (res.status === 2) {
                this.crud.notify(res.msg, CRUD.NOTIFICATION_TYPE.ERROR)
              } else {
                this.crud.notify('设置成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
              }

              this.crud.refresh()
              this.scopeData.vercodeKey = ''
              if (this.isShowTip) {
                this.isShowTip = false
              }
              this.isShowDelg = !this.isShowDelg
            })
          } else {
            this.$message({
              message: '请填入必填参数',
              type: 'warning'
            })
          }
          break
      }
    },
    renderTree(column, $index) {
      console.log(column)
      console.log($index)
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

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .crud-opts-left {
  display: none;
}
.dise {
  display: flex !important;
  flex-direction: column !important;
  .edit {
    margin-bottom: 10px;
  }
}
.postin {
  position: absolute;
}
.game {
  padding: 10px;
}
::v-deep .el-dialog__wrapper {
  .el-dialog {
    height: 50%;
    overflow: auto;
    .el-dialog__header {
      padding: 6px;
      padding-bottom: 10px;
      background: #438eb9;
      .el-dialog__title {
        line-height: 24px;
        font-size: 18px;
        color: #fff;
      }
      .el-dialog__headerbtn {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 0;
        background: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        font-size: 16px;
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
          line-height: 30px;
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
    }
  }
}
</style>
