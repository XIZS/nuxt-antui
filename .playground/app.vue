<template>
  <div class="">
    <!-- <Form 
        :form="[
                {label:'ss',is:'input',key:'aa'},
                {label:'ss',is:'input',key:'affa'}
        ]"
        :submit="submit"
    ></Form> -->
    <AButton @click="click"> aa</AButton>
  </div>
</template>

<script setup lang="ts">

const click = ()=>{

  MModal.Form({
    title:"aaaa",
        form:[
                {label:'ss',is:'input',key:'aa'},
                {label:'ss',is:'input',key:'affa'}
        ],
        submit:()=>{
          console.log('aaaa')
        }
  })
}
</script>

<style scoped></style>