<template>
  <pie-chart @click="handleClick" :data="state.data"></pie-chart>
</template>

<script setup>
import { reactive } from 'vue'
const state = reactive({
  data: [
    { title: '大专', count: 200, color: 'brown' },
    { title: '本科', count: 300, color: 'skyblue' },
    { title: '硕士', count: 400, color: 'pink' },
    { title: '博士', count: 500, color: 'yellow' }
  ]
})

function handleClick() {
  state.data.push({ name: '其他', count: 300, color: 'origin' })
}

</script>

<style scoped>

</style>