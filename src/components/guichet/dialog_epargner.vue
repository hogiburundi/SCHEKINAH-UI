<template>
  <Overlay @close="$emit('close')">
      <div class="field">
        <label for="epargne_end_date">Date de cloture:</label>
        <input id="epargne_end_date" type="date" v-model="epargne_end_date">
      </div>
    <div class="field">
      <label class="logs">{{ logs }}</label>
    </div>
    <button class="btn" @click="createEpargne">
      Soumettre
    </button>
  </Overlay>
</template>
<script>
import { faL } from "@fortawesome/free-solid-svg-icons";
import Overlay from "../dialog_overlay"
export default {
  props:["item"],
  components:{Overlay},
  data(){
    return {
      epargne_end_date:"", logs:"", mouvement:""
    }
  },
  watch:{
    mouvement(new_val){
      console.log(new_val)
    }
  },
  methods:{
    createEpargne(){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
      let data = {
        epargne_end_date: this.epargne_end_date,
        epargne_start_date: new Date().toLocaleDateString("en-CA", { format: 'short' }) 
      }
      axios.patch(this.$store.state.url+`/compte/${this.item.id}/`, data, this.headers)
        .then((response) => {
          let index = this.$store.state.comptes.indexOf(this.item)
          this.$store.state.comptes[index] = response.data
          this.$emit("close")
        }).catch((error) => {
          this.displayErrorOrRefreshToken(error, this.createMember)
      })
    }
  }
};
</script>
<style scoped>
.radio-mouvement{
  display: flex;
  justify-content: space-around;
  margin: 20px;
  align-items: center;
}
</style>
