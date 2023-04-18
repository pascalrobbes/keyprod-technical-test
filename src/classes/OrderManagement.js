export default class OrderManagement {
  PENDING_ORDER = 'pending'
  VALID_ORDER = 'ready'
  DEFAULT_PACKAGE = 'package #1'
  _products = []
  _packages = [{ name: this.DEFAULT_PACKAGE, tracking_number: null, products: [], weight: 0 }]
  constructor() {}

  /**
   *
   * @param orders
   * @returns {number}
   */
  getPendingOrdersCount(orders) {
    let order_count = 0
    orders.forEach((item) => {
      order_count += item.status == this.PENDING_ORDER ? 1 : 0
    })
    return order_count
  }

  /**
   *
   * @param index
   * @returns {Array}
   */
  changeScanState(index) {
    this._products[index].scanned = !this._products[index].scanned
    if (this._products[index].scanned && !this._products[index].package) {
      this._products[index].package = this.DEFAULT_PACKAGE
    }
    return this.getProducts()
  }

  /**
   *
   * @param label
   * @returns {Array}
   */
  setProductScanned(label) {
    for (let i = 0; i < this._products.length; i++) {
      if (this._products[i].reference == label && !this._products[i].scanned) {
        console.log('PRODUCT ADDED')
        this._products[i].scanned = true
        this._products[i].package = DEFAULT_PACKAGE
        break
      }
    }
    return this.getProducts()
  }

  /**
   *
   * @param order
   * @param packages
   * @returns {Object}
   */
  validateOrder(order, packages) {
    order.packages = packages
    order.status = this.VALID_ORDER
    order.products = this._products
    return order
  }

  /**
   *
   * @returns {boolean}
   */
  isOrderReadyForValidation() {
    let order_is_ready = true
    for (let i = 0; i < this._products.length; i++) {
      if (!this._products[i].scanned || this._products[i].package == null) {
        order_is_ready = false
        break
      }
    }
    return order_is_ready
  }

  /**
   *
   * @param order
   * @returns {Array}
   */
  getPackages(order) {
    console.log('packages', order)
    return JSON.parse(JSON.stringify(this._packages))
  }

  /**
   *
   * @returns {Number}
   */
  getPackagesCount() {
    return this._packages.length
  }

  /**
   *
   * @param pckg
   * @returns {Array}
   */
  removePackage(pckg) {
    this._products.forEach((item) => {
      if (item.package == pckg.name) item.package = null
    })
    const index = this._packages.findIndex((element) => element.name == pckg.name)
    this._packages.splice(index, 1)
    return this.getPackages()
  }

  /**
   *
   * @returns {Array}
   */
  addOrderPackage() {
    const index = this._packages.length + 1
    this._packages.push({
      name: 'package #' + index,
      tracking_number: null,
      products: [],
      weight: 0
    })
    console.log('this._packages', this._packages)
    return this.getPackages()
  }

  /**
   *
   * @returns {Array}
   */
  getProducts() {
    return JSON.parse(JSON.stringify(this._products))
  }

  /**
   *
   * @param order
   * @returns {boolean}
   */
  orderIsLocked(order) {
    return order.status == this.VALID_ORDER ? true : false
  }

  /**
   *
   * @param products
   * @param product_reference
   * @returns {Object}
   */
  getProductExtraInfos(products, product_reference) {
    const product = products.find(({ reference }) => reference === product_reference)
    return product
  }
  /**
   *
   * @param order
   * @param products
   * @returns {Array}
   */
  formatOrderForPackaging(order, products) {
    if (order.status == this.PENDING_ORDER) {
      order.products.forEach((item) => {
        for (let i = 0; i < item.qte; i++) {
          const product_infos = this.getProductExtraInfos(products, item.reference)
          const product = {
            id: item.id,
            reference: item.reference,
            weight: product_infos.weight,
            label: product_infos.label,
            picture: '/products/thumbs/' + item.reference + '.png',
            same_product_index: i + 1 + '/' + item.qte,
            scanned: false,
            package: null
          }
          this._products.push(product)
        }
      })
    } else {
      this._products = order.products
    }
    return this.getProducts()
  }
}
