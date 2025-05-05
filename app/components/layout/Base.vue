<template>
    <a-layout class="top-0 bottom-0 left-0 right-0 absolute">
      <a-layout-sider
        v-model:collapsed="collapsed" 
        breakpoint="lg"
        collapsed-width="0"
        width="220px"
      >
        <div class="text-center text-white p-2 text-lg " >
            LOGO
        </div>
        <LayoutMenu :items="props.menu"></LayoutMenu>
      </a-layout-sider>

      <a-layout>
        <a-layout-header :style="{ background: '#fff', padding: 0 }">
            <div class="flex h-full  items-center justify-between gap-2 px-4">
                <div class="flex items-center gap-2">
                    <menu-unfold-outlined
                        v-if="collapsed"
                        class="trigger text-[20px]"
                        @click="() => (collapsed = !collapsed)"
                        />
                    <menu-fold-outlined v-else class="trigger text-[20px]" @click="() => (collapsed = !collapsed)" />
                    <div class="leading-4 gap-1 flex flex-col  justify-center h-full">
                        <div class="text-[12px] text-[#aaa]">{{routeInfo.names.join(' / ')}}</div>
                        <div class="font-bold text-[18px]">{{routeInfo.name}}</div>
                    </div>
                </div>
                <div class=" flex items-center">
                    <div >
                        <a-dropdown >
                            <div class="h-[30px] leading-[30px]">{{ useAdmin().value?.username ?? 'Admin'}}</div>
                            <template #overlay>
                                <a-menu>
                                    <a-menu-item @click="()=>singOut()">
                                        <a href="javascript:;">退出</a>
                                    </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </div>

                </div>
            </div>
        </a-layout-header>
        <!-- <div class="p-4 bg-white" style="border-top:1px solid #eee">
            <div class="leading-4 gap-1 flex flex-col  justify-center h-full">
                <div class="text-[12px] text-[#aaa]">{{routeInfo.names.join(' / ')}}</div>
                <div class="font-bold text-[18px]">{{routeInfo.name}}</div>
            </div>
        </div> -->
        <a-layout-content :style="{ }" class="relative   m-4">
            <div class="absolute top-0 left-0 right-0 bottom-0">
                <slot ></slot>
            </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
</template>
<script lang="ts" setup>
import type { MenuItemType } from './Menu.vue';

const collapsed = ref(false)

const props = defineProps<{
    menu: MenuItemType[]
}>()

// const menuItems:MenuItemType = [
//     {
//         title:'首页',
//         icon: () => h(PieChartOutlined),
//         path:'/'
//     },
//     {
//         title:'用户',
//         icon: () => h(PieChartOutlined),
//         path:'/user',
//         children:[
//             {
//                 title:'用户列表',
//                 icon:'InboxOutlined',
//                 path:'/user/list'
//             }
//         ]
//     },
//     {
//         title:'数据报表',
//         icon: () => h(PieChartOutlined),
//         path:'/dataReport',
//         children:[
//             {
//                 title:'平台活跃报表',
//                 path:'/DataReport/platformActiveReport'
//             },
//             {
//                 title:'平台财务报表',
//                 path:'/DataReport/platformfinanceReport'
//             },
//             {
//                 title:'消耗报表',
//                 path:'/DataReport/consumptionReport'
//             }
//         ]
//     },
//     {
//         title:'结算管理',
//         icon: () => h(PieChartOutlined),
//         path:'/settleManage',
//         children:[
//             {
//                 title:'分包游戏报表',
//                 path:'/settleManage/subGameReport'
//             },
           
//         ]
//     },
//     {
//         title:'综艺直播游戏',
//         icon: () => h(PieChartOutlined),
//         path:'/liveGame',
//         children:[
//             {
//                 title:'综艺直播间数据',
//                 path:'/liveGame/liveData'
//             },
//             {
//                 title:'直播间开奖操控',
//                 path:'/liveGame/LotteryControl'
//             },
//             {
//                 title:'直播间实时监控',
//                 path:'/liveGame/liveMonitor'
//             },
//             {
//                 title:'机器人管理',
//                 path:'/liveGame/robotManage',
//                 children:[
//                     {
//                         title:'机器人列表',
//                         path:'/liveGame/robotManage/robotList'
//                     },
//                     {
//                         title:'机器人配置',
//                         path:'/liveGame/robotManage/robotConfig'
//                     },
//                     {
//                         title:'机器人资源库',
//                         path:'/liveGame/robotManage/robotResourceLibrary'
//                     },
//                     {
//                         title:'机器人类型',
//                         path:'/liveGame/robotManage/robotType'
//                     },
//                     {
//                         title:'自动弹幕文本配置',
//                         path:'/liveGame/robotManage/autoDanmuTextConfig'
//                     },
//                 ]
//             },
//             {
//                 title:'综艺游戏直播间配置',
//                 path:'/liveGame/gameLiveConfig'
//             }

//         ]
//     }
    
// ]
const router = useRouter()


let routeInfo = useRouteInfo(props.menu)


</script>

