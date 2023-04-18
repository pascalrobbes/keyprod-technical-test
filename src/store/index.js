import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      app_title: 'Demo',
      orders: [
        {
          id: 1,
          order_date: '2023-04-01 12:30:30',
          customer_id: 1,
          status: 'pending',
          products: [
            {
              reference: 'KeyNetic_V1_000001',
              qte: 2
            },
            {
              reference: 'KeyVibe_V1_000002',
              qte: 3
            },
            {
              reference: 'KeyVibe_V2_000003',
              qte: 1
            }
          ]
        },
        {
          id: 2,
          order_date: '2023-04-01 12:30:30',
          customer_id: 1,
          status: 'pending',
          products: [
            {
              reference: 'KeyNetic_V1_000001',
              qte: 3
            },
            {
              reference: 'KeyVibe_V1_000002',
              qte: 1
            },
            {
              reference: 'KeyVibe_V2_000003',
              qte: 2
            },
            {
              reference: 'KeyVibe_V2_000004',
              qte: 1
            }
          ]
        },
        {
          id: 3,
          order_date: '2023-04-01 12:30:30',
          customer_id: 3,
          status: 'pending',
          products: [
            {
              reference: 'KeyVibe_V2_000003',
              qte: 2
            },
            {
              reference: 'KeyVibe_V1_000002',
              qte: 1
            },
            {
              reference: 'KeyNetic_V1_000001',
              qte: 2
            }
          ]
        }
      ],
      products: [
        {
          id: 1,
          reference: 'KeyNetic_V1_000001',
          label: 'KeyNetic (version 1.0)',
          weight: '350'
        },
        {
          id: 2,
          reference: 'KeyVibe_V1_000002',
          label: 'KeyVibe (version 1.0)',
          weight: '450'
        },
        {
          id: 3,
          reference: 'KeyVibe_V2_000003',
          label: 'KeyVibe (version 2)',
          weight: '500'
        },
        {
          id: 4,
          reference: 'KeyVibe_V2_000004',
          label: 'KeyVibe (version 2.1)',
          weight: '475'
        }
      ],
      customers: [
        {
          id: 1,
          name: 'dummy customer #1'
        },
        {
          id: 2,
          name: 'dummy customer #2'
        },
        {
          id: 3,
          name: 'dummy customer #3'
        },
        {
          id: 4,
          name: 'dummy customer #4'
        },
        {
          id: 5,
          name: 'dummy customer #5'
        }
      ]
    }
  },
  getters: {},
  mutations: {
    VALIDATE_ORDER(state, payload) {
      state.orders[payload.order_index] = payload.order
      console.log('state.orders', state.orders)
    }
  },
  actions: {},
  modules: {}
})
