import { createVNode, render } from "vue"

export const Drawer = (el)=>{
    // let container = document.createDocumentFragment()
    // let control = {clear:()=>{}}
    // const vnode = createVNode(Modal,{...params,control,onCancel:()=>{
    //     render(null,container)
    // }})
    // vnode.appContext = useNuxtApp().vueApp._context
    // render(vnode,container)
    // return {control}
    console.log(el)

    let com = defineComponent({
        setup(){
            let open=ref(true)
            console.log('aaaaaa')
            return ()=> h(el,{
                open: open.value, // 等价于 v-model:open
                'onUpdate:open': (val: boolean) => {
                    open.value = val
                    console.log(val,open.value)
                }, 
            })
        }
    })


    let container = document.createDocumentFragment()
    const vnode = h(com)
    vnode.appContext = useNuxtApp().vueApp._context
    render(vnode,container)
    document.body.appendChild(container)

}