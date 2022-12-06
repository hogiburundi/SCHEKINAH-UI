import Vue from 'vue'
import axios from "axios"
import App from './App.vue'
import router from './router'
import store from './store'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
	faCheck,
  faTimes,
  faUser,
  faSignOutAlt,
  faSearch,
  faUnlock,
  faPen,
  faLock,
  faListAlt,
  faTrash,
  faUsers,
  faPlay,
  faPause
} from '@fortawesome/free-solid-svg-icons'

library.add(faCheck)
library.add(faTimes)
library.add(faUser)
library.add(faUsers)
library.add(faSignOutAlt)
library.add(faSearch)
library.add(faUnlock)
library.add(faLock)
library.add(faPen)
library.add(faListAlt)
library.add(faTrash)
library.add(faPlay)
library.add(faPause)

Vue.component('fa', FontAwesomeIcon)

Vue.mixin({
  methods: {
    isNumeric(x) {
      let str = x.toString();
      if (str.match(/^[0-9]+$/)) return true;
      return false;
    },
    nombre(x) {
      let cash = parseInt(x)
      if(!x) return "0";
      return cash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    money(x) {
      let cash = parseFloat(x).toFixed(1)
      if(!x) return "0";
      return cash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    cleanString(str){
      if ((str===null) || (str==='')){
        return ""
      }
      if(JSON.stringify(str).includes("Django")){
        return "données reçues invalides"
      };
      if(typeof(str)=='object'){
        let string = ""
        for( let [clef, valeur] of Object.entries(str)){
          if(typeof(valeur)=='object'){
            let child = ""
            for( let [key, value] of Object.entries(valeur)){
              child += `${key}: ${value} `
            }
            valeur = child;
          }
          string+=`${clef}: ${valeur}<br>`
        }
        return string;
      };
      str = str.toString();
      return str.replace(/(<style[\w\W]+style>)/g, "").replace( /(<([^>]+)>)/ig, '');
    },
    getGroupName(id){
      let group = this.$store.state.groups.find(x => x.id == id)
      return !!group? group.name:"-";
    },
    getGroupId(name){
      let group = this.$store.state.groups.find(x => {
        return x.name.toLowerCase() == name.toLowerCase()
      })
      return !!group? group.id:-1;
    },
    userIs(personnel, group_id){
      let groups = personnel.user.groups;
      return groups.includes(group_id);
    },
    datetime(x) {
      if(!x) return "-"
      let date = new Date(x);
    	return new Intl.DateTimeFormat(
    		'en-GB',
    		{ dateStyle: 'short', timeStyle: 'short' }
    	).format(date)
    },
    onlyDate(x) {
      if(!x) return "-"
      let date = new Date(x);
      return new Intl.DateTimeFormat(
        'en-GB',
        { dateStyle: 'short' }
      ).format(date)
    },
    displayErrorOrRefreshToken(error, callback){
      if(!!error.response){
        if(error.response.data.code == "token_not_valid"){ 
          let refresh = this.$store.state.user.refresh
          if(!refresh){
            this.$store.state.user = null;
            return
          }
          axios.post(this.url+"/refresh/", {"refresh":refresh})
          .then((response) => {
            this.$store.state.user.access = response.data.access
            if(typeof callback == "function") callback()
          }).catch((error) => {
            this.$store.state.user = null;
            console.error(error)
            this.$store.state.alert = {
              type:"danger", message:this.cleanString(error.response.data)
            }
          })
        } else {
          console.error(error)
          this.$store.state.alert = {
            type:"danger", message:this.cleanString(error.response.data)
          }
        }
      } else {
        console.error(error)
      }
    },
    activateRow(e){
      let trs = document.getElementsByTagName("tr")
      let tr = e.target.closest("tr")
      for(let item of trs){
        item.classList.remove("active_row")
      }
      tr.classList.add("active_row")
    },
    getSexe(compte){
      if(compte.sexe == "H") return "Homme"
      if(compte.sexe == "F") return "Femme"
      return "N/A"
    },
    getAge(compte){
      if(!compte.naissance) return "-"
      let year = new Date().getFullYear() - compte.naissance
      return `${compte.naissance}(${year}ans)`
    },
    deleteHistory(id){
      let confirm = this.active_user.first_name+" "+this.active_user.last_name;
      if (prompt(`veuiller taper: "${confirm}" pour confirmer`) === confirm) {
        axios.delete(this.url+`/historique/${id}/`, this.headers)
        .then(() => {
          alert("Historique supprime avec success")
        }).catch((error) => {
          this.displayErrorOrRefreshToken(error, this.deleteHistory)
        })
      }else 
  			alert("ABANDONÉE")
    },
  },
  computed:{
    active_user(){
      return this.$store.state.user;
    },
    currentMonthDigit(){
      return new Date().getMonth() + 1;
    },
    active_user_is_responsable(){
      return this.active_user.is_admin || (
        !!this.active_user.groups && 
        this.active_user.groups.includes('responsable')
      );
    },
    user_is_readonly(){
      return this.active_user.groups.includes("readonly")
    },
    user_is_guichetier(){
      return this.active_user.groups.includes("guichetier")
    },
    url(){
      return this.$store.state.url;
    },
    headers(){
      return {
      	headers:{
      		"Authorization":"Bearer "+this.$store.state.user.access
      	}
      }
    }
  }
})

Vue.config.productionTip = false
window.axios = axios;
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
