<template>
  <Overlay @close="$emit('close')">
      <div class="field" v-for="depot in depots">
        <label>{{ depot.fullname }}</label>
        <input type="number" v-model="depot.montant">
      </div>
      <div class="field">
        <label class="total">{{ 
          money(depots.reduce((acc, x) => acc+parseInt(x.montant),0))
        }}
        </label>
        <label class="logs">{{ logs }}</label>
      </div>
      <button class="btn" @click="postDepots">Soumettre</button>
  </Overlay>
</template>
<script>
import Overlay from "../dialog_overlay"
export default {
  props:["tontine", "membres"],
  components:{Overlay},
  data(){
    return {
      logs:"", depots:this.genDepots(), ikirimba:{}
    }
  },
  watch:{
    membres(new_val){
      this.depots = this.genDepots()
    },
    tontine(new_val){
      this.ikirimba = !!new_val?new_val:{}
    }
  },
  methods:{
    genDepots(){
      return this.membres.map(x => {
        return {
          membre:x.id,
          fullname:`${x.compte.first_name} ${x.compte.last_name}`,
          montant:this.ikirimba.montant_minimale
        }
      })
    },
    postDepots(){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
      axios.post(this.url+`/depot-kirimba/`, this.depots,this.headers)
      .then((response) => {
        let tot = this.depots.reduce((acc, x) => acc+parseInt(x.montant),0)
        this.ikirimba.montant_total += tot
        let current
        for(let membre of this.membres){
          current = this.depots.find(x => x.membre == membre.id)
          membre.montant += current.montant
        }
        this.$emit("done")
      })
    }
  }
};
</script>
<style scoped>
</style>
