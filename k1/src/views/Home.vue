<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <p @click="$store.commit('addCount')">数值改变：{{ $store.state.counter }}</p>
    <p>getters: {{ $store.getters.getCounter }}</p>
    <p @click="$store.dispatch('addCount', 100)">actions: xxx</p>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  mounted() {
  }
}
</script>
