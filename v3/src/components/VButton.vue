<script lang="jsx">
import { ref } from 'vue'
export default {
  name: "VButton",
  setup() {
    let count = ref(1)
    const handleClick = () => {
      count ++
    }
    return () => (
        <div onClick={ handleClick }  className="v-button" >v-button</div>
    )
  }
}
</script>

<style scoped>

</style>