<template>
  <div
    v-if="!hidden"
    id="info-wrapper"
    class="text-center"
  >
    <div v-if="title != null" class="text-h4 info-text" v-text="title"></div>
    <div v-if="description != null" class="text-subtitle-1 info-text" v-text="description"></div>
  
    <v-progress-circular
      v-if="circular"
      :width="7"
      :size="70"
      color="green"
      indeterminate
    >
    </v-progress-circular>
  </div>
</template>

<script>
export default {
  name: 'Info',
  props: {
    title: String,
    description: String,
    circular: Boolean,
    showOnMounted: Boolean,
  },
  data: () => {
    return {
      hidden: false
    }
  },
  mounted() {
    if (this.showOnMounted) this.hidden = false
    else this.hidden = true
  },
  methods: {
    hide() {
      this.hidden = true
    },
    show() {
      this.hidden = false
    }
  }
}
</script>

<style lang="scss" scoped>
#info-wrapper {
  margin-top: 100px;
  margin-bottom: 100px;

  .info-text {
    margin-bottom: 1rem;
  }

  .v-progress-circular {
    margin: 1rem;
  }
}
</style>