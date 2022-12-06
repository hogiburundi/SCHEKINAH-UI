<template>
  <div class="container">
    <div class="form">
      <div class="field">
        <label for="username">Username:</label>
        <input id="username" type="text" v-model="username"
          placeholder="Nom d'utilisateur" />
      </div>
      <div class="field">
        <label for="old_password">Ancien Mot de passe:</label>
        <input id="old_password" type="password" v-model="old_password"
          placeholder="Ancien Mot de passe" />
      </div>
      <div class="field">
        <label for="new_password">Nouveau Mot de passe:</label>
        <input id="new_password" type="password" v-model="new_password"
          placeholder="Nouveau Mot de passe" />
      </div>
      <label class="logs">{{ pass_logs }}</label>
      <div class="field">
        <label for="new_password_2">Retaper le mot de passe:</label>
        <input id="new_password_2" type="password" v-model="new_password_2"
          placeholder="Nouveau Mot de passe encore" />
      </div>
      <div class="field">
        <label class="logs">{{ logs }}</label>
      </div>
      <div class="buttons">
        <button class="btn bg-danger" @click="deconnecter">
          <fa icon="sign-out-alt"/> Deconnexion
        </button>
        <button class="btn" @click="changePassword" :v-if="is_valid">
          Changer
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      logs: "",
      old_password:"",
      new_password:"",
      new_password_2:"",
      pass_logs:"",
      username:"",
      is_valid:false
    };
  },
  watch:{
    new_password(new_val){
      this.isPasswordWeak(new_val)
    },
    new_password_2(new_val){
      if(new_val.length==0) this.logs=""
      if(new_val!=this.new_password){
        this.logs = "les nouveaux mot de passe ne se ressemble pas"
      } else {
        this.logs=""
        this.is_valid = true
      }
    }
  },
  methods: {
    isPasswordWeak(password){
      if(password.length<8){
        this.pass_logs = "trop court"
      }else if(new Set(password.split("")).size<5){
        this.pass_logs = "moins de 6 different caractère"
      }else if((password == password.toUpperCase()) || (password==password.toLowerCase())){
        this.pass_logs = "melangez majiscules et miniscules"
      }else if((password.match(/[0-9]+/) == null) || (password.match(/[a-zA-Z]+/) == null)){
        this.pass_logs = "melangez lettres et chiffres"
      } else{
        this.pass_logs = ""
      }
    },
    changePassword() {
      if(!this.is_valid){
        this.logs = "mot de passe trop faible"
        return
      }
      let data = {
        "username":this.username,
        "old_password":this.old_password,
        "new_password":this.new_password
      }
      axios.post(this.url +`/user/changepassword/`, data, this.headers)
      .then((response) => {
        alert("OK");
        this.$emit("close");
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.affectation);
      });
    },
    deconnecter(){
      this.$store.state.user = null
    }
  }
};
</script>
<style scoped>
.container{
  min-height: calc(100vh - 170px);
}
.form{
  width: 400px;
  padding-top: 50px;
  margin: auto;
}
.field label{
  color: #eee;
  font-weight: 700;
}
input{
  border: 2px solid var(--primary);
}
.buttons{
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
}
button{
  margin: 0;
}
</style>
