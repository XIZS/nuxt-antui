<template>
    <a-menu
        v-model:openKeys="state.openKeys"
        v-model:selectedKeys="state.openKeys"
        mode="inline"
        theme="dark"
        :inline-collapsed="state.collapsed"
        :items="items"
        @select="select"
    ></a-menu>
</template>
<script lang="ts" setup>

export type MenuItemType = {
    icon?:string,
    title:string,
    path:string,
    children?:MenuItemType[]
}
const props = defineProps<{
    items: MenuItemType[],
}>()

const router = useRouter()
const select = 	({ item, key, keyPath })=>{
    router.push(key)
    state.openKeys = keyPath
}

const state = reactive({
    collapsed: false,
    selectedKeys: [''],
    openKeys: [''],
    preOpenKeys: ['sub1'],
});

const { $t } = useI18n()

const items = computed(()=>{
    let a = props.items.map((item) => {
        const { icon, title, path, children } = item;
        let newItem =  {
            key: path,
            icon: icon,
            label: $t(title),
          
        };
        if(children){
            newItem.children=children?.map((child) =>{
                let c = {
                    key: child.path,
                    label: $t(child.title),
                }
                if(child.children){
                    c.children=child.children?.map((subChild) =>{
                        return {
                            key: subChild.path,
                            label: $t(subChild.title),
                        }
                    })
                }
                return c
            })
        }
        return newItem
    });
    console.log(a)
    return a
})

let routeInfo = useRouteInfo(props.items)

watch(routeInfo, (newVal, oldVal) => {
    if (newVal && newVal.paths) {
        state.selectedKeys = newVal.paths
        state.openKeys = newVal.paths
    }
})

onMounted(()=>{
    state.selectedKeys=routeInfo?.value?.paths
    state.openKeys=routeInfo?.value?.paths
})


</script>
  
  