<template>
  <h1>Dashboard</h1>
  
  <DashboardHeatmap />
</template>

<script>
import DashboardHeatmap from '@/components/DashboardHeatmap.vue'

export default {
  name: 'DashboardView',
  components: {
    DashboardHeatmap
  }
}
</script>