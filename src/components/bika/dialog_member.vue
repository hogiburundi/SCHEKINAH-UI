<template>
  <Overlay @close="$emit('close')">
      <AccountFinder @found="setCompte" />
      <div class="field">
        <label class="logs">{{ logs }}</label>
      </div>
      <button class="btn" @click="postTontine">Soumettre</button>
  </Overlay>
</template>
<script>
import Overlay from "../dialog_overlay"
import AccountFinder from "../account_finder"

export default {
  props:["item"],
  components:{ Overlay, AccountFinder },
  computed:{
    groups(){
      return this.$store.state.groups;
    }
  },
  data(){
    return {
      result:"", keyword:"", compte:null, logs:""
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
    setCompte(compte){
      this.compte = compte
    },
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
          ikirimba: this.item.id,
          compte: this.compte.id
        }
      } catch(e){
        this.logs = "Membre non trouvé"
        return
      }
      axios.post(this.url+"/membre/", data, this.headers)
      .then((response) => {
        this.logs = ""
        this.$emit("added", response.data)
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.postTontine)
      })
    }
  }
};
</script>
<style scoped>
</style>
