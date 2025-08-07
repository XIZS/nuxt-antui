import { createVNode, render } from "vue"

export const Drawer = (el) => {
    let container = document.createDocumentFragment()
    let control = { close: () => { } }

    let com = defineComponent({
        setup() {
            let open = ref(true)
            console.log('aaaaaa')
            control.close = () => {
                open.value = false
                setTimeout(() => {
                    render(null, container) // 卸载组件
                    if (container.parentNode) {
                        container.parentNode.removeChild(container) // 移除 DOM
                    }
                }, 1000);
            }
            return () => h(el, {
                open: open.value, // 等价于 v-model:open
                'onUpdate:open': (val: boolean) => {
                    open.value = val
                    console.log(val, open.value)
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

