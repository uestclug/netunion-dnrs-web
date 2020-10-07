/* eslint-disable no-multi-str */
/* eslint-disable camelcase */
/* 导出数据接口文件 */
const pool = require('../db')
const express = require('express')
const router = express.Router()

// const utils = require('../utils')
const apiUtils = require('./apiUtils')

const $sql = require('../sqlMap')
// const $common = require('../common.js')

const ExcelJS = require('exceljs')
// const nodemailer = require('nodemailer')

const accountTable = ' public.account '
// const orderTable = ' public.order '
// const orderActionNotesTable = ' public.order_action_notes '
const orderAssigneeTable = ' public.order_assignee '
const orderAttendanceTable = ' public.order_attendance '

/**
 * 导出一段时间内的订单为 excel 表格并发送到指定邮箱的接口
 */
router.post('/exportToExcel', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const reqBody = req.body
    const month = reqBody.month
    const format = reqBody.format
    // const email = reqBody.email

    const exportStartDate = month + '-01' // 选择月份的第一天
    const exportEndDate = new Date(exportStartDate).getFullYear() + '-' +
      (new Date(exportStartDate).getMonth() + 2) + '-01' // 选择月份的下一个月的第一天
    const exportStartTime = new Date(exportStartDate).getTime()
    const exportEndTime = new Date(exportEndDate).getTime()

    const client = await pool.connect()
    const orderRecords = await client.query($sql.order.export.queryFinishedOrderInfoByTime, [exportStartTime, exportEndTime])
    const orderRecordsItems = orderRecords.rows
    if (orderRecordsItems.length > 0) { // 查询到当月的订单记录
      let orderIdSqlData = ''
      for (let i = 0; i < orderRecordsItems.length; i++) {
        if (i == 0) orderIdSqlData += '\'' + orderRecordsItems[i].order_id + '\''
        else orderIdSqlData += ', \'' + orderRecordsItems[i].order_id + '\''
      }

      // 拼接 sql 查询语句：通过 order_id 数组查询订单的出勤记录
      const queryOrderAttnInfoByOrderId = '\
        SELECT oa.*, a.name AS solver_name \
        FROM' + orderAttendanceTable + 'AS oa \
        LEFT JOIN' + accountTable + 'AS a \
        ON oa.solver_id = a.user_id \
        WHERE oa.order_id IN (' + orderIdSqlData + ') \
        ORDER BY oa.order_id DESC'
      // 拼接 sql 查询语句：通过 order_id 数组查询订单的协作人记录
      const queryOrderAsgnInfoByOrderId = '\
        SELECT oa.*, a.name AS assignee_name \
        FROM' + orderAssigneeTable + 'AS oa \
        LEFT JOIN' + accountTable + 'AS a \
        ON oa.assignee_id = a.user_id \
        WHERE oa.order_id IN (' + orderIdSqlData + ') \
        ORDER BY oa.order_id DESC'

      const orderAttn = await client.query(queryOrderAttnInfoByOrderId)
      const orderAttnItems = orderAttn.rows
      const orderAsgn = await client.query(queryOrderAsgnInfoByOrderId)
      const orderAsgnItems = orderAsgn.rows
      client.release()

      // 处理数据为可导出的 Excel 表格
      const workbook = new ExcelJS.Workbook()
      workbook.creator = 'netunion'
      // 创建第一行冻结的工作表
      const orderRecordsSheet = workbook.addWorksheet('订单记录', { views: [{ state: 'frozen', ySplit: 1 }] })
      const orderAttnSheet = workbook.addWorksheet('出勤记录', { views: [{ state: 'frozen', ySplit: 1 }] })
      const orderAsgnSheet = workbook.addWorksheet('协助人记录', { views: [{ state: 'frozen', ySplit: 1 }] })
      // 设置工作表列属性
      orderRecordsSheet.columns = [
        { header: '订单编号', key: 'orderId' },
        { header: '处理者编号', key: 'solverId' },
        { header: '处理者姓名', key: 'solverName' },
        { header: '用户编号', key: 'userId' },
        { header: '用户姓名', key: 'userName' },
        { header: '用户性别', key: 'userGender' },
        { header: '用户联系电话', key: 'userTelephone' },
        { header: '用户所处校区', key: 'userCampus' },
        { header: '用户寝室地址', key: 'userDormitory' },
        { header: '用户状况描述', key: 'userDescription' },
        { header: '订单创建日期', key: 'createDate' },
        { header: '订单处理记录', key: 'solverRecord' },
        { header: '订单关闭日期', key: 'closeDate' }
      ]
      orderAttnSheet.columns = [
        { header: '订单编号', key: 'orderId' },
        { header: '处理者编号', key: 'solverId' },
        { header: '处理者姓名', key: 'solverName' },
        { header: '出勤描述', key: 'attnDescription' },
        { header: '记录时间', key: 'attnDate' }
      ]
      orderAsgnSheet.columns = [
        { header: '订单编号', key: 'orderId' },
        { header: '协助者编号', key: 'assigneeId' },
        { header: '协助者姓名', key: 'assigneeName' }
      ]
      // 添加工作表行数据
      for (let i = 0; i < orderRecordsItems.length; i++) {
        orderRecordsSheet.addRow({
          orderId: orderRecordsItems[i].order_id,
          solverId: orderRecordsItems[i].solver_id,
          solverName: orderRecordsItems[i].order_solver_name,
          userId: orderRecordsItems[i].user_id == null ? 'NULL' : orderRecordsItems[i].user_id,
          userName: orderRecordsItems[i].order_user_name,
          userGender: orderRecordsItems[i].order_user_gender,
          userTelephone: orderRecordsItems[i].order_user_telephone,
          userCampus: orderRecordsItems[i].order_user_campus,
          userDormitory: orderRecordsItems[i].order_user_dormitory,
          userDescription: orderRecordsItems[i].order_user_description,
          createDate: new Date(parseInt(orderRecordsItems[i].create_date)).toLocaleString(),
          solverRecord: orderRecordsItems[i].order_solver_record,
          closeDate: new Date(parseInt(orderRecordsItems[i].close_date)).toLocaleString()
        })
      }
      for (let i = 0; i < orderAttnItems.length; i++) {
        orderAttnSheet.addRow({
          orderId: orderAttnItems[i].order_id,
          solverId: orderAttnItems[i].solver_id,
          solverName: orderAttnItems[i].solver_name,
          attnDescription: orderAttnItems[i].attn_description,
          attnDate: new Date(parseInt(orderAttnItems[i].attn_date)).toLocaleString()
        })
      }
      for (let i = 0; i < orderAsgnItems.length; i++) {
        orderAsgnSheet.addRow({
          orderId: orderAsgnItems[i].order_id,
          assigneeId: orderAsgnItems[i].assignee_id,
          assigneeName: orderAsgnItems[i].assignee_name
        })
      }

      // 返回 buffer
      let filename = ''
      let buffer
      if (format == 'xlsx') {
        filename = [month + ' 网络维修记录 ' + reqBody.user_id + '-' + new Date().getTime() + '.xlsx']
        buffer = [await workbook.xlsx.writeBuffer()]
      } else if (format == 'csv') {
        const filenameBase = month + ' 网络维修记录 ' + reqBody.user_id + '-' + new Date().getTime() + '-'
        filename = [filenameBase + '订单记录.csv', filenameBase + '出勤记录.csv', filenameBase + '协助人记录.csv']
        const orderRecordsSheetBuffer = await workbook.csv.writeBuffer({ sheetId: 1 })
        const orderAttnSheetBuffer = await workbook.csv.writeBuffer({ sheetId: 2 })
        const orderAsgnSheetBuffer = await workbook.csv.writeBuffer({ sheetId: 3 })
        // buffer = Buffer.concat([orderRecordsSheetBuffer,  orderAttnSheetBuffer,  orderAsgnSheetBuffer])
        buffer = [orderRecordsSheetBuffer, orderAttnSheetBuffer, orderAsgnSheetBuffer]
      } else res.send(false)
      res.send({
        filename: filename,
        filebuffer: buffer
      })
    } else { // 当月还没有任何订单信息
      client.release()
      res.send(false)
    }
  } else {
    res.send(false)
  }
})

module.exports = router
