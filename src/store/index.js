import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user : null,
    // url: "/api",
    url: "http://127.0.0.1:8000/api",
    groups: [],
    users:[],
    agences:[],
    comptes:[],
    membres:[],
    home_infos:{
      historique:[]
    },
    credits_overview:{},
    credits:[],
    placements:[],
    history:[],
    cheques:[],
    incomes:[],
    depenses:[],
    ibirimba:[],
    depots_kirimba:[],
    INCOME_TYPES:{
      "INTERET SUR CREDIT":1,
      "DOSSIER CREDIT":2,
      "TENUE DE COMPTE":3,
      "IMPRESSION":4,
      "CREATION DE COMPTE":5,
      "RETRAIT QUITTANCE":6,
      "PRIX VIREMENT":7,
      "AUTRES":0,
      "TOUT":"",
    },
    alert:{type:"", message:"Bienvenue"},
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
