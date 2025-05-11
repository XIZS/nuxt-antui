<template>
    <div class="flex items-center p-2 ml-2">
        <a-dropdown >
            <div class=" cursor-pointer">
                <GlobalOutlined  class="text-[20px]" />
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
</template>

<script setup lang="ts">
const { locales, setLocale } = useI18n()
</script>

<style scoped></style>