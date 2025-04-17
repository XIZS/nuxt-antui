import { AModal } from "#components"
import { createVNode, render } from "vue"

export const Modal = (el)=>{

    let control = {close:()=>{}}

    let com = defineComponent({
        setup(){
            let open=ref(true)
            console.log('aaaaaa')
            control.close = ()=>{
                open.value = false
            }
            return ()=> h(el,{
                open: open.value, // 等价于 v-model:open
                'onUpdate:open': (val: boolean) => {
                    open.value = val
                    if(!val){
                        //
                    }
                }, 
            })
        }
    })

    let container = document.createDocumentFragment()
    const vnode = h(com)
    vnode.appContext = useNuxtApp().vueApp._context
    render(vnode,container)
    document.body.appendChild(container)

    return control

}



export const FormModal = ()=>{
    return Modal(h(AModal,{
        
    }))
}