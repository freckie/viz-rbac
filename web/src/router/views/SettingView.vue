<template>
  <Setting
    id="setting"
    msg="Welcome to viz-rbac Dashboard !"
  />
</template>

<script>
import Setting from '@/components/Setting.vue'

export default {
  name: 'SettingView',
  components: {
    Setting
  }
}
</script>

<style lang="scss" scoped>
#setting {
  width: 90%;
  margin: 50px auto;
}
</style>