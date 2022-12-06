<template>
  <Overlay @close="$emit('close')">
      <div class="field">
        <label for="somme">La Somme à {{ personnel.user.first_name }}:</label>
        <input id="somme" type="number" v-model="somme">
        <label for="somme">Vous lui accordez: {{ money(somme) }} FBu</label>
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
      somme:0, personnel:{"user":{}}, logs:""
    }
  },
  watch:{
    item(new_val){
      if(!!new_val){
        this.personnel = new_val
      } else {
        this.personnel = {"user":{}}
        this.$emit("close")
      }
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
      let data = {
        "personnel":this.personnel.id,
        "somme_initial":this.somme
      }
      axios.get(this.url+`/personnel/${this.personnel.id}/remise/${this.somme}/`, this.headers)
      .then((response) => {
        let somme = parseFloat(this.personnel.activite.somme_initial);
        this.somme = parseInt(this.somme);
        this.personnel.activite.somme_initial = somme + this.somme;
        this.$store.state.user['_Montant agence'] -= this.somme
        this.somme = 0; this.logs = ""
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
