<template>
    <Overlay @close="$emit('close')">
        <div class="field">
          <label for="somme">La Somme à L'agence {{ !!item?item.name:"" }}:</label>
          <div class="input-button">
            <input id="somme" type="number" v-model="somme">
            <button @click="somme=item.amount">Disponible</button>
          </div>
          <label for="somme">Vous reprenez : {{ money(somme) }} FBu</label>
        </div>
        <div class="field">
          <label class="logs">{{ cleanString(logs).slice(0, 60) }}</label>
        </div>
        <button class="btn" @click="reprise">
          Reprise
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
        somme:0, logs:"",
      }
    },
    methods:{
      reprise(){
        if(this.user_is_readonly){
          this.$store.state.alert = {
            type:"danger",
            message:"Vous êtes en lecture seule"
          }
          return
        }
        this.logs = "reprise en cours..."
        axios.get(this.url+`/agence/${this.item.id}/reprise/${this.somme}/`, this.headers)
        .then(() => {
          this.item.amount -= this.somme/1;
          alert("OK")
          this.$emit("close")
        }).catch((error) => {
          this.displayErrorOrRefreshToken(error, this.reprise)
        });
      }
    }
  };
  </script>
  <style scoped>

.input-button{
    display: flex;
  }

  .input-checkbox{
    display: flex;

  }
  .input-checkbox>label{
    width: 100%; 
    color: red;
  }
  .input-checkbox{
    display: flex;
    justify-content: flex-start;
    
  }
  .input-button>button{
    margin: 0 5px;
    padding: 0 5px;
    color: white;
    border: none;
    background-color: var(--primary);
  }
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
  