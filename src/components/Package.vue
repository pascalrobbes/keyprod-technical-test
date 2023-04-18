<template>
  <v-card width="250">
    <template v-slot:title>
      <p class="text-center">
        <strong>{{ item.name }}</strong>
      </p>
      <div>
        <v-text-field
          :disabled="order_is_locked"
          class="mb-2"
          density="compact"
          label="Numéro de tracking"
          hide-details="auto"
          v-model="item.tracking_number"
        ></v-text-field></div
    ></template>
    <template v-slot:subtitle>
      <p>Poids : <strong>{{ weight }} gr</strong></p>
      <p><strong>{{ product_count }}</strong> produit(s)</p>
      <v-btn class="remove" v-if="removable" @click="removePackage(item)" density="compact" color="red">X</v-btn>
    </template>
  </v-card>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      weight: 0,
      product_count:0
    }
  },
  props: ['item', 'products', 'order_is_locked','removable'],
  mounted() {
    this.setPackageInfos()
  },
  watch: {
    products: {
      handler() {
        this.setPackageInfos()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    removePackage(pckg) {
      this.$emit('removePackage',pckg)
    },
    setPackageInfos() {
      let sum = 0
      this.product_count = 0;
      this.products.map(
        (product) => (sum += product.package == this.item.name ? parseInt(product.weight) : 0)
      )
      this.weight = sum
      this.products.map(
        (product) => (this.product_count += (product.package == this.item.name) ? 1 : 0)
      )
    }
  }
}
</script>

<style scoped>
.remove {
  position:absolute;
  top: 0;
  right: 0;
  margin: 4px;
}
</style>
