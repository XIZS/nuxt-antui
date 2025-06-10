<template>
    <NuxtLayout >
        <NuxtLoadingIndicator color="blue" />
        <a-config-provider componentSize="middle" :locale="useAntLocale">
            <NuxtPage></NuxtPage>
        </a-config-provider>
    </NuxtLayout>
</template>

<script lang="ts" setup>

</script>

<style lang="scss">
</style>


