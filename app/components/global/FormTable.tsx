import { defineComponent, ref } from 'vue'
import { AForm, AFormItem, AInput, AButton, ATable, ASelect, APagination, ARangePicker } from '#components'
import type { TableColumnType } from 'ant-design-vue'
import dayjs from 'dayjs'

type TableFormItemType = {
  label: string
  key: string
  is: string
  bind?: any
}

let dateRange = defineComponent({
  props:{
    form:{
      type:Object as ()=>any,
      required:true
    },
    item:{
      type:Object as ()=>TableFormItemType,
      required:true
    }
  },
  setup(props){
    let value = watchRef(ref([]),(nv,ov)=>{
      if(nv?.length>0){
        props.form[props.item.key[0]] = nv[0].format('YYYY-MM-DD 00:00:00')
        props.form[props.item.key[1]] = nv[1].format('YYYY-MM-DD 23:59:59')
      }else{
        props.form[props.item.key[0]] = ''
        props.form[props.item.key[1]] = ''
      }
    })

    const rangePresets = ref([
      { label: '今天', value: [dayjs(), dayjs()] },
      { label: '昨天', value: [dayjs().add(-1, 'd'), dayjs().add(-1, 'd')] },
      { label: '最近7天', value: [dayjs().add(-7, 'd'), dayjs()] },
      { label: '最近30天', value: [dayjs().add(-30, 'd'), dayjs()] },
    ]);
    
    return ()=><ARangePicker presets={rangePresets.value} v-model:value={value.value}  />
  }
}) 


const FormItems = {
    input:(form:any,item:TableFormItemType)=>{
        return <AInput size="middle" v-model:value={form[item.key]} placeholder={`please input ${item.label}`}></AInput>
    },
    select:(form:any,item:TableFormItemType)=>{
        return <ASelect allowClear class="min-w-[150px]" v-model:value={form[item.key]} options={item.bind.options} placeholder={`please select ${item.label}`}></ASelect>
    },
    dateRange:(form:any,item:TableFormItemType)=>{
        
        return h(dateRange,{form,item})
    }
}

export type TablePropsType = {
  form: TableFormItemType[]
  action?: {
    search?: boolean
    reset?: boolean
    export?: boolean
    opther: () => any
  }
  'v-slots'?:any
  table: {
    enableSelection?: boolean
    columns: TableColumnType[]
    data: () => any[]
  }
}

export type AttributeType = {
    selectItems:any[],
    selectKeys:any[],
    page:number,
    pageSize:number
}

export const FormTableProps = {
    form: {
      type: Array as () => TableFormItemType[],
      required: true
    },
    action: {
      type: Object as () => TablePropsType['action'],
      default: () => ({
        search: true,
        reset: true,
        export: true,
        opther: () => null
      })
    },
    table: {
      type: Object as () => TablePropsType['table'],
      default: () => ({
        enableSelection: false,
        columns: [],
        data: () => [],
        rowKey:(row:any)=>any
      })
    },
    attribute:{
        type:Object as ()=> AttributeType
    }
  }

export default defineComponent({
  name: 'TableLayout',
  props: FormTableProps,
  setup(props) {

    let pagination =reactive({
      page:1,
      pageSize:20,
      total:0
    })

    const form = ref({})

    const tableData = asyncReactive<any[]>(async ()=>{
        let res = await props.table.data({...form.value,...pagination})
        if(Array.isArray(res)){
          res = {
            list:res,
            meta:{
              pagination:{
                total:res.length,
                per_page:pagination.pageSize,
                current_page:pagination.page
              }
          } 
          }
        }
        console.log(res)
        pagination.total = res.meta.pagination.total
        pagination.pageSize = res.meta.pagination.per_page
        pagination.page = res.meta.pagination.current_page
        console.log(res)
        return res.list
    },[])


    const rowSelection = { 
        selectedRowKeys: props.attribute?.selectKeys, 
        onChange: (keys,rows)=>{ 
            props.attribute!.selectKeys.splice(0,props.attribute!.selectKeys.length,...keys)
            props.attribute!.selectItems.splice(0,props.attribute!.selectItems.length,...rows)
        } 
    }
    

    return () => (
      <div class="flex flex-col gap-2 h-full  ">
        {JSON.stringify(form.value)}
        {props.form&&<AForm layout="inline gap-2">
            {props.form?.map((item) => {
              form[item.key] = item.value?? ''
              return (
                <AFormItem label={item.label}>
                    {/* <AInput type="text" /> */}
                    {FormItems[item.is](form.value,item)}
                </AFormItem>
              )
            })}
            <div class="flex gap-2">
                {props.action.search && <AButton type="primary" onClick={()=>tableData.load()}>搜索</AButton>}
                {props.action.reset && <AButton>重置</AButton>}
                {props.action.export && <AButton type="primary">导出</AButton>}
            </div> 
        </AForm>}

        <div class="flex items-center justify-between">
            <div>{props.action.other}</div>

            {/* <div class="flex gap-2">
                {props.action.search && <AButton type="primary" onClick={()=>tableData.load()}>搜索</AButton>}
                {props.action.reset && <AButton>重置</AButton>}
                {props.action.export && <AButton type="primary">导出</AButton>}
            </div> */}
        </div>
        {/* <a-descriptions bordered size="small" column={5} layout="vertical">
          <a-descriptions-item label="游玩人数">33</a-descriptions-item>
          <a-descriptions-item label="游玩人次">1810000000</a-descriptions-item>
          <a-descriptions-item label="转入/下注">33</a-descriptions-item>
          <a-descriptions-item label="转出">12</a-descriptions-item>
          <a-descriptions-item label="人均盈亏"> 11</a-descriptions-item>
        </a-descriptions> */}
        <div class="flex-1 mt-3 overflow-scroll flex flex-col">
            <ATable
                row-selection={props.table.enableSelection?rowSelection:null}
                rowKey={props.table.rowKey??((row,key)=>key)}
                loading={tableData.loading}
                scroll={{x: true}}
                columns={props.table.columns}
                pagination={false}
                sticky={tableData.value.length>0}
                v-slots={{
                    headerCell: ({ title,column }: any) => (
                        <div style={{'white-space': 'nowrap'}}>
                            {title }
                        </div>
                    ),
                    bodyCell:(row)=>{
                        if(row.column?.customRender!=null){
                            return row.column.customRender(row)
                        }
                        return <div class="whitespace-nowrap" style={{ width:row.column.width??'100px'}}>{row.text}</div>
                    },
                    ...props.table['v-slots']

                }}
                dataSource={tableData.value}
            />
        </div>
        <div class="mt-3 flex items-center justify-between">
          <div>
            { props.table.enableSelection && (`选中项: ${props.attribute.selectKeys.length}`)}
          </div>
          <APagination v-model:current={pagination.page} onChange={(page) => {
            pagination.page = page
            tableData.load()
          }} total={pagination.total} />
        </div>

      </div>
    )
  }
})