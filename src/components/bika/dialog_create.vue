<template>
  <Overlay @close="$emit('close')">
      <div class="field">
        <label for="nom">Nom</label>
        <input id="nom" type="text" v-model="nom">
      </div>
      <div class="field">
        <label for="keyword">Rechercher:</label>
        <div class="input">
          <input type="text" autocomplete="off" id="keyword" v-model="keyword"
            placeholder="CNI ou No. de compte" @change="search">
          <button @click="search"><fa icon="search"/></button>
          <div class="result">{{ result }}</div>
        </div>
      </div>
      <div class="field">
        <label for="montant_minimale">Montant minimum: {{ money(montant_minimale)+" FBu" }}</label>
        <input id="montant_minimale" type="number" v-model="montant_minimale">
      </div>
      <div class="field">
        <label for="details">Details:</label>
        <textarea id="details" v-model="details"></textarea>
      </div>
      <div class="field">
        <label class="logs">{{ logs }}</label>
      </div>
      <button class="btn" @click="postTontine">Soumettre</button>
  </Overlay>
</template>
<script>
import Overlay from "../dialog_overlay"
export default {
  components:{Overlay},
  computed:{
    groups(){
      return this.$store.state.groups;
    }
  },
  data(){
    return {
      result:"", keyword:"", compte:null, logs:"",
      nom: "",
      details: "",
      montant_minimale: null
    }
  },
  watch:{
    keyword(new_val){
      let founds = this.$store.state.comptes.filter(x =>{
        return JSON.stringify(x).includes(new_val) && x.id != this.compte.id
      })
      this.result = `found: ${founds.length} results`;
      if(founds.length == 1) {
        this.compte = founds[0]
        this.result = `found: ${founds[0].first_name} ${founds[0].last_name}`;
      }
    }
  },
  methods:{
    search(){
      this.result = "recherche..."
      axios.get(this.$store.state.url+`/compte/?search=${this.keyword}`, this.headers)
      .then((response) => {
        if(response.data.results.length == 1) {
          this.compte = response.data.results[0]
          this.result = `found: ${this.compte.first_name} ${this.compte.last_name}`;
        } else {
          this.result = `found: ${response.data.results.length} results`;
        }
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.search)
        this.result = `found: 0 results`;
      })
    },
    postTontine(){
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
          nom:this.nom,
          details:this.details,
          montant_minimale:this.montant_minimale,
          compte: this.compte.id
        }
      } catch(e){
        this.logs = "Membre non trouvé"
        return
      }
      axios.post(this.url+"/ikirimba/", data, this.headers)
      .then((response) => {
        alert("la tontine a été bien crée!")
        this.$emit("close")
        this.logs = ""
        let ikirimba = response.data
        ikirimba.compte = this.compte
        this.$store.state.ibirimba.push(response.data)
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.postTontine)
      })
    }
  }
};
</script>
<style scoped>
</style>
