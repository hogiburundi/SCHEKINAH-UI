<template>
  <Overlay @close="$emit('close')">
      <AccountFinder @found="setCompte" />
      <div class="field">
        <label for="somme">Somme: {{ money(asked_amount)+" FBu" }}</label>
        <input id="somme" type="number" v-model="asked_amount">
      </div>
      <div class="field">
        <label for="motif">Motif:</label>
        <textarea id="motif" v-model="motif"></textarea>
      </div>
      <div class="field">
        <label for="periode">Periode (mois):</label>
        <input id="periode" type="number" v-model="period_time">
      </div>
      <div class="field">
        <label for="diplome">Taux d'interet mensuel ({{interest_rate*period_time}}):</label>
        <input id="diplome" type="number" v-model="interest_rate">
      </div>
      <div class="field">
        <label class="logs">{{ logs }}</label>
      </div>
      <button class="btn" @click="demander">Soumettre</button>
  </Overlay>
</template>
<script>
import Overlay from "../dialog_overlay"
import AccountFinder from "../account_finder"
export default {
  components:{ Overlay, AccountFinder},
  computed:{
    groups(){
      return this.$store.state.groups;
    }
  },
  data(){
    return {
      compte:null,
      logs:"",
      interest_rate:"",
      tranche_number:"",
      motif:"",
      period_time:"",
      asked_amount:""
    }
  },
  methods:{
    setCompte(compte){
      this.compte = compte
    },
    demander(){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
      this.logs = "creation en cours..."
      try {
        var data = {
          "interest_rate": this.interest_rate*this.period_time,
          "tranche_number": 1,
          "motif": this.motif,
          "period_time": this.period_time,
          "asked_amount": this.asked_amount,
          "account": this.compte.id
        }
      } catch(e){
        this.logs = "Membre non trouvé"
        return
      }
      axios.post(this.url+"/credit/", data, this.headers)
      .then((response) => {
        alert("le credit a été soumis!")
        this.$emit("close")
        this.logs = ""
        let credit = response.data
        credit.account = this.compte
        this.$store.state.credits.push(response.data)
        this.$store.state.history.push({
          "date": response.data.date,
          "details": `Credit au compte ${this.compte.account_number} de ${this.asked_amount}`,
        })
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.demander)
      })
    }
  }
};
</script>
<style scoped>
.found{
  white-space: nowrap;
  padding: 0 0 0 5px;
  display: flex;
  align-items: center;
}
.found *{
  width: inherit;
}
.found label{
  margin: 0;
  margin-left: 5px;
  font-weight: bold;
}
.found:hover{
  background-color: var(--secondary);
}
</style>
