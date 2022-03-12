<template>
  <CSRPanel id="csr" />
</template>

<script>
import CSRPanel from '@/components/CSRPanel.vue'

export default {
  name: 'CSRPanelView',
  components: {
    CSRPanel
  },
  mounted() {
    this.checkAPIConnection()
  },
  methods: {
    checkAPIConnection() {
      const host = this.$host

      if (host == undefined || host == null || host == '') {
        alert('API Host is not set yet.')
        this.$router.push('/setting')
        return
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#csr {
  width: 90%;
  margin: 50px auto;
}
</style>