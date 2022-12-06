<template>
  <Overlay @close="$emit('close')">
    <div class="field">
      <label for="montant">Montant:</label>
      <input id="montant" type="number" v-model="montant">
    </div>
    <div class="field">
      <label for="date">Date:</label>
      <input id="date" type="date" autocomplete="off" v-model="date">
    </div>
    <div class="field">
      <label for="details">Details:</label>
      <textarea id="details" v-model="details"></textarea>
    </div>
    <div class="field">
      <label class="logs">{{ logs }}</label>
    </div>
    <button class="btn" @click="postData">
      Soumettre
    </button>
  </Overlay>
</template>
<script>
import Overlay from "./dialog_overlay"
export default {
  components:{Overlay},
  data(){
    return {
      montant:0,
      icome_type:0,
      details:"",
      date:null,
      logs:""
    }
  },
  methods:{
    postData(){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
      let data = {
        montant:this.montant,
        icome_type:this.icome_type,
        details:this.details,
        date:this.date
      }
      axios.post(this.url+"/income/", data, this.headers )
      .then((response) => {
        this.$store.state.incomes.push(response.data)
        this.$emit("close")
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.performAction)
      })
    }
  }
};
</script>
<style scoped>
.content{
  width: 150px!important;
}
</style>
