<template>
    <a-layout class="top-0 bottom-0 left-0 right-0 absolute">
      <a-layout-sider
        v-model:collapsed="collapsed" 
        breakpoint="lg"
        collapsed-width="0"
        width="220px"
        :trigger="null"
        class="overflow-scroll scrollbar-none"
      >
        <div class="text-center text-white p-2 text-lg  " >
            {{props.title}}
        </div>
        <LayoutMenu :items="props.menu"></LayoutMenu>
      </a-layout-sider>

      <a-layout>
        <a-layout-header :style="{ background: '#fff', padding: 0 }">
                <div class="flex h-full  items-center justify-between gap-2 px-4">
                    <div class="flex items-center gap-2">
                        <menu-unfold-outlined  v-if="collapsed" class="trigger text-[20px]" @click="() => (collapsed = !collapsed)" />
                        <menu-fold-outlined v-else class="trigger text-[20px]" @click="() => (collapsed = !collapsed)" />
                        <div class="leading-4 gap-1 flex flex-col  justify-center h-full">
                            <div class="text-[12px] text-[#aaa]">{{routeInfo?.names.join(' / ')}}</div>
                            <div class="font-bold text-[18px]">{{routeInfo?.name}}</div>
                        </div>
                    </div>
                    <div class=" flex items-center">
                        <slot name="header-right-extend"></slot>
                        <slot name="header-right-language">
                            <div class="flex items-center p-2 ml-2">
                                <a-dropdown >
                                    <div class=" cursor-pointer flex items-center">
                                        <GlobalOutlined  class="text-[26px]" />
                                    </div>
                                    <template #overlay>
                                        <a-menu>
                                            <a-menu-item  v-for="locale in locales" @click="setLocale(locale.code)">
                                                {{ locale.name }}
                                            </a-menu-item>
                                        </a-menu>
                                    </template>
                                </a-dropdown>
                            </div>
                        </slot>

                        <div >
                            <a-dropdown >
                                <div class="h-[30px] leading-[30px] cursor-pointer">{{ useAdmin().value?.username ?? 'Admin'}}</div>
                                <template #overlay>
                                    <a-menu>
                                        <a-menu-item v-for="item in props.adminMenu" @click="item.click">
                                            {{ item.name }}
                                        </a-menu-item>
                                        <!-- <a-menu-item @click="()=>singOut()">
                                            <a href="javascript:;">{{$t('退出')}}</a>
                                        </a-menu-item> -->
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
            <div class="absolute top-0 left-0 right-0 bottom-0 overflow-scroll scrollbar-hide">
                <slot ></slot>
            </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
</template>
<script lang="ts" setup>
import type { MenuItemType } from './Menu.vue';
const { locales, setLocale } = useI18n()

const collapsed = ref(false)

const props = defineProps<{
    title:string,
    menu: MenuItemType[],
    adminMenu:{
        name:string,
        click:()=>void
    }[]
}>()

let routeInfo = useRouteInfo(props.menu)


</script>

