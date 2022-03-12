<template>
  <div>
    <div class="text-h3">CSR Management Panel</div>

    <!-- CSR Table -->
    <v-data-table
      :headers="csrHeaders"
      :items="items"
      :expanded.sync="expanded"
      item-key="name"
      show-expand
      id="csr-table"
      class="elevation-1"
    >
      <!-- Title -->
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Certificate Signing Requests</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            dark
            class="mb-2"
            @click="getCSRs()"
          >
            <v-icon>mdi-refresh</v-icon>
            Refresh
          </v-btn>
        </v-toolbar>
      </template>

      <!-- Expanded Item -->
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          Signer : {{ item.signer }}
        </td>
      </template>

      <!-- Actions -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              @click="approve(item)"
              :disabled="!(item.status == 'Pending')"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon small>mdi-check</v-icon>
            </v-btn>
          </template>
          <span>Approve</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              @click="deny(item)"
              :disabled="!(item.status == 'Pending')"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon small>mdi-cancel</v-icon>
            </v-btn>
          </template>
          <span>Deny</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </div>  
</template>

<script>
export default {
  name: 'CSRPanel',
  data: () => {
    return {
      expanded: [],
      csrHeaders: [
        { text: 'CSR Name', value: 'name', sortable: false },
        { text: 'User Name', value: 'username', sortable: false },
        { text: 'Status', value: 'status', sortable: false },
        { text: 'Created At', value: 'createdAt', sortable: false },
        { text: 'Approval', value: 'actions', sortable: false },
      ],
      items: []
    }
  },
  mounted() {
    this.getCSRs()
  },
  methods: {
    approve(item) {
      this._approveOrDeny(item, true)
    },
    deny(item) {
      this._approveOrDeny(item, false)
    },
    clearItems() {
      this.items = []
    },
    getCSRs() {
      const host = this.$host
      const vm = this

      this.$axios.get(host + '/api/res/v1/csrs')
        .then((resp) => {
          vm.clearItems()
  
          const csrs = resp.data.data.csrs
          csrs.forEach(csr => {
            vm.items.push({
              name: csr.name,
              username: csr.username,
              status: csr.status,
              createdAt: csr.created_at,
              signer: csr.signer_name
            })
          })
        })
        .catch((error) => {
          console.log('[ERROR]', error)
          alert('Unexpected error occurred.')
        })
    },
    _approveOrDeny(item, approval=true) {
      const host = this.$host
      const vm = this

      this.$axios.patch(host + '/api/res/v1/csrs/' + item.name, {
        condition: approval ? 'Approved' : 'Denied',
        reason: 'no reason',
        message: 'no message'
      })
        .then((resp) => {
          let changed = resp.data.data.changed_condition
          alert('The status of CertificateSigningRequest ' + item.name + ' has been changed to ' + changed + '.')
          vm.getCSRs()
        })
        .catch((error) => {
          console.log('[ERROR]', error)
          alert('Unexpected error occurred.')
        })
    }
  }
}
</script>

<style lang="sass">
$data-table-expanded-content-box-shadow: null !default

#csr-table
  margin-top: 50px
</style>