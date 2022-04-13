
<script>
import { defineComponent, h } from "vue";

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
      default: ''
    }
  },
  setup(props, { emit }) {
    return () => h(props.icon + '-icon', {}, 'xx')
  }
})
</script>

<style scoped>

</style>