import { createVNode, render } from "vue"
import Form from "../components/global/Form"
import { AModal } from "#components"

export const NormalModal = (el) => {
    let control = { close: () => { } }
    let container = document.createDocumentFragment()

    let com = defineComponent({
        setup() {
            let open = ref(true)
            control.close = () => {
                open.value = false
            }
            return () => h(el, {
                open: open.value, // 等价于 v-model:open
                'onUpdate:open': (val: boolean) => {
                    open.value = val
                    if (!val) {
                        setTimeout(() => {
                            render(null, container) // 卸载组件
                            if (container.parentNode) {
                                container.parentNode.removeChild(container) // 移除 DOM
                            }
                        }, 1000);
                    }
                },
            })
        }
    })

    const vnode = h(com)
    vnode.appContext = useNuxtApp().vueApp._context
    render(vnode, container)
    document.body.appendChild(container)

    return control

}

// export Modal.Normal = NormalModal


type FormModalParamsType = {
    title: string,
    form: {
        label: string,
        key: string,
        is: string
    }[],
    submit: () => void
}

export const FormModal = (params: FormModalParamsType) => {

    let submit: () => void

    // let control = NormalModal(h(AModal,{
    //     title: params.title,
    //     okText: '提交'+loading?.value,
    //     cancelText: '取消',
    //     onOk: async ()=>{
    //         await submit()
    //         control.close()
    //     }

    // },h(defineComponent({
    //     setup(){
    //         let formRef = ref(null)

    //         onMounted(()=>{
    //             submit =  formRef.value.submit
    //             loading = formRef.value.loading
    //         })

    //         return ()=>h(Form,{
    //             ref: formRef,
    //             form: params.form,
    //             submit:params.submit,
    //             showSubmit: false
    //         })
    //     }
    // }))))

    let control = NormalModal(h(defineComponent({
        setup() {
            const { t: $t } = useI18n()
            let formRef = ref(null)
            let loading = ref(false)

            onMounted(() => {
                submit = async () => {
                    loading.value = true
                    try {
                        await formRef.value.submit()
                    } finally {

                        loading.value = false
                    }
                }
                // loading = formRef.value.loading
            })

            return () => h(AModal, {
                title: $t(params.title),
                width: params.width,
                okText: $t('提交'),
                cancelText: $t('取消'),
                confirmLoading: loading.value,
                onOk: async () => {
                    await submit()
                    control.close()
                }
            }, h(Form, {
                ref: formRef,
                form: params.form,
                defaultFormData: params.defaultFormData,
                submit: params.submit,
                showSubmit: false
            }))
        }
    })))
}

export const MModal = {
    Normal: NormalModal,
    Form: FormModal
}

export const Confirm = {
    delete: () => {
        // const { t: $t } = useI18n()
        return new Promise((resolve, reject) => {
            Modal.confirm({
                title: '确认删除',
                content: '确认删除该条数据吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    resolve(true)
                },
                onCancel: () => {
                    reject()
                }
            })
        })
    }
}


