<template>
  <div>
    <div class="text-h3 text-center" v-text="msg"></div>

    <v-divider class="setting-divider"></v-divider>

    <!-- API Setting -->
    <div class="setting-subpanel">
      <div class="text-h5">API Setting</div>
      <v-row>
        
        <v-col cols="6">
          <v-text-field
            v-model="apiUrl"
            append-outer-icon="mdi-check"
            clear-icon="mdi-close-circle"
            clearable
            label="Backend API URL"
            type="text"
            hint="e.g. http://example.com:30000"
            @click:append-outer="setApiUrl"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-badge
        inline
        :color="testResult.color"
      >
        Test for API connection :: {{ testResult.msg }}
      </v-badge>
    </div>

    <!-- viz-rbac Information -->
    <div class="setting-subpanel">
      <div class="text-h5">Information (WIP)</div>
      <div
        v-for="version in information.versions"
        :key="version[0]"
        class="text-subtitle-1 information-item"
      >
        {{ version[0] }} Version : {{ version[1] }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Setting',
  props: {
    msg: String
  },
  data: () => {
    return {
      apiUrl: '',
      testResult: {
        msg: 'Waiting',
        color: '#ffff66'
      },
      information: {
        versions: [
          ['viz-rbac-web', 'unknown'],
          ['viz-rbac-api', 'unknown'],
          ['Kubernetes', 'unknown']
        ]
      }
    }
  },
  mounted() {
    this.getCurrentApiUrl()
  },
  methods: {
    setApiUrl() {
      this.$setHost(this.apiUrl)
      this.connectionTest()
    },
    getCurrentApiUrl() {
      const host = this.$host
      if (host == undefined || host.length == 0 || host == '' || host == null) {
        this.apiUrl = ''
      } else {
        this.apiUrl = host
      }
    },
    connectionTest() {
      const host = this.$host
      const vm = this

      this.$axios.get(host + '/api/res/v1/namespaces')
        .then((resp) => {
          console.log('Connection Test :', resp.data.status_code)
          vm.testResult.msg = 'Success'
          vm.testResult.color = '#97d700'
        })
        .catch((error) => {
          console.log('Connection Test :', error)
          vm.testResult.msg = 'Error'
          vm.testResult.color = '#e22012'
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.setting-divider {
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
}

.setting-subpanel {
  margin-top: 1.5rem;
  margin-bottom: 3rem;
}
</style>
