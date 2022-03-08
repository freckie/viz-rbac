<template>
  <div>
    <div class="text-h3">CSR Management Panel</div>

    <!-- CSR Table -->
    <v-data-table
      :headers="csrHeaders"
      :items="csrs"
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
        <v-icon
          small
          class="mr-2"
          @click="approve(item)"
        >
          mdi-check
        </v-icon>

        <v-icon
          small
          class="mr-2"
          @click="deny(item)"
        >
          mdi-cancel
        </v-icon>
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
      csrs: [
        {
          name: 'freckie',
          username: 'freckie@korea.ac.kr',
          status: 'Pending',
          createdAt: '2022-03-08 18:57',
          signer: 'kubernetes.io/kube-apiserver-client'
        },
        {
          name: 'prof',
          username: 'prof@dnclab.org',
          status: 'Approved',
          createdAt: '2022-03-08 14:11',
          signer: 'dnclab.org/signer-admin'
        }
      ]
    }
  },
  methods: {
    approve(item) {
      alert('approved : ' + item.name)
    },
    deny(item) {
      alert('denied : ' + item.name)
    }
  }
}
</script>

<style lang="sass">
$data-table-expanded-content-box-shadow: null !default

#csr-table
  margin-top: 50px
</style>