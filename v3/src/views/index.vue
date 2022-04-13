<template>
  <p>{{ state.header }}</p>
  <div>
    <div>首页</div>
    <div>{{ state.counter }}</div>
  </div>
  <button @click="state.counter ++">click</button>
  <p>{{ state.troubleCounter }}</p>
  <p>{{ state.doubleCounter }}</p>
  <p>{{ state.footer }}</p>
  <modal-button></modal-button>
  <vbutton></vbutton>
  <svg-icon icon='wx'></svg-icon>
  <wx-icon></wx-icon>
</template>

<script setup>
import { computed, h, defineComponent, defineAsyncComponent, reactive } from 'vue'
import VButton from '@/components/VButton.vue'
import WxIcon from '@/svg/wx.svg'

const props = defineProps(['itemData'])
const vbutton = defineComponent(VButton)

const state = reactive({
  counter: 1,
  troubleCounter: computed(() => state.counter * 3),
  doubleCounter: computed(() => state.counter * 2),
  footer: computed(() => props.itemData.footer),
  header: computed(() => props.itemData.header)
})

</script>

<style scoped>

</style>