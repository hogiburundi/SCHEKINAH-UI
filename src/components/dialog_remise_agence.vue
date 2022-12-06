<template>
  <Overlay @close="$emit('close')">
      <div class="field">
        <label for="somme">La Somme à L'agence {{ !!item?item.name:"" }}:</label>
        <input id="somme" type="number" v-model="somme">
        <label for="somme">Vous l'accordez: {{ money(somme) }} FBu</label>
      </div>
      <div class="field">
        <label class="logs">{{ cleanString(logs).slice(0, 60) }}</label>
      </div>
      <button class="btn" @click="remettre">
        Remise
      </button>
  </Overlay>
</template>
<script>
import Overlay from "./dialog_overlay"
export default {
  props:["item"],
  components:{Overlay},
  data(){
    return {
      somme:0, logs:""
    }
  },
  methods:{
    remettre(){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
      this.logs = "affectation en cours..."
      axios.get(this.url+`/agence/${this.item.id}/remise/${this.somme}/`, this.headers)
      .then((response) => {
        this.item.amount = this.item.amount/1 + this.somme/1;
        alert("OK")
        this.$emit("close")
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.remettre)
      });
    }
  }
};
</script>
<style scoped>
.field {
  padding: 0 30px;
  margin-bottom: 8px;
}
.field label, .field input {
  display: block;
  width: 100%;
}
.field input[type='file'] {
  padding: 0;
  border: none;
}
.field label {
  margin-bottom: 5px;
}
.field input {
  height: 28px;
  border: none;
  outline: none;
  padding: 0 10px;
  border: 1px solid #55555555;
}
textarea {
  width: 100%;
  height: 80px;
  resize: none;
}

.btn {
  display: block;
  background: var(--primary);
  color: var(--white);
  padding: 8px 16px;
  border: none;
  outline: none;
  font-size: 17px;
  font-weight: 400;
  margin: 0 30px 0 auto;
  cursor: pointer;
}
</style>
