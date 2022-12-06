<template>
  <Overlay @close="$emit('close')">
      <div class="field">
        <label for="type_credit">Type de credit:</label>
        <select v-model="amortissement" id="type_credit">
          <option value="0">Amortissement Lineaire</option>
          <option value="1">Amortissement Degressive</option>
        </select>
      </div>

      <div class="field">
        <label for="confirmation">tapez "{{ active_user.first_name }}"</label>
        <input
          type="text"
          autocomplete="off"
          id="confirmation"
          v-model="confirmation"
          placeholder="mot de confirmation">
      </div>
      <div class="field">
        <label for="frais_dcredit">Frais dossier credit</label>
        <select v-model="frais_dcredit" id="frais_dcredit">
          <option value="1">Avec Frais</option>
          <option value="0">Sans Frais</option>
        </select>
      </div>
      <div class="field">
        <label class="logs">{{ logs }}</label>
      </div>
      <button class="btn" @click="demander">Soumettre</button>
  </Overlay>
</template>
<script>
import Overlay from "../dialog_overlay"
export default {
  components:{Overlay},
  props:["credit"],
  data(){
    return {
      logs:"", amortissement:null, confirmation:"",frais_dcredit:1
    }
  },
  methods:{
    demander(){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
      this.logs = ""
      if(this.confirmation != this.active_user.first_name){
        this.logs = "confirmation incorrect"
        return
      }
      axios.get(this.url+`/credit/${this.credit.id}/validate/${this.amortissement}/${this.frais_dcredit}/`, this.headers)
      .then((response) => {
        this.credit.approved_by = this.active_user
        this.$emit("close")
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.demander)
      });
    }
  }
};
</script>
<style scoped>
</style>
