<template>
  <button @click="modalOpen = true">这是一个模态窗按钮</button>
  <teleport to="body">
    <div v-if="modalOpen" class="modal">
      <div>这是一个teleport组件</div>
      <button @click="modalOpen = false">关闭</button>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'modalButton',
  data() {
    return {
      modalOpen: false
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  background-color: rgba(0,0,0,.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.modal div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  width: 300px;
  height: 300px;
  padding: 5px;
}
</style>