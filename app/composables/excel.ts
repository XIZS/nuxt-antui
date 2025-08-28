import table2excel from 'js-table2excel'
import { Workbook } from 'exceljs'

export const toExcel = async function (getFn: (page: number, pageSize: number) => Promise<any[]>, type: string = 'xlsx'): Promise<(name: string, columns: any) => {}> {
    let page = 1
    const dataArr: any[] = []
    while ((await (async () => {
        const arr = await getFn(page++, 10000)
        dataArr.push(...arr)
        return arr
    })()).length > 0) { }

    if (dataArr.length === 0) {
        throw new Error('无数据')
    }

    const a = {
        'xlsx': (filename, columns) => {
            transformColumns(columns)
            xlsx(filename, columns, dataArr)
        },
        'xls': (filename, columns) => {
            transformColumns(columns)
            table2excel(columns, dataArr, filename)
        }
    }[type]
    return a
}

function getVNodeText(vnode:any) {

    if (vnode.children && vnode.children.length === 1 && typeof vnode.children[0] === 'string') {
      return vnode.children[0];
    } else if (typeof vnode.text === 'string') {
      return vnode.text;
    }
    else if (Object.prototype.toString.call(vnode.children) === '[object Object]') {
        return vnode.children.default()
    }
    else {
      let text = '';
      if (vnode.children) {
        for (let i = 0; i < vnode.children.length; i++) {
          const child = vnode.children[i];
          if (child?.children && child.children.length === 1 && typeof child.children[0] === 'string') {
            text += child.children[0];
          } else if (typeof child === 'string') {
            text += child;
          }
        }
      }
      else vnode.innerText
      return text;
    }
  }
  function isVNode(node:nay) {
    return Object.prototype.toString.call(node) === '[object Object]'
  }

export const exportExcel = async (
    filename: string,
    columns: Array<any>,
    getFn: (page: number, pageSize: number) => Promise<any[]>,
    maxDataNumber: number = Infinity,
    type: string = 'xlsx'
) => {
    let page = 1
    const dataArr: any[] = []
    while ((await (async () => {
        const arr = await getFn(page++, 10000)
        dataArr.push(...arr)
        return arr
    })()).length > 0 && dataArr.length < maxDataNumber) { }
    if (dataArr.length === 0) {
        throw new Error('无数据')
    }
    //自定义数据转换
    columns = columns.reduce((prev, next) => {
        if (next.children) {
            prev.push(...next.children)
        } else {
            prev.push(next)
        }
        return prev
    }, [])
    const customRenderColumns = columns.filter((item: any) => (item.customRender != null && item.export !== false) || item.formatFunc)

    dataArr.forEach((dataItem, index) => {
        customRenderColumns.forEach((crItem: any) => {
            let text = dataItem[crItem.dataIndex]
            const customRenderItem = crItem?.customRender && crItem.customRender({ text, record: dataItem, index: index + 1, isExcel: true })
            const customRenderItemFunc = (crItem?.formatFunc && crItem?.formatFunc(dataItem)) || customRenderItem

             dataItem[crItem.dataIndex] = isVNode(customRenderItemFunc) ? getVNodeText(customRenderItemFunc) : Array.isArray(customRenderItemFunc) ? customRenderItemFunc.map(item => isVNode(item) ? getVNodeText(item) : item).join(',') : customRenderItemFunc
        })
    })
    let resultColumns = columns.filter(item => item.export !== false)

    transformColumns(columns);

    console.log(resultColumns, dataArr)
    let fn: Record<string, Function> = {
        'xlsx': () => xlsx(filename, resultColumns, dataArr),
        'xls': () => table2excel(resultColumns, dataArr, filename)
    }
    fn[type]()
}

function transformColumns(columns: any) {
    columns.forEach(item => {
        if (item.key == null || item.dataIndex != null) {
            item.key = item.dataIndex
        }
    });
}


function columnsType(columns) {
    return columns.reduce((prev, next) => {
        if (next.type != null) {
            prev[next.key] = next.type
        }
        return prev
    }, {})
}
export const xlsx = (name, columns, data) => {
    if (data.length === 0) {
        this.$Msg(this.$t('没有数据'), {})
        return
    }
    const types = columnsType(columns)
    console.log(types)
    data.forEach(item => {
        for (const key in item) {
            if (types[key] != null) {
                console.log(key)
                types[key](item[key])
                continue
            }
            // if (!isNaN(item[key])) {
            //     item[key] = Number(item[key])
            // }
        }
    })
    columns = columns.map(item => {
        const obj = {}
        obj.key = item.dataIndex || item.key
        obj.header = item.title || item.header
        obj.width = 20
        return obj
    })
    data = JSON.parse(JSON.stringify(data))
    batchExport(name, columns, data)
}



async function batchExport(excelName, columns, sourceData, fn) {
    const wb = new Workbook()
    const sheet = wb.addWorksheet('sheet')

    sheet.columns = columns
    sheet.addRows(sourceData)
    fn && fn(sheet)
    const buffer = await wb.xlsx.writeBuffer()

    /**
     * 特殊下载方案
     */
    const down = () => {
        const blob = new Blob([buffer], {
            type: 'application/octet-stream'
        })

        let url = blob
        const saveName = `${excelName}.xlsx`

        if (typeof url === 'object' && url instanceof Blob) {
            url = URL.createObjectURL(url) // 创建blob地址
        }
        const aLink = document.createElement('a')
        aLink.href = url
        aLink.download = saveName || '' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
        var event
        if (window.MouseEvent) event = new MouseEvent('click')
        else {
            event = document.createEvent('MouseEvents')
            event.initMouseEvent(
                'click',
                true,
                false,
                window,
                0,
                0,
                0,
                0,
                0,
                false,
                false,
                false,
                false,
                0,
                null
            )
        }
        aLink.dispatchEvent(event)
    }

    down()
}
