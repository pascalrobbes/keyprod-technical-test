<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1>
            Commande #{{ $store.state.orders[order_index].id }} du
            {{ $filters.frenchDateTimeFormat($store.state.orders[order_index].order_date) }}
          </h1>
          <div>
            <router-link :to="{ name: 'home' }"><span>Retour aux commandes</span> </router-link>
          </div>
        </v-col>
      </v-row>
      <v-row
        ><v-col cols="9">
          <div class="bloc-wrapper">
            <v-table v-if="ordered_products" theme="dark" class="datas-table">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th class="text-left">Référence</th>
                <th class="text-left">Libellé</th>
                <th class="text-left">Poids</th>
                <th class="text-left">Index/qté</th>
                <th class="text-left">Scanné</th>
                <th class="text-left">Colis</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in ordered_products" :key="index">
                <td><img height="50" :src="item.picture" alt="" /></td>
                <td>{{ item.reference }}</td>
                <td>{{ item.label }}</td>
                <td>{{ item.weight }}&nbsp;gr</td>
                <td>{{ item.same_product_index }}</td>
                <td>
                  <v-chip
                    :disabled="order_is_locked"
                    @click="changeScanState(index)"
                    :class="item.scanned ? 'product_scan_ok' : 'product_scan_nok'"
                    >{{ item.scanned ? 'oui' : 'non' }}</v-chip
                  >
                </td>
                <td>
                  <div style="max-width: 130px">
                    <v-select
                      :disabled="!item.scanned || order_is_locked"
                      dark
                      class="mt-4"
                      :items="packages"
                      item-title="name"
                      item-value="name"
                      v-model="item.package"
                      density="compact"
                    ></v-select>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
          </div>
        </v-col>
        <v-col cols="3">
          <div class="bloc-wrapper">
            <v-card v-if="!order_is_locked">
              <v-card-item>
                <v-card-title>QR Code scanner</v-card-title>
                <v-card-subtitle>
                  <v-switch
                    :disabled="order_is_locked"
                    v-model="camera_on"
                    label="Caméra"
                    color="success"
                    hide-details
                  ></v-switch>
                </v-card-subtitle>
              </v-card-item>
              <v-card-text>
                <div v-if="camera_on">
                  <qrcode-stream :camera="camera" @decode="onDecode"> </qrcode-stream>
                </div>
              </v-card-text>
            </v-card>
            <div class="mt-5">
              <v-btn v-if="!order_is_locked" :disabled="order_is_locked" @click="validateOrder" color="green"
                >Valider la commande</v-btn
              >
              <p v-if="order_is_locked" class="alert">
                Cette commande a été validée, elle ne peut plus être modifiée.
              </p>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="!order_is_locked">
        <v-col cols="12">
          <div class="bloc-wrapper<pa">
            <div>
              <v-btn :disabled="order_is_locked" @click="addOrderPackage">Ajouter un colis</v-btn>
            </div>
            <div class="packages">
              <div v-for="(item, index) in packages" :key="index">
                <package
                  :item="item"
                  :products="ordered_products"
                  :order_is_locked="order_is_locked"
                  :removable="packages.length>1"
                  @removePackage = "removePackage"
                ></package>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-dialog v-model="modal_validate_order" width="auto">
        <v-card>
          <v-card-text>
            Vous devez scanner tous les produits et leur affecter un colis avant de valider la
            commande.
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" block @click="modal_validate_order = false">Fermer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>
<script>
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue3-qrcode-reader'
import OrderManagement from '../classes/OrderManagement'
import Package from '../components/Package.vue'
export default {
  data() {
    return {
      modal_validate_order: false,
      order: null,
      order_index: this.$route.params.id,
      ordered_products: null,
      camera_on: false,
      packages: null,
      camera: 'auto',
      order_is_locked: false
    }
  },
  components: {
    QrcodeStream,
    QrcodeDropZone,
    QrcodeCapture,
    Package
  },
  computed: {
    getPackages() {
      return this.orderManagement?.getPackages()
    }
  },
  methods: {
    removePackage(pckg) {
      this.packages = this.orderManagement.removePackage(pckg);
      this.ordered_products = this.orderManagement.getProducts();
    },
    validateOrder() {
      if (!this.orderManagement.isOrderReadyForValidation()) {
        this.modal_validate_order = true
      } else {
        this.order = this.orderManagement.validateOrder(
          this.$store.state.orders[this.order_index],
          this.packages
        )
        this.$store.commit('VALIDATE_ORDER', { order_index: this.order_index, order: this.order })
        this.$router.push('/')
      }
    },
    changeScanState(product_index) {
      this.ordered_products = null
      this.ordered_products = this.orderManagement.changeScanState(product_index)
    },
    addOrderPackage() {
      this.packages = this.orderManagement.addOrderPackage()
      this.ordered_products.packages = this.packages
      console.log('this.packages', this.packages)
    },
    onDecode(label) {
      if (label) {
        let test = /^(KeyNetic|KeyVibe)_V(\d{1})_(\d{6})$/.test(label)
        if (test) {
          this.ordered_products = this.orderManagement.setProductScanned(label)
        } else {
          alert('QR code non reconnu')
        }
      }
    }
  },
  mounted() {
    const products = this.$store.state.products
    const orders = this.$store.state.orders
    this.order = orders[this.order_index]
    this.orderManagement = new OrderManagement()
    this.ordered_products = this.orderManagement.formatOrderForPackaging(this.order, products)
    this.packages = this.orderManagement.getPackages(this.order)
    this.order_is_locked = this.orderManagement.orderIsLocked(this.order)
  }
}
</script>

<style lang="scss" scoped>
.product_scan_ok {
  background-color: green;
}
.product_scan_nok {
  background-color: red;
}
pre {
  font-size: 11px;
}
.packages {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: stretch;
  margin: 15px 0;
  overflow-x: auto;
  padding: 10px 0;
  overflow-y: hidden;
  > div {
    margin-left: 15px;

    &:nth-child(1) {
      margin-left: 0;
    }
  }
}
p.alert {
  color: red;
  margin: 15px 0;
  font-size: 20px;
}
</style>
