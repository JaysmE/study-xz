<template>
  <img alt="Vue logo" src="@/assets/logo.png" />
  <div :style="{ marginBottom: '40px' }">
    <router-link
        to="/"
        :style="{ marginRight: '20px' }">index</router-link>
    <router-link to="/about">about</router-link>
  </div>

  <router-view :item-data="itemData"></router-view>
  <el-button type="primary">element-button</el-button>
  <el-input v-model="inputValue"></el-input>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      inputValue: '',
      itemData: {
        header: 'header',
        footer: 'footer'
      }
    }
  }
}
</script>
