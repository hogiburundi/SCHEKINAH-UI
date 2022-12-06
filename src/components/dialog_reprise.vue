<template>
    <Overlay @close="$emit('close')">
        <div class="field">
          <label for="somme">La Somme à {{ personnel.user.first_name }}:</label>
          <div class="input-button">
            <input id="somme" type="number" v-model="somme">
            <button @click="getDisponible">Disponible</button>
          </div>
          <label for="somme">Vous lui reprenez: {{ money(somme) }} FBu</label>
        </div>
        <div class="field" >
            <div class="input-checkbox">
                <label for="">Cloturer en meme temps l'activite</label>
                <select name="" id="" v-model="done">
                    <option value=1>Oui</option>
                    <option value=0>Non</option>
                </select>
            </div>
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
        somme:0, personnel:{"user":{}}, logs:"",done:false
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
        getDisponible(){
            this.somme = this.personnel.activite.somme_initial+(this.personnel.activite.depot-this.personnel.activite.retrait)
        },
      reprise(){
        if(this.user_is_readonly){
  			this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
  			return
  		}
  		axios.get(this.url+`/personnel/${this.personnel.id}/reprise/${this.somme}/${this.done}/`, this.headers)
  		.then((response) => {
            console.log(response)
  			alert("OK")
  		}).catch((error) => {
  			try {
  				alert(this.cleanString(error.response.data))
  			} catch(e) {
  				console.log(e)
  			}
  		  console.error(error);
  		})
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
  