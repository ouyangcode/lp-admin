import {
  initData,
  download
} from '@/api/data'
import { parseTime, parseTimes, downloadFile, setDefaultStratime, setDefaultEndtime } from '@/utils/index'
import Vue from 'vue'

/**
 * CRUD配置
 * @author moxun
 * @param {*} options <br>
 * @return crud instance.
 * @example
 * 要使用多crud时，请在关联crud的组件处使用crud-tag进行标记，如：<jobForm :job-status="dict.job_status" crud-tag="job" />
 */
function CRUD(options) {
  const defaultOptions = {
    tag: 'default',
    target: null,
    // id字段名
    idField: 'id',
    // 标题
    title: '',
    // 请求数据的url
    url: '',
    getQueryTitle: '',
    // 表格数据
    data: [],
    isBlack: false,
    isWhite: false,
    // 筛选
    fillterData: [],
    spoeData: [],
    gameCodeList: [],
    channelList: [],
    sortId: null,
    // 选择项
    selections: [],
    // 待查询的对象
    query: {},
    // 查询数据的参数
    params: {},
    defaultStart: null,
    defaultEnd: null,
    renderTitle: null,
    // Form 表单
    form: {},
    // 重置表单
    defaultForm: () => {},
    // 排序规则，默认 id 降序， 支持多字段排序 ['id,desc', 'createTime,asc']
    sort: ['id,desc'],
    // 等待时间
    time: 50,
    // CRUD Method
    crudMethod: {
      add: (form) => {},
      del: (id) => {},
      edit: (form) => {},
      get: (id) => {}
    },
    // 主页操作栏显示哪些按钮
    optShow: {
      add: true,
      edit: true,
      del: true,
      download: true,
      reset: true
    },
    // 自定义一些扩展属性
    props: {},
    // 在主页准备
    queryOnPresenterCreated: true,
    // 调试开关
    debug: false
  }
  options = mergeOptions(defaultOptions, options)
  const data = {
    ...options,
    // 记录数据状态
    dataStatus: {},
    status: {
      add: CRUD.STATUS.NORMAL,
      edit: CRUD.STATUS.NORMAL,
      // 添加或编辑状态
      get cu() {
        if (this.add === CRUD.STATUS.NORMAL && this.edit === CRUD.STATUS.NORMAL) {
          return CRUD.STATUS.NORMAL
        } else if (this.add === CRUD.STATUS.PREPARED || this.edit === CRUD.STATUS.PREPARED) {
          return CRUD.STATUS.PREPARED
        } else if (this.add === CRUD.STATUS.PROCESSING || this.edit === CRUD.STATUS.PROCESSING) {
          return CRUD.STATUS.PROCESSING
        }
        throw new Error('wrong crud\'s cu status')
      },
      // 标题
      get title() {
        return this.add > CRUD.STATUS.NORMAL ? `新增${crud.title}` : this.edit > CRUD.STATUS.NORMAL ? `编辑${crud.title}` : crud.title
      }
    },
    msg: {
      submit: '提交成功',
      add: '新增成功',
      edit: '编辑成功',
      del: '删除成功'
    },
    page: {
      // 页码
      page: 0,
      // 每页数据条数
      size: 10,
      // 总数据条数
      total: 0
    },
    // 整体loading
    loading: false,
    // 导出的 Loading
    downloadLoading: false,
    // 删除的 Loading
    delAllLoading: false
  }
  const methods = {
    /**
     * 通用的提示
     */
    submitSuccessNotify() {
      crud.notify(crud.msg.submit, CRUD.NOTIFICATION_TYPE.SUCCESS)
    },
    addSuccessNotify() {
      crud.notify(crud.msg.add, CRUD.NOTIFICATION_TYPE.SUCCESS)
    },
    editSuccessNotify() {
      crud.notify(crud.msg.edit, CRUD.NOTIFICATION_TYPE.SUCCESS)
    },
    delSuccessNotify() {
      crud.notify(crud.msg.del, CRUD.NOTIFICATION_TYPE.SUCCESS)
    },
    // 搜索
    toQuery() {
      crud.page.page = 1
      crud.refresh()
    },
    // 刷新
    refresh() {
      if (!callVmHook(crud, CRUD.HOOK.beforeRefresh)) {
        return
      }
      return new Promise((resolve, reject) => {
        crud.loading = true
        // 请求数据
        initData(crud.url, crud.getQueryParams()).then(data => {
          const table = crud.getTable()
          if (table && table.lazy) { // 懒加载子节点数据，清掉已加载的数据
            table.store.states.treeData = {}
            table.store.states.lazyTreeNodeMap = {}
          }
          if (crud.getQueryParams().gameCode && crud.getQueryParams().packageName) {
            crud.getQueryTitle = 'ip,passport'
          }
          if (crud.getQueryParams().gameCode && crud.getQueryParams().packageName && crud.getQueryParams().passport) {
            crud.getQueryTitle = 'ip,gameCode,packageName'
          }
          crud.page.total = data.totalElements
          var date = new Date()
          var year = date.getFullYear()
          var yearTotalArray = []
          var yearArray = []
          const toObject = {}
          var n = 0
          for (var i = 2012; i <= year; i++) {
            yearArray[n] = i
            yearTotalArray[i] = 0
            n++
          }
          var toExep = /^\/api\/detectThirdPartyPayOpen\//
          if (crud.url === 'api/gmPayGameYearReport/reportList') {
            console.log(data.rst.rstMap)
            var values = Object.values(data.rst.rstMap)
            var keys = Object.keys(data.rst.rstMap)
            values.forEach((item, index) => {
              item.gameCode = keys[index]
            })

            for (var key in data.rst.rstMap) {
              var value = data.rst.rstMap[key]
              yearArray.forEach((res, keys) => {
                var yvalue = value[yearArray[keys]]
                if (yvalue != null && yvalue !== undefined) {
                  yvalue = Math.round(yvalue)
                  yearTotalArray[yearArray[keys]] = yearTotalArray[yearArray[keys]] + yvalue
                }
              })
            }

            yearTotalArray.forEach((item, index) => {
              toObject[index] = item
            })
            crud.fillterData = [toObject]
            crud.data = values
          } else if (crud.url === '/api/detectPay/getALLUserAllowPayDevice') {
            if (data.content[0].code === '003') {
              crud.data = []
            } else {
              var arrs = []
              var infoMap = data.content[0].rst.deviceValue

              crud.data = crud.putObject(infoMap)
              console.log(crud.data)
            }
          } else if (crud.url === '/api/detectPay/getAllPayDeviceAllUserID') {
            if (data.content[0].code === '003') {
              crud.data = []
            } else {
              infoMap = data.content[0].rst.rst
              crud.data = crud.putObjectT(infoMap)
              console.log(crud.data)
            }
          } else if (crud.url === '/api/detectPay/getAllCollectCurrencyPayIOS') {
            if (data.content[0].code === '003') {
              crud.data = []
            } else {
              infoMap = data.content[0].rst.currencyValue

              crud.data = crud.putObjectT(infoMap)
              console.log(crud.data)
            }
          } else if (crud.url === '/api/detectPay/getAllowCurrencyPayIOS') {
            if (data.content[0].code === '003') {
              crud.data = []
            } else {
              arrs = []
              infoMap = data.content[0].rst.currencyValue
              infoMap.forEach((item, index) => {
                arrs[index] = {
                  objKey: item[0],
                  objVal: item[1]
                }
              })
              arrs = (infoMap)
              crud.data = arrs
              console.log(crud.data)
            }
          } else if (toExep.test(crud.url)) {
            if (data.content[0].code === '004') {
              crud.data = []
            } else {
              infoMap = data.content[0].rst.rstMap

              crud.data = crud.putObjectT(infoMap, crud.url)
              console.log(crud.data)
            }
          } else if (crud.url === '/api/lpuserGamelimit/getLpuserGamelimitList') {
            crud.data = data.content
            var shiftData = { gameName: '所有游戏', gameCode: 'allgame' }
            data.gameCodeList.unshift(shiftData)
            crud.data.gameCodeList = data.gameCodeList
          } else if (crud.url === '/api/gmDateRetainedReport/reportList') {
            if (Object.keys(data.content).length === 0) {
              crud.data = []
            } else {
              var daySort
              var getDataLength = Object.keys(data.content).length
              if (crud.getQueryParams().sdate) {
                daySort = crud.getDataSort(new Date(crud.getQueryParams().sdate[0]), new Date(crud.getQueryParams().sdate[1]))
              } else {
                daySort = crud.getDataSort(getDataLength)
              }
              var setarr = []
              arrs = []
              var dateList = Object.keys(data.content)
              daySort.timeList.forEach((item, index) => {
                setarr[index] = data.content[item]
                dateList.forEach((items, indexs) => {
                  if (item === items) {
                    setarr.forEach((sz, szindex) => {
                      sz.forEach((data, i) => {
                        sz[i] = (sz[i] * 100).toFixed(2)
                        arrs[index] = {
                          date: items,
                          index0: sz[0],
                          index1: sz[1],
                          index2: sz[2],
                          index3: sz[3],
                          index4: sz[4],
                          index5: sz[5],
                          index6: sz[6],
                          index7: sz[7],
                          index8: sz[8],
                          index9: sz[9],
                          index10: sz[10],
                          index11: sz[11],
                          index12: sz[12],
                          index13: sz[13],
                          index14: sz[14],
                          index15: sz[15],
                          index16: sz[16]
                        }
                      })
                    })
                  }
                })
              })
              crud.data = arrs
              console.log(crud.data)
            }
          } else if (crud.url === '/api/gmDateLTVReport/reportList') {
            if (Object.keys(data.content).length === 0) {
              crud.data = []
            } else {
              getDataLength = Object.keys(data.content).length
              console.log(getDataLength)
              daySort
              if (crud.getQueryParams().sdate) {
                daySort = crud.getDataSort(new Date(crud.getQueryParams().sdate[0]), new Date(crud.getQueryParams().sdate[1]))
              } else {
                daySort = crud.getDataSort(getDataLength)
              }
              console.log(daySort)
              setarr = []
              arrs = []
              dateList = Object.keys(data.content)
              daySort.timeList.forEach((item, index) => {
                setarr[index] = data.content[item]
                dateList.forEach((items, indexs) => {
                  if (item === items) {
                    setarr.forEach((sz, szindex) => {
                      sz.forEach((data, i) => {
                        arrs[index] = {
                          date: items,
                          index0: sz[0],
                          index1: sz[1],
                          index2: sz[2],
                          index3: sz[3],
                          index4: sz[4],
                          index5: sz[5],
                          index6: sz[6],
                          index7: sz[7],
                          index8: sz[8],
                          index9: sz[9],
                          index10: sz[10],
                          index11: sz[11],
                          index12: sz[12]
                        }
                      })
                    })
                  }
                })
              })
              crud.data = arrs
              console.log(crud.data)
            }
          } else {
            data.content.forEach((item, index) => {
              item.index = (crud.page.page - 1) * crud.page.size + index + 1
            })
            crud.data = data.content
            crud.data.gameCodeList = data.gameCodeList
            crud.data.channelList = data.channelList
          }
          crud.resetDataStatus()
          // time 毫秒后显示表格
          setTimeout(() => {
            crud.loading = false
            callVmHook(crud, CRUD.HOOK.afterRefresh)
          }, crud.time)
          resolve(data)
        }).catch(err => {
          crud.loading = false
          reject(err)
        })
      })
    },
    /**
     * 将后端传过来的数据优化
     */
    putObject(obj) {
      const getArr = Object.entries(obj)
      var arrs = []
      var valueForObj
      var isBloc
      getArr.forEach((item, index) => {
        valueForObj = item[1].split(',')
        if (valueForObj[0] === 'notAllow' || valueForObj[0] === 'forbidden') {
          isBloc = true
        } else {
          isBloc = false
        }
        arrs[index] = {
          objKey: item[0],
          objVal: item[1],
          isshow: isBloc
        }
      })

      return arrs
    },
    /** 获取时间差 */
    getDataSort(stime, etime) {
      var diff = etime - stime
      var days = Math.ceil(diff / (24 * 3600 * 1000))
      var first
      var getDay
      var nowDay
      var timeList = []
      var upData = {}
      if (stime && etime) {
        first = stime.getTime()
        for (let i = 0; i < days; i++) {
          getDay = first + (i * 3600 * 1000 * 24)
          timeList[i] = parseTimes(getDay)
        }
      } else {
        nowDay = new Date().getTime()
        first = nowDay - (arguments[0] * 3600 * 1000 * 24)
        for (let i = 1; i <= arguments[0]; i++) {
          getDay = first + (i * 3600 * 1000 * 24)
          timeList[i] = parseTimes(getDay)
        }
      }

      upData.timeList = timeList
      upData.length = days
      return upData
    },
    putObjectT(obj, url) {
      const getArr = Object.entries(obj)
      var arrs = []
      if (url === '/api/detectThirdPartyPayOpen/getUserGooglePayInfo') {
        arrs.push(obj)
      } else {
        getArr.forEach((item, index) => {
          arrs[index] = {
            id: index,
            objKey: item[0],
            objVal: item[1]
          }
        })
      }

      return arrs
    },

    /**
     * 启动添加
     */
    toAdd() {
      crud.resetForm()
      if (!(callVmHook(crud, CRUD.HOOK.beforeToAdd, crud.form) && callVmHook(crud, CRUD.HOOK.beforeToCU, crud.form))) {
        return
      }
      crud.status.add = CRUD.STATUS.PREPARED
      callVmHook(crud, CRUD.HOOK.afterToAdd, crud.form)
      callVmHook(crud, CRUD.HOOK.afterToCU, crud.form)
    },
    /**
     * 启动编辑
     * @param {*} data 数据项
     */
    toEdit(data) {
      crud.resetForm(JSON.parse(JSON.stringify(data)))
      if (!(callVmHook(crud, CRUD.HOOK.beforeToEdit, crud.form) && callVmHook(crud, CRUD.HOOK.beforeToCU, crud.form))) {
        return
      }
      crud.status.edit = CRUD.STATUS.PREPARED
      crud.getDataStatus(crud.getDataId(data)).edit = CRUD.STATUS.PREPARED
      callVmHook(crud, CRUD.HOOK.afterToEdit, crud.form)
      callVmHook(crud, CRUD.HOOK.afterToCU, crud.form)
    },
    /**
     * 启动删除
     * @param {*} data 数据项
     */
    toDelete(data) {
      crud.getDataStatus(crud.getDataId(data)).delete = CRUD.STATUS.PREPARED
    },
    /**
     * 取消删除
     * @param {*} data 数据项
     */
    cancelDelete(data) {
      if (!callVmHook(crud, CRUD.HOOK.beforeDeleteCancel, data)) {
        return
      }
      crud.getDataStatus(crud.getDataId(data)).delete = CRUD.STATUS.NORMAL
      callVmHook(crud, CRUD.HOOK.afterDeleteCancel, data)
    },
    /**
     * 取消新增/编辑
     */
    cancelCU() {
      const addStatus = crud.status.add
      const editStatus = crud.status.edit
      if (addStatus === CRUD.STATUS.PREPARED) {
        if (!callVmHook(crud, CRUD.HOOK.beforeAddCancel, crud.form)) {
          return
        }
        crud.status.add = CRUD.STATUS.NORMAL
      }
      if (editStatus === CRUD.STATUS.PREPARED) {
        if (!callVmHook(crud, CRUD.HOOK.beforeEditCancel, crud.form)) {
          return
        }
        crud.status.edit = CRUD.STATUS.NORMAL
        crud.getDataStatus(crud.getDataId(crud.form)).edit = CRUD.STATUS.NORMAL
      }
      crud.resetForm()
      if (addStatus === CRUD.STATUS.PREPARED) {
        callVmHook(crud, CRUD.HOOK.afterAddCancel, crud.form)
      }
      if (editStatus === CRUD.STATUS.PREPARED) {
        callVmHook(crud, CRUD.HOOK.afterEditCancel, crud.form)
      }
      // 清除表单验证
      if (crud.findVM('form').$refs['form']) {
        crud.findVM('form').$refs['form'].clearValidate()
      }
    },
    /**
     * 提交新增/编辑
     */
    submitCU() {
      if (!callVmHook(crud, CRUD.HOOK.beforeValidateCU)) {
        return
      }
      crud.findVM('form').$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        if (!callVmHook(crud, CRUD.HOOK.afterValidateCU)) {
          return
        }
        if (crud.status.add === CRUD.STATUS.PREPARED) {
          crud.doAdd()
        } else if (crud.status.edit === CRUD.STATUS.PREPARED) {
          crud.doEdit()
        }
      })
    },
    /**
     * 执行添加
     */
    doAdd() {
      if (!callVmHook(crud, CRUD.HOOK.beforeSubmit)) {
        return
      }
      crud.status.add = CRUD.STATUS.PROCESSING
      crud.crudMethod.add(crud.form).then(() => {
        crud.status.add = CRUD.STATUS.NORMAL
        crud.resetForm()
        crud.addSuccessNotify()
        callVmHook(crud, CRUD.HOOK.afterSubmit)
        crud.toQuery()
      }).catch(() => {
        crud.status.add = CRUD.STATUS.PREPARED
        callVmHook(crud, CRUD.HOOK.afterAddError)
      })
    },
    /**
     * 执行编辑
     */
    doEdit() {
      if (!callVmHook(crud, CRUD.HOOK.beforeSubmit)) {
        return
      }
      crud.status.edit = CRUD.STATUS.PROCESSING
      crud.crudMethod.edit(crud.form).then(() => {
        crud.status.edit = CRUD.STATUS.NORMAL
        crud.getDataStatus(crud.getDataId(crud.form)).edit = CRUD.STATUS.NORMAL
        crud.editSuccessNotify()
        crud.resetForm()
        callVmHook(crud, CRUD.HOOK.afterSubmit)
        crud.refresh()
      }).catch(() => {
        crud.status.edit = CRUD.STATUS.PREPARED
        callVmHook(crud, CRUD.HOOK.afterEditError)
      })
    },
    /**
     * 执行删除
     * @param {*} data 数据项
     */
    doDelete(data) {
      let delAll = false
      let dataStatus
      const ids = []
      if (data instanceof Array) {
        delAll = true
        data.forEach(val => {
          ids.push(this.getDataId(val))
        })
      } else {
        ids.push(this.getDataId(data))
        dataStatus = crud.getDataStatus(this.getDataId(data))
      }
      if (!callVmHook(crud, CRUD.HOOK.beforeDelete, data)) {
        return
      }
      if (!delAll) {
        dataStatus.delete = CRUD.STATUS.PROCESSING
      }
      return crud.crudMethod.del(ids).then(() => {
        if (delAll) {
          crud.delAllLoading = false
        } else dataStatus.delete = CRUD.STATUS.PREPARED
        crud.dleChangePage(1)
        crud.delSuccessNotify()
        callVmHook(crud, CRUD.HOOK.afterDelete, data)
        crud.refresh()
      }).catch(() => {
        if (delAll) {
          crud.delAllLoading = false
        } else dataStatus.delete = CRUD.STATUS.PREPARED
      })
    },
    /**
     * 通用导出
     */
    doExport() {
      crud.downloadLoading = true
      download('/api/gmDateReport/download', crud.getQueryParams()).then(result => {
        downloadFile(result, crud.title + '数据', 'xlsx')
        crud.downloadLoading = false
      }).catch(() => {
        crud.downloadLoading = false
      })
    },
    /**
     * 获取查询参数
     */
    getQueryParams: function() {
      // 清除参数无值的情况
      Object.keys(crud.query).length !== 0 && Object.keys(crud.query).forEach(item => {
        if (crud.query[item] === null || crud.query[item] === '') crud.query[item] = undefined
      })
      Object.keys(crud.params).length !== 0 && Object.keys(crud.params).forEach(item => {
        if (crud.params[item] === null || crud.params[item] === '') crud.params[item] = undefined
      })
      const getData = new Date()
      const getEndData = new Date()
      crud.defaultStart = setDefaultStratime(getData.setTime(getData.getTime() - 3600 * 1000 * 24 * 7))
      crud.defaultEnd = setDefaultEndtime(getEndData)
      if (crud.url === '/api/lpidcDomain/getLpidcDomainList') {
        return {
          page: crud.page.page - 1,
          size: crud.page.size,
          sort: crud.sort,
          tag: 0,
          ...crud.query,
          ...crud.params
        }
      } else if (crud.url === '/api/transactionMycardIngameTw') {
        return {
          page: crud.page.page - 1,
          size: crud.page.size,
          sort: crud.sort,
          stime: [crud.defaultStart, crud.defaultEnd],
          ...crud.query,
          ...crud.params
        }
      } else if (crud.url === '/api/transactionMycardBillingTw') {
        return {
          page: crud.page.page - 1,
          size: crud.page.size,
          sort: crud.sort,
          sdate: [crud.defaultStart, crud.defaultEnd],
          ...crud.query,
          ...crud.params
        }
      } else if (crud.url === '/api/transactionMycardDj') {
        return {
          page: crud.page.page - 1,
          size: crud.page.size,
          sort: crud.sort,
          stime: [crud.defaultStart, crud.defaultEnd],
          ...crud.query,
          ...crud.params
        }
      } else if (crud.url === '/api/transactionMycardAuth') {
        return {
          page: crud.page.page - 1,
          size: crud.page.size,
          sort: crud.sort,
          stime: [crud.defaultStart, crud.defaultEnd],
          ...crud.query,
          ...crud.params
        }
      } else if (crud.url === '/api/transactionMycardDjnew') {
        return {
          page: crud.page.page - 1,
          size: crud.page.size,
          sort: crud.sort,
          stime: [crud.defaultStart, crud.defaultEnd],
          ...crud.query,
          ...crud.params
        }
      } else if (crud.url === '/api/transactionGooglepay') {
        return {
          page: crud.page.page - 1,
          size: crud.page.size,
          sort: crud.sort,
          stime: [crud.defaultStart, crud.defaultEnd],
          ...crud.query,
          ...crud.params
        }
      } else if (crud.url === '/api/transactionApplepay') {
        return {
          page: crud.page.page - 1,
          size: crud.page.size,
          sort: crud.sort,
          time: [crud.defaultStart, crud.defaultEnd],
          ...crud.query,
          ...crud.params
        }
      } else if (crud.url === '/api/transactionPaypal') {
        return {
          page: crud.page.page - 1,
          size: crud.page.size,
          sort: crud.sort,
          time: [crud.defaultStart, crud.defaultEnd],
          ...crud.query,
          ...crud.params
        }
      } else if (crud.url === '/api/transactionOnestore') {
        return {
          page: crud.page.page - 1,
          size: crud.page.size,
          sort: crud.sort,
          createtime: [crud.defaultStart, crud.defaultEnd],
          ...crud.query,
          ...crud.params
        }
      } else if (crud.url === '/api/transactionHuawei') {
        return {
          page: crud.page.page - 1,
          size: crud.page.size,
          sort: crud.sort,
          createtime: [crud.defaultStart, crud.defaultEnd],
          ...crud.query,
          ...crud.params
        }
      } else if (crud.url === '/api/transactionMol') {
        return {
          page: crud.page.page - 1,
          size: crud.page.size,
          sort: crud.sort,
          time: [crud.defaultStart, crud.defaultEnd],
          ...crud.query,
          ...crud.params
        }
      } else if (crud.url === '/api/transactionMolChannel') {
        return {
          page: crud.page.page - 1,
          size: crud.page.size,
          sort: crud.sort,
          time: [crud.defaultStart, crud.defaultEnd],
          ...crud.query,
          ...crud.params
        }
      } else if (crud.url === '/api/lpmobilephone/getLpmobilephoneList') {
        return {
          page: crud.page.page - 1,
          size: crud.page.size,
          sort: crud.sort,
          isdisable: 0,
          ...crud.query,
          ...crud.params
        }
      } else if (crud.url === '/api/lpuserGamelimit/getLpuserGamelimitList') {
        return {
          page: crud.page.page - 1,
          size: crud.page.size,
          sort: crud.sort,
          status: '0',
          ...crud.query,
          ...crud.params
        }
      } else if (crud.url === '/api/lpGooglepayConfigInfo/getGooglepayConfigInfoList') {
        return {
          page: crud.page.page - 1,
          size: crud.page.size,
          sort: crud.sort,
          tag: 1,
          ...crud.query,
          ...crud.params
        }
      } else {
        return {
          page: crud.page.page - 1,
          size: crud.page.size,
          sort: crud.sort,
          ...crud.query,
          ...crud.params
        }
      }
    },
    // 当前页改变
    pageChangeHandler(e) {
      crud.page.page = e
      crud.refresh()
    },
    // 每页条数改变
    sizeChangeHandler(e) {
      crud.page.size = e
      crud.page.page = 1
      crud.refresh()
    },
    // 预防删除第二页最后一条数据时，或者多选删除第二页的数据时，页码错误导致请求无数据
    dleChangePage(size) {
      if (crud.data.length === size && crud.page.page !== 1) {
        crud.page.page -= 1
      }
    },
    // 选择改变
    selectionChangeHandler(val) {
      crud.selections = val
    },
    /**
     * 重置查询参数
     * @param {Boolean} toQuery 重置后进行查询操作
     */
    resetQuery(toQuery = true) {
      const defaultQuery = JSON.parse(JSON.stringify(crud.defaultQuery))
      const query = crud.query
      Object.keys(query).forEach(key => {
        query[key] = defaultQuery[key]
      })
      // 重置参数
      this.params = {}
      if (toQuery) {
        crud.toQuery()
      }
    },
    /**
     * 重置表单
     * @param {Array} data 数据
     */
    resetForm(data) {
      const form = data || (typeof crud.defaultForm === 'object' ? JSON.parse(JSON.stringify(crud.defaultForm)) : crud.defaultForm.apply(crud.findVM('form')))
      const crudFrom = crud.form
      for (const key in form) {
        if (crudFrom.hasOwnProperty(key)) {
          crudFrom[key] = form[key]
        } else {
          Vue.set(crudFrom, key, form[key])
        }
      }
      // add by ghl 2020-10-04  页面重复添加信息时，下拉框的校验会存在，需要找工取消
      if (crud.findVM('form').$refs['form']) {
        crud.findVM('form').$refs['form'].clearValidate()
      }
    },
    /**
     * 重置数据状态
     */
    resetDataStatus() {
      const dataStatus = {}

      function resetStatus(datas) {
        datas.forEach(e => {
          dataStatus[crud.getDataId(e)] = {
            delete: 0,
            edit: 0
          }
          if (e.children) {
            resetStatus(e.children)
          }
        })
      }
      resetStatus(crud.data)
      crud.dataStatus = dataStatus
    },
    /**
     * 获取数据状态
     * @param {Number | String} id 数据项id
     */
    getDataStatus(id) {
      return crud.dataStatus[id]
    },
    /**
     * 用于树形表格多选, 选中所有
     * @param selection
     */
    selectAllChange(selection) {
      // 如果选中的数目与请求到的数目相同就选中子节点，否则就清空选中
      if (selection && selection.length === crud.data.length) {
        selection.forEach(val => {
          crud.selectChange(selection, val)
        })
      } else {
        crud.getTable().clearSelection()
      }
    },
    /**
     * 用于树形表格多选，单选的封装
     * @param selection
     * @param row
     */
    selectChange(selection, row) {
      // 如果selection中存在row代表是选中，否则是取消选中
      if (selection.find(val => {
        return crud.getDataId(val) === crud.getDataId(row)
      })) {
        if (row.children) {
          row.children.forEach(val => {
            crud.getTable().toggleRowSelection(val, true)
            selection.push(val)
            if (val.children) {
              crud.selectChange(selection, val)
            }
          })
        }
      } else {
        crud.toggleRowSelection(selection, row)
      }
    },
    /**
     * 切换选中状态
     * @param selection
     * @param data
     */
    toggleRowSelection(selection, data) {
      if (data.children) {
        data.children.forEach(val => {
          crud.getTable().toggleRowSelection(val, false)
          if (val.children) {
            crud.toggleRowSelection(selection, val)
          }
        })
      }
    },
    findVM(type) {
      return crud.vms.find(vm => vm && vm.type === type).vm
    },
    notify(title, type = CRUD.NOTIFICATION_TYPE.INFO) {
      crud.vms[0].vm.$notify({
        title,
        type,
        duration: 2500
      })
    },
    updateProp(name, value) {
      Vue.set(crud.props, name, value)
    },
    getDataId(data) {
      return data[this.idField]
    },
    getTable() {
      return this.findVM('presenter').$refs.table
    },
    attchTable() {
      const table = this.getTable()
      this.updateProp('table', table)
      const that = this
      table.$on('expand-change', (row, expanded) => {
        if (!expanded) {
          return
        }
        const lazyTreeNodeMap = table.store.states.lazyTreeNodeMap
        row.children = lazyTreeNodeMap[crud.getDataId(row)]
        if (row.children) {
          row.children.forEach(ele => {
            const id = crud.getDataId(ele)
            if (that.dataStatus[id] === undefined) {
              that.dataStatus[id] = {
                delete: 0,
                edit: 0
              }
            }
          })
        }
      })
    }
  }
  const crud = Object.assign({}, data)
  // 可观测化
  Vue.observable(crud)
  // 附加方法
  Object.assign(crud, methods)
  // 记录初始默认的查询参数，后续重置查询时使用
  Object.assign(crud, {
    defaultQuery: JSON.parse(JSON.stringify(data.query)),
    // 预留4位存储：组件 主页、头部、分页、表单，调试查看也方便找
    vms: Array(4),
    /**
     * 注册组件实例
     * @param {String} type 类型
     * @param {*} vm 组件实例
     * @param {Number} index 该参数内部使用
     */
    registerVM(type, vm, index = -1) {
      const vmObj = {
        type,
        vm: vm
      }
      if (index < 0) {
        this.vms.push(vmObj)
        return
      }
      if (index < 4) { // 内置预留vm数
        this.vms[index] = vmObj
        return
      }
      this.vms.length = Math.max(this.vms.length, index)
      this.vms.splice(index, 1, vmObj)
    },
    /**
     * 取消注册组件实例
     * @param {*} vm 组件实例
     */
    unregisterVM(type, vm) {
      for (let i = this.vms.length - 1; i >= 0; i--) {
        if (this.vms[i] === undefined) {
          continue
        }
        if (this.vms[i].type === type && this.vms[i].vm === vm) {
          if (i < 4) { // 内置预留vm数
            this.vms[i] = undefined
          } else {
            this.vms.splice(i, 1)
          }
          break
        }
      }
    }
  })
  // 冻结处理，需要扩展数据的话，使用crud.updateProp(name, value)，以crud.props.name形式访问，这个是响应式的，可以做数据绑定
  Object.freeze(crud)
  return crud
}

// hook VM
function callVmHook(crud, hook) {
  if (crud.debug) {
    console.log('callVmHook: ' + hook)
  }
  const tagHook = crud.tag ? hook + '$' + crud.tag : null
  let ret = true
  const nargs = [crud]
  for (let i = 2; i < arguments.length; ++i) {
    nargs.push(arguments[i])
  }
  // 有些组件扮演了多个角色，调用钩子时，需要去重
  const vmSet = new Set()
  crud.vms.forEach(vm => vm && vmSet.add(vm.vm))
  vmSet.forEach(vm => {
    if (vm[hook]) {
      ret = vm[hook].apply(vm, nargs) !== false && ret
    }
    if (tagHook && vm[tagHook]) {
      ret = vm[tagHook].apply(vm, nargs) !== false && ret
    }
  })
  return ret
}

function mergeOptions(src, opts) {
  const optsRet = {
    ...src
  }
  for (const key in src) {
    if (opts.hasOwnProperty(key)) {
      optsRet[key] = opts[key]
    }
  }
  return optsRet
}

/**
 * 查找crud
 * @param {*} vm
 * @param {string} tag
 */
function lookupCrud(vm, tag) {
  tag = tag || vm.$attrs['crud-tag'] || 'default'
  // function lookupCrud(vm, tag) {
  if (vm.$crud) {
    const ret = vm.$crud[tag]
    if (ret) {
      return ret
    }
  }
  return vm.$parent ? lookupCrud(vm.$parent, tag) : undefined
}

/**
 * crud主页
 */
function presenter(crud) {
  if (crud) {
    console.warn('[CRUD warn]: ' + 'please use $options.cruds() { return CRUD(...) or [CRUD(...), ...] }')
  }
  return {
    data() {
      // 在data中返回crud，是为了将crud与当前实例关联，组件观测crud相关属性变化
      return {
        crud: this.crud
      }
    },
    beforeCreate() {
      this.$crud = this.$crud || {}
      let cruds = this.$options.cruds instanceof Function ? this.$options.cruds() : crud
      if (!(cruds instanceof Array)) {
        cruds = [cruds]
      }
      cruds.forEach(ele => {
        if (this.$crud[ele.tag]) {
          console.error('[CRUD error]: ' + 'crud with tag [' + ele.tag + ' is already exist')
        }
        this.$crud[ele.tag] = ele
        ele.registerVM('presenter', this, 0)
      })
      this.crud = this.$crud['defalut'] || cruds[0]
    },
    methods: {
      parseTime
    },
    created() {
      for (const k in this.$crud) {
        if (this.$crud[k].queryOnPresenterCreated) {
          this.$crud[k].toQuery()
        }
      }
    },
    destroyed() {
      for (const k in this.$crud) {
        this.$crud[k].unregisterVM('presenter', this)
      }
    },
    mounted() {
      // 如果table未实例化（例如使用了v-if），请稍后在适当时机crud.attchTable刷新table信息
      if (this.$refs.table !== undefined) {
        this.crud.attchTable()
      }
    }
  }
}

/**
 * 头部
 */
function header() {
  return {
    data() {
      return {
        crud: this.crud,
        query: this.crud.query
      }
    },
    beforeCreate() {
      this.crud = lookupCrud(this)
      this.crud.registerVM('header', this, 1)
    },
    destroyed() {
      this.crud.unregisterVM('header', this)
    }
  }
}

/**
 * 分页
 */
function pagination() {
  return {
    data() {
      return {
        crud: this.crud,
        page: this.crud.page
      }
    },
    beforeCreate() {
      this.crud = lookupCrud(this)
      this.crud.registerVM('pagination', this, 2)
    },
    destroyed() {
      this.crud.unregisterVM('pagination', this)
    }
  }
}

/**
 * 表单
 */
function form(defaultForm) {
  return {
    data() {
      return {
        crud: this.crud,
        form: this.crud.form
      }
    },
    beforeCreate() {
      this.crud = lookupCrud(this)
      this.crud.registerVM('form', this, 3)
    },
    created() {
      this.crud.defaultForm = defaultForm
      this.crud.resetForm()
    },
    destroyed() {
      this.crud.unregisterVM('form', this)
    }
  }
}

/**
 * crud
 */
function crud(options = {}) {
  const defaultOptions = {
    type: undefined
  }
  options = mergeOptions(defaultOptions, options)
  return {
    data() {
      return {
        crud: this.crud
      }
    },
    beforeCreate() {
      this.crud = lookupCrud(this)
      this.crud.registerVM(options.type, this)
    },
    destroyed() {
      this.crud.unregisterVM(options.type, this)
    }
  }
}

/**
 * CRUD钩子
 */
CRUD.HOOK = {
  /** 刷新 - 之前 */
  beforeRefresh: 'beforeCrudRefresh',
  /** 刷新 - 之后 */
  afterRefresh: 'afterCrudRefresh',
  /** 删除 - 之前 */
  beforeDelete: 'beforeCrudDelete',
  /** 删除 - 之后 */
  afterDelete: 'afterCrudDelete',
  /** 删除取消 - 之前 */
  beforeDeleteCancel: 'beforeCrudDeleteCancel',
  /** 删除取消 - 之后 */
  afterDeleteCancel: 'afterCrudDeleteCancel',
  /** 新建 - 之前 */
  beforeToAdd: 'beforeCrudToAdd',
  /** 新建 - 之后 */
  afterToAdd: 'afterCrudToAdd',
  /** 编辑 - 之前 */
  beforeToEdit: 'beforeCrudToEdit',
  /** 编辑 - 之后 */
  afterToEdit: 'afterCrudToEdit',
  /** 开始 "新建/编辑" - 之前 */
  beforeToCU: 'beforeCrudToCU',
  /** 开始 "新建/编辑" - 之后 */
  afterToCU: 'afterCrudToCU',
  /** "新建/编辑" 验证 - 之前 */
  beforeValidateCU: 'beforeCrudValidateCU',
  /** "新建/编辑" 验证 - 之后 */
  afterValidateCU: 'afterCrudValidateCU',
  /** 添加取消 - 之前 */
  beforeAddCancel: 'beforeCrudAddCancel',
  /** 添加取消 - 之后 */
  afterAddCancel: 'afterCrudAddCancel',
  /** 编辑取消 - 之前 */
  beforeEditCancel: 'beforeCrudEditCancel',
  /** 编辑取消 - 之后 */
  afterEditCancel: 'afterCrudEditCancel',
  /** 提交 - 之前 */
  beforeSubmit: 'beforeCrudSubmitCU',
  /** 提交 - 之后 */
  afterSubmit: 'afterCrudSubmitCU',
  afterAddError: 'afterCrudAddError',
  afterEditError: 'afterCrudEditError'
}

/**
 * CRUD状态
 */
CRUD.STATUS = {
  NORMAL: 0,
  PREPARED: 1,
  PROCESSING: 2
}

/**
 * CRUD通知类型
 */
CRUD.NOTIFICATION_TYPE = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error'
}

export default CRUD

export {
  presenter,
  header,
  form,
  pagination,
  crud
}
