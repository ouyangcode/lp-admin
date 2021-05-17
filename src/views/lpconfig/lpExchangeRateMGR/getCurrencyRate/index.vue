<template>
  <div class="main">
    <div class="server">
      <div class="change_title">货币兑换L点查询</div>
      <div class="change_box">
        <div class="userId">
          <div class="userid_left">请选择货币:</div>
          <div class="userid_right">
            <el-select
              v-model="getCurrency"
              clearable
              size="small"
              placeholder="请选择货币"
              class="filter-item"
              style="width: 150px"
            >
              <el-option
                v-for="item in statusList"
                :key="item.key"
                :label="item.type"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
        <div class="userpoint">
          <div class="userid_left">请输入金额:</div>
          <div class="userid_right">
            <el-input
              v-model="inpPoint"
              clearable
              placeholder="金额"
              style="width: 200px"
              class="filter-item"
            />
            <el-button type="primary" icon="el-icon-search" @click="getPointForSev">查询</el-button>
          </div>
        </div>
        <div class="getPoint">
          <div class="userid_left" />
          <div class="userid_right">
            <el-input
              v-model="getPoint"
              disabled
              clearable
              style="width: 200px; color:red;"
              class="filter-item"
            />
          </div>
        </div>
        <div class="gotPoint">
          支付寶玩家匯款(3000以上返15%&nbsp;&nbsp;1000-2999以上返10%&nbsp;&nbsp;500-999返 5%)
        </div>
        <div class="sendPoint">
          <div class="sendPoint_left">请输入金额:</div>
          <div class="sendPoint_right">
            <el-input
              v-model="inpPointCny"
              clearable
              placeholder="请输入人民币"
              style="width: 200px"
              class="filter-item"
            />
            <el-button type="primary" icon="el-icon-search" @click="getPointForCNY('CNYtoUSD')">查询</el-button>
          </div>
        </div>
        <div class="singer">
          <div class="singer_left" />
          <div class="singer_right">
            <el-input
              v-model="getCnCoin"
              disabled
              clearable
              style="width: 200px; color:red;"
              class="filter-item"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPoint } from '@/api/lpconfig/commonconfig/getCurrencyRate'
export default {
  data() {
    return {
      userinfo: {
        passport: null,
        singer: null,
        gotPoint: null,
        sendPoint: null,
        key_md: null
      },
      getCurrency: null,
      getCnCoin: null,
      inpPoint: '',
      inpPointCny: null,
      getPoint: null,
      statusList: [
        { id: 'HKDtoUSD', type: '港幣' },
        { id: 'MYRtoUSD', type: '馬幣' },
        { id: 'USDtoLpoint', type: '美金' },
        { id: 'TWDtoLpoint', type: '台幣' },
        { id: 'THDtoUSD', type: '泰銖' },
        { id: 'CNYtoUSD', type: '人民幣' },
        { id: 'SGDtoUSD', type: '新加坡幣' },
        { id: 'IDRtoUSD', type: '印尼盾' }
      ]
    }
  },
  methods: {
    getPointForSev() {
      if (this.getCurrency) {
        getPoint(this.getCurrency).then(res => {
          if (res.code === '3') {
            var USDtoLpoint = res.USDtoLpoint
            if (this.getCurrency === 'USDtoLpoint' || this.getCurrency === 'TWDtoLpoint') {
              this.getPoint = Math.round(this.inpPoint * parseFloat(res.rate))
            } else {
              this.getPoint = Math.round(this.inpPoint * parseFloat(res.rate) * parseInt(USDtoLpoint))
            }
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
      } else {
        this.$message({
          message: '请选择币种',
          type: 'warning'
        })
      }
    },
    getPointForCNY(data) {
      getPoint(data).then(res => {
        if (res.code === '3') {
          var USDtoLpoint = res.USDtoLpoint
          var lpoint = Math.round(this.inpPointCny * parseFloat(res.rate) * parseInt(USDtoLpoint))

          if (this.inpPointCny >= 3000) {
            lpoint = lpoint * 0.15 + lpoint
          } else if (this.inpPointCny >= 1000) {
            lpoint = lpoint * 0.10 + lpoint
          } else if (this.inpPointCny >= 500) {
            lpoint = lpoint * 0.05 + lpoint
          }
          this.getCnCoin = lpoint
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input.is-disabled .el-input__inner{
      background-color: #f5f7fa;
    border-color: #dfe4ed;
    color: red;
    cursor: not-allowed;
    }
.server {
  width: 90%;
  background: #f9f9f9;
  margin: 10px auto;
  border-radius: 15px 15px 0 0;
  .change_title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #f4f4f4;
    border-radius: 15px 15px 0 0;
  }
  .change_box {
    width: 100%;
    padding: 0 10px;
    margin-top: 15px;
    .userId {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ccc;

      .userid_left {
        flex: 1;
        height: 60px;
        line-height: 60px;
        text-align: right;
        border-right: 1px solid #ccc;
        padding-right: 10px;
      }
      .userid_right {
        flex: 1;
        display: inline-block;
        padding-left: 10px;
      }
    }
    .userpoint {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ccc;
      border-top: none;
      .userid_left {
        flex: 1;
        height: 60px;
        line-height: 60px;
        text-align: right;
        border-right: 1px solid #ccc;
        padding-right: 10px;
      }
      .userid_right {
        flex: 1;
        display: inline-block;
        padding-left: 10px;
      }
    }
    .getPoint {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ccc;
      border-top: none;
      .userid_left {
        flex: 1;
        height: 60px;
        line-height: 60px;
        text-align: right;
        border-right: 1px solid #ccc;
        padding-right: 10px;
      }
      .userid_right {
        flex: 1;
        display: inline-block;
        padding-left: 10px;
      }
    }
    .singer {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ccc;
      border-top: none;

      .singer_left {
        flex: 1;
        height: 60px;
        line-height: 60px;
        text-align: right;
        border-right: 1px solid #ccc;
        padding-right: 10px;
      }
      .singer_right {
        flex: 1;
        display: inline-block;
        padding-left: 10px;
      }
    }
    .gotPoint {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #ccc;
      border-top: none;

    }
    .sendPoint {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ccc;
      border-bottom: none;
      border-top: none;

      .sendPoint_left {
        flex: 1;
        height: 60px;
        line-height: 60px;
        text-align: right;
        border-right: 1px solid #ccc;
        padding-right: 10px;
      }
      .sendPoint_right {
        flex: 1;
        display: inline-block;
        padding-left: 10px;
      }
    }
    .key_md {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ccc;

      .key_md_left {
        flex: 1;
        height: 60px;
        line-height: 60px;
        text-align: right;
        border-right: 1px solid #ccc;
        padding-right: 10px;
      }
      .key_md_right {
        flex: 1;
        display: inline-block;
        padding-left: 10px;
      }
    }
    .suer {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ccc;
      border-top: none;

      .suer_left {
        flex: 1;
        height: 60px;
        line-height: 60px;
        text-align: right;
        border-right: 1px solid #ccc;
        margin: 0 10px;
      }
      .suer_right {
        flex: 1;
        display: inline-block;
      }
    }
  }
}

@media screen and (max-width:486px) {
  .server {
  width: 90%;
  background: #f9f9f9;
  margin: 10px auto;
  border-radius: 15px 15px 0 0;
  .change_title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #f4f4f4;
    border-radius: 15px 15px 0 0;
  }
  .change_box {
    width: 100%;
    padding: 0 10px;
    margin-top: 15px;
    .userId {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ccc;

      .userid_left {
        flex: 1;
        height: 60px;
        line-height: 60px;
        text-align: right;
        border-right: 1px solid #ccc;
        padding-right: 10px;
        display: none;
      }
      .userid_right {
        flex: 1;
        display: inline-block;
        padding-left: 10px;
      }
    }
    .singer {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ccc;
      border-top: none;

      .singer_left {
        flex: 1;
        height: 60px;
        line-height: 60px;
        text-align: right;
        border-right: 1px solid #ccc;
        padding-right: 10px;
        display: none;
      }
      .singer_right {
        flex: 1;
        display: inline-block;
        padding-left: 10px;
      }
    }
    .gotPoint {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ccc;
      border-bottom: none;
      border-top: none;

      .gotPoint_left {
        flex: 1;
        height: 60px;
        line-height: 60px;
        text-align: right;
        border-right: 1px solid #ccc;
        padding-right: 10px;
        display: none;
      }
      .gotPoint_right {
        flex: 1;
        display: inline-block;
        padding-left: 10px;
      }
    }
    .sendPoint {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ccc;
      border-top: none;

      .sendPoint_left {
        flex: 1;
        height: 60px;
        line-height: 60px;
        text-align: right;
        border-right: 1px solid #ccc;
        padding-right: 10px;
        display: none;
      }
      .sendPoint_right {
        flex: 1;
        display: inline-block;
        padding-left: 10px;
      }
    }
  }
}
}
</style>
