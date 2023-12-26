import ExcelJS from 'exceljs'
export const excelBaseStyle = {
  font: {
    size: 10,
    bold: true,
    color: { argb: 'ffffff' }
  },
  alignment: { vertical: 'middle', horizontal: 'center' },
  fill: {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '808080' }
  },
  border: {
    top: { style: 'thin', color: { argb: '9e9e9e' } },
    left: { style: 'thin', color: { argb: '9e9e9e' } },
    bottom: { style: 'thin', color: { argb: '9e9e9e' } },
    right: { style: 'thin', color: { argb: '9e9e9e' } }
  },
  cellWidth: 15, // 单元格宽度
  cellHeight: 30 // 单元格高度
}

export async function exportExcel(data, columns) {
  // 创建一个工作簿
  const workbook = new ExcelJS.Workbook()

  // 创建一个工作表
  const worksheet = workbook.addWorksheet('Sheet1')

  // 创建表头
  const headers = columns.map((column) => {
    return column.label
  })
  // 添加表头
  worksheet.addRow(headers)

  data.forEach((row) => {
    // 根据表头添加数据行
    const dataValues = row.dataValues
    console.log('dataValues', dataValues)
    let values = []
    columns.forEach((column) => {
      const value = dataValues[column.prop] || ''
      values.push(value)
    })

    worksheet.addRow(values)
  })

  // 设置表头样式和宽度
  // Set column width
  columns.forEach((column, index) => {
    const col = worksheet.getColumn(index + 1)
    col.width = excelBaseStyle.cellWidth
  })

  // 美化表格样式
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      row.height = excelBaseStyle.cellHeight
      // 设置表头样式
      if (rowNumber === 1) {
        cell.fill = excelBaseStyle.fill
        cell.font = excelBaseStyle.font
        cell.alignment = excelBaseStyle.alignment
        cell.border = excelBaseStyle.border
      }
      // 设置数据行样式
      else {
        cell.fill ={
          ...excelBaseStyle.fill,
          fgColor: { argb: 'ffffff' }
        }
        cell.font = {...excelBaseStyle.font, color: '000000'}
        cell.alignment = {...excelBaseStyle.alignment, vertical: 'middle'}
        cell.border = excelBaseStyle.border
      }
    })
  })

  try {
    const buffer = await workbook.xlsx.writeBuffer()
    console.log('buffer', buffer)

    return buffer
  } catch (error) {
    console.error('生成 Excel 文件时出错：', error)
  }
}
