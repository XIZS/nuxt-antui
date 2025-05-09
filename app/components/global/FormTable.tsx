import { defineComponent, ref } from 'vue'
import { AForm, AFormItem, AInput, AButton, ATable, ASelect, APagination, ARangePicker, RedoOutlined } from '#components'
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
    setup(props) {
        let {t:$t} = useI18n()
      
        let value = watchRef(ref([]),(nv,ov)=>{
        if(nv?.length>0){
            props.form[props.item.key[0] as string] = nv[0].format('YYYY-MM-DD 00:00:00')
            props.form[props.item.key[1] as string] = nv[1].format('YYYY-MM-DD 23:59:59')
        }else{
            props.form[props.item.key[0] as string] = ''
            props.form[props.item.key[1] as string] = ''
        }
        })
        const rangePresets = ref([
            { label: $t('今天'), value: [dayjs(), dayjs()] },
            { label: $t('昨天'), value: [dayjs().add(-1, 'd'), dayjs().add(-1, 'd')] },
            { label: $t('最近7天'), value: [dayjs().add(-7, 'd'), dayjs()] },
            { label: $t('最近30天'), value: [dayjs().add(-30, 'd'), dayjs()] },
        ]);
        
        return ()=><ARangePicker presets={rangePresets.value} v-model:value={value.value}  />
    }
}) 


const FormItems = {
    input: (form: any, item: TableFormItemType) => {
        let {t:$t} = useI18n()
        return <AInput size="middle" v-model:value={form[item.key]} placeholder={$t(`请输入{label}`,{label:$t(item.label)})}></AInput>
    },
    select: (form: any, item: TableFormItemType) => {
        let {t:$t} = useI18n()
        return <ASelect allowClear class="min-w-[150px]" v-model:value={form[item.key]} options={item.bind?.options} placeholder={$t(`请选择{label}`,{label:$t(item.label)})}></ASelect>
    },
    dateRange:(form:any,item:TableFormItemType)=>{
        
        return h(dateRange,{form,item})
    }
}

export type TablePropsType = {
  form?: TableFormItemType[]
  action?: {
    search?: boolean
    reset?: boolean
    export?: boolean
    opther: () => any
  }
  table: {
    'v-slots'?:any
    enableSelection?: boolean
    columns: TableColumnType[]
    data: () => any[]
  },
  footerOptions?: {
    show: boolean
  },
  'v-slots'?:any
}

export type AttributeType = {
    selectItems:any[],
    selectKeys:any[],
    page:number,
    pageSize: number,
    tableData: any[],
    form:any
}

export const FormTableProps = {
    form: {
      type: Array as () => TableFormItemType[],
      required: false
    },
    formOptions:{
      type:Object as () => {
        search:boolean,
        reset:boolean,
        export:boolean,
        opther?:()=>any
      },
      default:()=>({
        search:true,
        reset:true,
        export:false,
      })
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
        rowKey:(row:any)=>{}
      })
    },
    footerOptions: {
      type: Object as () => {
        show: boolean,
      },
      default: () => ({
        show: true,
      })
    },
    attribute:{
        type: Object as () => AttributeType,
        default:()=>{}
    },
    control:{
      type:Object as () => any,
      required:true
    },
  }

export default defineComponent({
    name: 'TableLayout',
    props: FormTableProps,
    setup(props,{slots}) {
        const {t:$t} = useI18n()

        //form 初始化
        const form = ref({})
        props.form?.forEach((item) => {
            form.value[item.key] = item.value
        })
        props.attribute.form = form.value
        const metaForm = JSON.parse(JSON.stringify(form.value))

        //table初始化
        props.table.columns?.forEach((item) => {
            item.title = $t(item.title)            
        })

        let pagination =reactive({
            page:1,
            pageSize:20,
            total:0
        })


        const tableData = asyncReactive<any[]>(async ()=>{
            let res:any = await props.table.data({...form.value,...pagination})
            if(Array.isArray(res)){
                res = {
                    list:res,
                    meta:{
                        pagination:{
                            total:0,
                            per_page:pagination.pageSize,
                            current_page:pagination.page
                        }
                    } 
                }
            }
            pagination.total = res.meta.pagination.total
            pagination.pageSize = res.meta.pagination.per_page
            pagination.page = res.meta.pagination.current_page
            props.attribute.tableData = res.list
            return res.list
        },[])


        const rowSelection = { 
            selectedRowKeys: props.attribute?.selectKeys, 
            onChange: (keys:any,rows:any)=>{ 
                props.attribute!.selectKeys.splice(0,props.attribute!.selectKeys.length,...keys)
                props.attribute!.selectItems.splice(0,props.attribute!.selectItems.length,...rows)
            } 
        }

        props.control.refresh = ()=>tableData.load()
        
        return () => (
            <div class="flex flex-col gap-2 h-full  ">
                {props.form&&<AForm layout="inline gap-2">
                    {props.form?.map((item) => {
                    form[item.key] = item.value?? ''
                    return (
                        <AFormItem label={$t(item.label)}>
                            {FormItems[item.is](form.value,item)}
                        </AFormItem>
                    )
                    })}
                    <div class="flex gap-2">
                        {props.formOptions.search && <AButton type="primary" onClick={()=>tableData.load()}>{$t('搜索')}</AButton>}
                        {props.formOptions.reset && <AButton onClick={() => patch(metaForm,form.value)}>{$t('重置')}</AButton>}
                        {props.formOptions.export && <AButton type="primary">{$t('导出')}</AButton>}
                    </div> 
                </AForm>}
                {slots.center?.()}
                <div class="flex-1 overflow-scroll flex flex-col">
                    {slots.content?.(tableData.value) ??
                        <ATable
                            row-selection={props.table.enableSelection?rowSelection:null}
                            rowKey={props.table.rowKey??((row,key)=>key)}
                            loading={tableData.loading}
                            // scroll={{x: true}}
                            columns={props.table.columns}
                            pagination={false}
                            // sticky={tableData.value.length>0}
                            v-slots={{
                                headerCell: ({ title,column }: any) => (
                                    <div style={{'white-space': 'nowrap'}}>
                                        {title}
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
                    }
                </div>
                
                {props.footerOptions.show && <div class="mt-3 flex items-center justify-between">
                    <div>
                        { props.table.enableSelection && (`${$t('选中项')}: ${props.attribute.selectKeys.length}`)}
                    </div>
                    <div class="flex items-center gap-2">
                        <APagination 
                        hideOnSinglePage={true}
                        v-model:current={pagination.page}
                        total={pagination.total} 
                        pageSize={pagination.pageSize}
                        onChange={(page) => {
                            pagination.page = page
                            tableData.load()
                        }} 
                        pageSizeOptions={['20','50','100']}
                        onShowSizeChange={(current, size) => {
                            pagination.pageSize = size
                            pagination.page = 1
                            tableData.load()
                        }}
                        />
                        <AButton icon={h(RedoOutlined)} loading={tableData.loading} onClick={tableData.load}  />
                    </div>
                </div>}
            </div>
        )
    }
})