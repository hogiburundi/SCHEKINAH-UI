<template>
  <Overlay @close="$emit('close')">
      <AccountFinder @found="setCompte" />
      <div class="field">
        <label for="amount">Somme {{ money(amount)||0+" FBu" }}:</label>
        <input id="amount" type="number" v-model="amount" placeholder="montant à placer">
      </div>
      <div class="field">
        <label for="interest">Taux d'interet:</label>
        <input id="interest" type="number" v-model="interest_rate" placeholder="pourcentage">
      </div>
      <div class="field">
        <label for="periode">Periode {{ parseInt(period_time*(365/12)) }} Jours:</label>
        <input id="periode" type="number" v-model="period_time" placeholder="durée en mois" min="12">
      </div>
      <div class="field">
        <label for="intervalle">Intervalle des interet {{ parseInt(intervalle*(365/12)) }} Jours:</label>
        <input id="intervalle" type="number" placeholder="intervalle en mois" v-model="intervalle">
      </div>
      <div class="field">
        <label for="motif">Details:</label>
        <textarea id="motif" v-model="motif"></textarea>
      </div>
      <label class="logs" v-html="logs"></label>
      <button class="btn" @click="createPl">Placer {{ money(amount)||0+" FBu" }}</button>
  </Overlay>
</template>
<script>
import Overlay from "./dialog_overlay"
import AccountFinder from "./account_finder"
export default {
  components:{ Overlay, AccountFinder },
  data(){
    return {
      compte:null,
      amount: "",
      period_time: "",
      interest_rate: "",
      motif: "",
      intervalle: "",
      logs:""
    }
  },
  computed:{
    groups(){
      return this.$store.state.groups;
    }
  },
  watch:{
  },
  methods:{
    setCompte(compte){
      this.compte = compte
    },
    createPl(){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
      let data = {
        "amount": this.amount,
        "period_time": this.period_time,
        "interest_rate": this.interest_rate,
        "motif": this.motif,
        "intervalle": this.intervalle,
        "account": this.compte.id
      }
      axios.post(this.url+"/placement/", data, this.headers)
      .then((response) => {
        alert("le placement a été soumis!")
        this.$emit("close")
        let placement = response.data
        placement.account = this.compte
        this.$store.state.placements.push(response.data)
        this.$store.state.history.push({
          "date": response.data.date,
          "details": `Placement au compte ${this.compte.account_number} de ${this.asked_amount}`,
        })
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.createPl)
      })
    }
  }
};
</script>
<style scoped>
</style>
