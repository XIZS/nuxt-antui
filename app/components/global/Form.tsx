import { AForm, AFormItem, AInput, ASelect,AInputNumber, LineOutlined, ASwitch, ATextarea, ARadio, ARadioGroup, AButton } from "#components"

export type FormItemType = {
    label:string,
    key: string | string[],
    value:any,
    is:string,
    bind:any,
    rules:any[]
}

export type FormPropsType = {
    form:FormItemType[],
    submit:(formData:any)=>{

    },
    showSubmit?:boolean
}

export const FormComs:{
    [key: string]: (form:any,item:FormItemType)=>VNode
  }= {
    input:(form:any,item:FormItemType)=>{
        return <AInput v-model:value={form[item.key as string]}></AInput>
    },
    button:(form:any,item:FormItemType)=>{
        console.log(item.bind)
        return <AButton {...item.bind}>{ item.bind.content}</AButton>
    },
    textarea:(form:any,item:FormItemType)=>{
        return <ATextarea v-model:value={form[item.key as string]}></ATextarea>
    },
    inputNumber:(form:any,item:FormItemType)=>{
        return <AInputNumber v-model:value={form[item.key as string]} {...item.bind}></AInputNumber>
    },
    inputNumberRange:(form:any,item:FormItemType)=>{
        return <div class="flex items-center gap-2">
            <AInputNumber class="flex-1" v-model:value={form[item.key[0] as string]} {...item.bind[0]}></AInputNumber>
            <LineOutlined />
            <AInputNumber class="flex-1" v-model:value={form[item.key[1] as string]} {...item.bind[1]}></AInputNumber>
        </div>
    },
    select:(form:any,item:FormItemType)=>{
        return <ASelect v-model:value={form[item.key as string]} options={item.bind.options}></ASelect>
    },
    switch:(form:any,item:FormItemType)=>{
        return <ASwitch v-model:checked={form[item.key as string]} {...item.bind}></ASwitch>
    },
    radio: (form: any, item: FormItemType) => {
        return <ARadioGroup v-model:value={form[item.key as string]} {...item.bind}></ARadioGroup>
    },

    // uploadImg: (form: any, item: FormItemType) => { 
    //     return <UploadImg v-model:value={form[item.key as string]} {...item.bind}></UploadImg>
    // }
}

export default defineComponent({
    props:{
        // form: Array as () => FormType[],
        // action: Array as () => JSX.Element[],
        // table: Object as () => FormTableProps<any>["table"],
        // control: Object
        form:{
            type:Array as ()=>FormPropsType['form'],
            required:true
        },
        submit:{
            type:Function  as FormPropsType['submit'],
            required:true
        },
        showSubmit:{
            type:Boolean,
            default:true
        },
        defaultFormData: {
            type: Object,
            default: () => ({})
        }
    },
    setup(props,{expose}){

        let thisRef = ref(null)
        let formData = ref(props.defaultFormData) 
        let rules = ref({})
        ADParse(props.form,formData.value).forEach(item=>{
            if(item.key==null) return
            if(Array.isArray(item.key)){
                item.key.forEach(key=>{
                    formData.value[key] = item.value??''
                    rules.value[item.key] = item.rules??[]   
                    
                })
            }else{
                formData.value[item.key] = item.value??''
                rules.value[item.key] = item.rules??[]   
            }

            // if(Array.isArray(item.rules)){
            //     item.rules.forEach(rule=>{
            //         rules.value
            //     })
            // }
            // rules.value[item.key] = item.rules??[]   
        })

        let loading = ref(false)
        let submit = async ()=>{
            if(loading.value){
                throw new Error('loading')
            }
            loading.value = true
            try{
                await thisRef.value.validate()
                await props.submit(formData.value)
            }finally{
                loading.value = false
            }
        }

        expose({
            submit,
            loading
        })
        


        return ()=><AForm ref={thisRef} model={formData.value} rules={rules.value} label-col={{ span: 6 }} wrapper-col={{ span: 16 }}>
            {/* {JSON.stringify(formData.value)} */}
            {
                ADParse(props.form, formData.value).map(item => {
                    if (item.label == null) {
                        return  typeof item.is === 'function'? item.is(formData.value) :
                        FormComs[item.is](formData.value,item)
                    }
                    return <AFormItem label={item.label} key={item.key} name={item.key} {...item.bind} class={{'hidden':item.show===false}}>
                        {
                            typeof item.is === 'function'? item.is(formData.value) :
                            FormComs[item.is](formData.value,item)
                        }
                    </AFormItem>
                })
            }

        </AForm>
    }
})