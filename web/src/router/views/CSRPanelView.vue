<template>
  <CSRPanel id="csr" />
</template>

<script>
import CSRPanel from '@/components/CSRPanel.vue'

export default {
  name: 'CSRPanelView',
  components: {
    CSRPanel
  }
}
</script>

<style lang="scss" scoped>
#csr {
  width: 90%;
  margin: 50px auto;
}
</style>