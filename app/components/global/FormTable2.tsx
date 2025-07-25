import { defineComponent, h, ref } from 'vue'
import { AForm, AFormItem, AInput, AButton, ATable, ASelect, APagination, ARangePicker, RedoOutlined, ASwitch, AInputNumber } from '#components'
import type { TableColumnType } from 'ant-design-vue'
import dayjs from 'dayjs'


type TableFormLabelsItemType = {
    label: string,
    key: string | string[],
    is: string,
    bind?: any,
    value?:any,
    filter?:()=>boolean
}

export type TableParamsType = {
    form?: {
        labels?: TableFormLabelsItemType[],
        'v-slots'?: Record<string, ()=>any>,
        option?: {
            search?: boolean,
            reset?: boolean,
            export?: boolean,
        },
    },
    table?: {
        'v-slots'?:any
        enableSelection?: boolean
        columns: TableColumnType[]
        rowKey: (row: any) => any
    },
    data: (params: any) => any
    footerOptions?: {
        show: boolean
    },
    'v-slots'?: {
        content:(data:any)=>any
    }
}

export type AttributeType = {
    selectItems:any[],
    selectKeys:any[],
    page:number,
    pageSize: number,
    reqData:any,
    tableData: any[],
    metaTableData:any[],
    form:any
}

let dateRange = defineComponent({
    props:{
        form:{
            type:Object as ()=>any,
            required:true
        },
        item:{
            type:Object as ()=>TableFormLabelsItemType,
            required:true
        },
      
    },
    setup(props) {
        let {t:$t} = useI18n()
      
        let value = watchRef(ref([]),(nv,ov)=>{
            if(nv?.length>0){
                props.form[props.item.key[0] as string] = dayjs(nv[0]).format('YYYY-MM-DD')
                props.form[props.item.key[1] as string] = dayjs(nv[1]).format('YYYY-MM-DD')
            }else{
                props.form[props.item.key[0] as string] = ''
                props.form[props.item.key[1] as string] = ''
            }
        })
        watch([() => props.form[props.item.key[0] as string],()=>props.form[props.item.key[1] as string]], (nv) => { 
            console.log(nv)
            if (nv[0] == '') {
                value.value = []
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


const FormItems:Record<string, (form: any, item: TableFormLabelsItemType) => any> = {
    input: (form: any, item: TableFormLabelsItemType) => {
        let {t:$t} = useI18n()
        return <AInput size="middle" v-model:value={form[item.key as string]} placeholder={$t(`请输入{label}`,{label:$t(item.label)})}></AInput>
    },
    numberRange: (form: any, item: TableFormLabelsItemType) => { 
        let {t:$t} = useI18n()
        return <div class="flex items-center">
                <AInputNumber class="!min-w-[150px]" v-model:value={form[item.key[0] as string]} placeholder={$t(`请输入{label}开始`,{label:$t(item.label)})}></AInputNumber>
                <span class="px-1">-</span>
                <AInputNumber class="!min-w-[150px]" v-model:value={form[item.key[1] as string]} placeholder={$t(`请输入{label}结束`,{label:$t(item.label)})}></AInputNumber>
        </div>
    },
    select: (form: any, item: TableFormLabelsItemType) => {
        let {t:$t} = useI18n()
        return <ASelect allowClear  {...item.bind}  class="min-w-[150px]" v-model:value={form[item.key as string]} options={item.bind?.options} placeholder={$t(`请选择{label}`,{label:$t(item.label)})}></ASelect>
    },
    switch: (form: any, item: TableFormLabelsItemType) => {
        let {t:$t} = useI18n()
        return <ASwitch allowClear  {...item.bind}  class="min-w-[150px]" v-model:value={form[item.key as string]} options={item.bind?.options} placeholder={$t(`请选择{label}`,{label:$t(item.label)})}></ASwitch>
    },
    dateRange:(form:any,item:TableFormLabelsItemType)=>{
        return h(dateRange,{form,item})
    }
}


export const FormTableProps = {
    form: {
      type: Object as () => TableParamsType['form'],
      required: false
    },

    table: {
      type: Object as () => TableParamsType['table'],
      default: () => ({
        enableSelection: false,
        columns: [],
        rowKey:(row:any)=>{}
      })
    },
    data: {
        type: Object as () => TableParamsType['data']
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
    isInitLoad: {
        type: Boolean,
        default: true
    }
}

export default defineComponent({
    name: 'TableLayout',
    props: FormTableProps,
    setup(props,{slots}) {
        const {t:$t} = useI18n()

        //form 初始化
        const form = ref<any>({})
        props.form?.labels?.filter(item=>item.filter==null||item.filter(item)).forEach((item) => {
            
            if (Array.isArray(item.key)) {
                item.key.forEach((key,index) => {
                    form.value[key] =  item.value?.[index]??''
                })
                
            } else {
                form.value[item.key] = item.value??''
            }
        })
        props.attribute.form = form.value
        const metaForm = JSON.parse(JSON.stringify(form.value))

        //table初始化
        props.table.columns?.forEach((item) => {
            item.title = $t(item.title as string)            
        })

        let pagination =reactive({
            page:1,
            pageSize:20,
            total:10
        })


        let _isInitLoad = props.isInitLoad
        const tableData = asyncReactive<any[]>(async () => {
            //初始化不加载数据
            if (!_isInitLoad) {
                _isInitLoad = true
                return []
            }
            let res: any = await props.data?.({ ...form.value, ...pagination })
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
            console.log(res)
            pagination.total = res.meta.pagination.total
            pagination.pageSize = res.meta.pagination.per_page||res.meta.pagination.perPage
            pagination.page = res.meta.pagination.current_page||res.meta.pagination.currentPage
            props.attribute.reqData = res
            props.attribute.metaTableData = JSON.parse(JSON.stringify(res.list))
            props.attribute.tableData = res.list
            return res.list
        },[])

        watch(()=>tableData.loading,(nv)=>{
            props.attribute.loading = nv
        })


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
                {/* {JSON.stringify(form.value)} */}
                {props.form?.labels&&<AForm layout="inline gap-2">
                    {props.form?.labels?.map((item: TableFormLabelsItemType) => {
                        return (
                            <AFormItem label={$t(item.label)}>
                                {FormItems[item.is]?.(form.value,item)}
                            </AFormItem>
                        )
                    })}
                    <div class="flex gap-2">
                        {props.form?.option?.search !== false && <AButton type="primary" onClick={()=>tableData.load()}>{$t('搜索')}</AButton>}
                        {props.form?.option?.reset  !== false && <AButton onClick={() => patch(metaForm,form.value,true)}>{$t('重置')}</AButton>}
                        {props.form?.option?.export === true && <AButton type="primary" onClick={()=>{
                            props.form.export?.(form.value)
                        }}>{$t('导出')}</AButton>}
                    </div> 

                    <div class="flex ml-auto">
                        {props.form['v-slots']?.extra?.()}
                    </div>
                </AForm>}
                {slots.center?.()}
                <div class="flex-1 relative overflow-scroll flex flex-col">
                    {slots.content?.(tableData.value) ??< div class="absolute inset-0 ">
                            <ATable
                                bordered
                                row-selection={props.table.enableSelection ? rowSelection : null}
                                rowKey={props.table.rowKey ?? ((row) => row.id)}
                                loading={tableData.loading}
                                columns={props.table.columns}
                                pagination={false}
                                v-slots={{
                                    headerCell: (row) => {
                                        if (row.column?.customHeaderCell != null) {
                                            return row.column.customHeaderCell()
                                        }
                                        return <div style={{ 'white-space': 'nowrap',}}>
                                            {row.title}
                                        </div>
                                    },
                                    bodyCell: (row: any) => {
                                        if (row.column?.customRender != null) {
                                            return row.column.customRender(row)
                                        }
                                        return <div class="whitespace-nowrap" >{row.text}</div>
                                    },
                                    ...props.table['v-slots']
                                }}
                                dataSource={tableData.value}
                            />
                        </div>
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