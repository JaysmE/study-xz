<template>
  <div id="about"></div>
</template>

<script setup>
import { createRenderer, defineComponent, onMounted } from "vue";
import CustomRenderer from '../components/customRenderer.vue'

const props = defineProps(['itemData'])

let canvas, ctx

const renderer = createRenderer({
  createElement(tag) {
    return { tag }
  },
  insert(el, parent, anchor) {
    el.parent = parent
    if(!parent.child) {
      parent.child = []
    } else {
      parent.child.push(el)
    }
    console.log(parent)
    if(parent.nodeType === 1) {
      console.log(el)
      draw(el)
      if(el.onClick) {
        console.log(el.onClick)
        parent.addEventListener('click', el.onClick)
      }
    }
  },
  createComment(text) {
    return text
  },
  patchProp(el, key, prevValue, nextValue) {
    el[key] = nextValue
  }
})

const draw = (el, noClear) => {
  if (!noClear) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
  if (el.tag == 'pie-chart') {
    const { data } = el;
    const barWidth = canvas.width / 10,
        gap = 20,
        paddingLeft = (data.length * barWidth + (data.length - 1) * gap) / 2,
        paddingBottom = 10;
    // x轴
    // 柱状图
    data.forEach(({ title, count, color }, index) => {
      const x = paddingLeft + index * (barWidth + gap)
      const y = canvas.height - paddingBottom - count
      ctx.fillStyle = color
      ctx.fillRect(x, y, barWidth, count)
      // text
    });
  }
  // 递归绘制⼦节点
  el.childs && el.childs.forEach(child => draw(child, true));
}

const createCanvasApp = (App) => {
  const app = renderer.createApp(App)
  const mount = app.mount
  app.mount = (selector) => {
    canvas = document.createElement('canvas')
    canvas.width = window.innerWidth
    canvas.height = 600
    ctx = canvas.getContext('2d')
    document.querySelector(selector).append(canvas)
    mount(canvas)
  }
  return app
}

onMounted(() => {
  createCanvasApp(CustomRenderer)
      .mount('#about')
})

</script>

<style scoped>

</style>