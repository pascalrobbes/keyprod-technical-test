<template>
  <main>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1>Gestion des commandes</h1>
          <h2 v-if="ordersCount !== null">{{ ordersCount }} commande(s) à traiter</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="bloc-wrapper">
            <v-table v-if="orders" theme="dark" class="datas-table">
              <thead>
                <tr>
                  <th class="text-left">id</th>
                  <th class="text-left">date</th>
                  <th class="text-left">Client</th>
                  <th class="text-left">Nombre de produits</th>
                  <th class="text-left">Colisage</th>
                  <th class="text-left">Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(order, order_index) in orders" :key="order.id">
                  <td>#{{ order.id }}</td>
                  <td>{{ $filters.frenchDateTimeFormat(order.order_date) }}</td>
                  <td>{{ getCustomerInfos(order) }}</td>
                  <td>{{ order.products.length }}</td>
                  <td>
                    <div v-if="order.packages" class="trackings">
                      <div v-for="(colis, colis_index) in order.packages" :key="colis_index">
                        <v-text-field
                          density="compact"
                          v-model="colis.tracking_number"
                          label="Tracking"
                        ></v-text-field>
                      </div>
                    </div>
                    <div v-else>-</div>
                  </td>
                  <td>
                    <router-link :to="{ name: 'order', params: { id: order_index } }">
                      <v-chip class="link" dark :color="getOrderStatusColor(order.status)">{{
                        order.status
                      }}</v-chip>
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-col></v-row
      >
    </v-container>
  </main>
</template>

<script>
import OrderManagement from '../classes/OrderManagement'

export default {
  mounted() {
    const orderManagement = new OrderManagement()
    this.orders = this.$store.state.orders
    this.customers = this.$store.state.customers
    this.ordersCount = orderManagement.getPendingOrdersCount(this.orders)
    console.log(this.orders)
  },
  data() {
    return {
      ordersCount: null,
      orders: null,
      customers: null
    }
  },
  computed: {},
  methods: {
    getCustomerInfos(order) {
      return this.customers[order.customer_id].name
    },
    getOrderStatusColor(status) {
      switch (status) {
        case 'pending':
          return 'orange'
          break
        default:
          return 'green'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.datas-table {
  width: 100%;
  tbody {
    tr {
      td {
        .link {
          cursor: pointer;
          &:hover {
            background-color: brown;
          }
        }
      }
    }
  }
}
.trackings {
  div:nth-child(1) {
    margin-top: 18px;
  }
}
pre {
  font-size: 11px;
}
</style>
