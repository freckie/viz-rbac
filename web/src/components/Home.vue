<template>
  <div>
    <img alt="Vue logo" src="@/assets/logo.png" />

    <h1>{{ msg }}</h1>

    <v-divider></v-divider>

    <div id="setting">
      <h3>API Setting</h3>
      <v-row>
        
        <v-col cols="6">
          <v-text-field
            v-model="apiUrl"
            append-outer-icon="mdi-check"
            clear-icon="mdi-close-circle"
            clearable
            label="API URL"
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
  </div>
</template>

<script>
export default {
  name: 'Home',
  props: {
    msg: String
  },
  data: () => {
    return {
      apiUrl: '',
      testResult: {
        msg: 'Waiting',
        color: '#ffff66'
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

<style scoped>
a {
  color: #42b983;
}
</style>
