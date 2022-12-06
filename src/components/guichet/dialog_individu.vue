<template>
  <Overlay @close="$emit('close')">
    <SpinnerComp v-if="en_cours"></SpinnerComp>
    <div class="doubled">
      <div class="field">
        <label for="nom">Nom:</label>
        <input id="nom" type="text" v-model="last_name">
      </div>
      <div class="field">
        <label for="prenom">Prenom:</label>
        <input id="prenom" type="text" v-model="first_name">
      </div>
      <div class="field">
        <label for="cni">CNI:</label>
        <input id="cni" type="text" autocomplete="off" v-model="CNI">
      </div>
      <div class="field">
        <label for="sexe">Sexe:</label>
        <select v-model="sexe">
          <option value="H">Homme</option>
          <option value="F">Femme</option>
        </select>
      </div>
      <div class="field">
        <label for="naissance">Année de naissance:</label>
        <input v-model="naissance"
          id="naissance" type="number" min="1950" 
          autocomplete="off">
      </div>
      <div class="field">
        <label for="numero">Numero de telephone:</label>
        <input id="numero" type="text" autocomplete="off" v-model="phone_number">
      </div>
      <div class="field">
        <label for="adresse">Adresse:</label>
        <input id="adresse" type="text" autocomplete="off" v-model="adress">
      </div>
      <div class="field">
        <label for="confiance">Personne de confiance:</label>
        <input id="confiance" type="text" autocomplete="off" v-model="confiance">
      </div>
      <div class="field">
        <label for="CNI_confiance">CNI de confiance:</label>
        <input id="CNI_confiance" type="text" autocomplete="off" v-model="CNI_confiance">
      </div>
      <div class="field">
        <label for="sexe">Type de creation:</label>
        <select v-model="creation_type">
          <option value="1">Non payante</option>
          <option value="2">Payante : Sans Cheque</option>
          <option value="3">Payante : Avec Cheque</option>
        </select>
      </div>
    </div>
    <input id="image1" type="file" accept=".jpeg,.jpg,.png" @change="e => loadImage(e)">
    <input id="image2" type="file" accept=".jpeg,.jpg,.png" @change="e => loadImage(e)">
    <input id="image3" type="file" accept=".jpeg,.jpg,.png" @change="e => loadImage(e)">
    <div class="tripled">
      <div class="image" @click="clickOn('image1')">
        <img :src="!!img1_src?img1_src:'/static/logo.png'" alt="">
      </div>
      <div class="image" @click="clickOn('image2')">
        <img :src="!!img2_src?img2_src:'/static/logo.png'" alt="">
      </div>
      <div class="image" @click="clickOn('image3')">
        <img :src="!!img3_src?img3_src:'/static/logo.png'" alt="">
      </div>
    </div>
    <div class="field">
      <label class="logs">{{ logs }}</label>
    </div>
    <button class="btn" v-if="!en_cours" @click="createMember">
      Soumettre
    </button>
  </Overlay>
</template>
<script>
import Overlay from "../dialog_overlay"
import SpinnerComp from "../spinner_comp"
export default {
  props:["item"],
  components:{Overlay,SpinnerComp},
  data(){
    return {
      spinner:false,
      first_name: "",
      last_name: "",
      phone_number: "",
      sexe: "",
      adress: "",
      naissance: "",
      document1: null,
      document2: null,
      document3: null,
      CNI: "",
      account_type: null,
      confiance: "",
      CNI_confiance: "",
      logs:"",
      img1_src:"",
      img2_src:"",
      img3_src:"",
      en_cours:false,
      creation_type:3
    }
  },
  watch:{
    item(new_val){
      if(!!new_val){
        this.last_name = new_val.last_name
        this.first_name = new_val.first_name
        this.phone_number = new_val.phone_number
        this.sexe = new_val.sexe
        this.naissance = new_val.naissance
        this.adress = new_val.adress
        this.CNI = new_val.CNI
        this.confiance = new_val.confiance
        this.CNI_confiance = new_val.CNI_confiance
        this.img1_src = new_val.document1
        this.img2_src = new_val.document2
        this.img3_src = new_val.document3
      } else {
        this.last_name = ""
        this.first_name = ""
        this.phone_number = ""
        this.naissance = ""
        this.sexe = ""
        this.adress = ""
        this.CNI = ""
        this.confiance = ""
        this.CNI_confiance = ""
      }
    }
  },
  methods:{
    clickOn(id){
      let img = document.getElementById(id)
      img.click()
    },
    loadImage(event){
      let file = event.target.files[0]
      if (file.size>300_000) {
        this.logs = "l'image ne peut pas depasser 300ko"
      } else {
        this.logs = ""
        let fr = new FileReader();
        let vue = this
        fr.onload = function(){
          switch (event.target.id) {
            case "image1":
              vue.document1 = file
              vue.img1_src = fr.result
              break;
            case "image2":
              vue.document2 = file
              vue.img2_src = fr.result
              break;
            default:
              vue.document3 = file
              vue.img3_src = fr.result
              break;
          }
        }
        fr.readAsDataURL(file);
      }
    },
    createMember(){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
      this.en_cours = true
      this.logs = ""
      if( !this.last_name || !this.first_name || !this.phone_number || !this.adress || !this.CNI){
        this.logs = "tout les champs sont requises"
        return;
      }
      
      let data = new FormData()
      data.append("last_name", this.last_name)
      data.append("first_name", this.first_name)
      data.append("phone_number", this.phone_number)
      data.append("naissance", this.naissance)
      data.append("sexe", this.sexe)
      data.append("adress", this.adress)
      data.append("CNI", this.CNI)
      data.append("confiance", this.confiance)
      data.append("CNI_confiance", this.CNI_confiance)
      data.append("creation_type", this.creation_type)
      data.append("is_organization", false)


      if(!!this.document1 && typeof this.document1 != "string"){
        data.append("document1", this.document1)
      }
      if(!!this.document2 && typeof this.document2 != "string"){
        data.append("document2", this.document2)
      }
      if(!!this.document3 && typeof this.document3 != "string"){
        data.append("document3", this.document3)
      }
      data.append("organisation", null)

      if(!!this.item){
        axios.patch(this.$store.state.url+`/compte/${this.item.id}/`, data, this.headers)
        .then((response) => {
          let index = this.$store.state.comptes.indexOf(this.item)
          this.$store.state.comptes[index] = response.data
          this.$emit("close")
        }).catch((error) => {
          this.displayErrorOrRefreshToken(error, this.createMember)
        }).finally(() => this.en_cours = false)
      } else {
        if(confirm("Verifiez si les informations fournies sont correctes !")){
          this.spinner = true
          axios.post(this.$store.state.url+"/compte/", data, this.headers)
          .then((response) => {
            this.$store.state.comptes.push(response.data)
            this.$emit("close")
          }).catch((error) => {
            this.displayErrorOrRefreshToken(error, this.createMember)
          }).finally(() => this.en_cours = false)
        }
        else
          alert("Abandonee")
          this.en_cours = false
      }
    },
    updateMember(){
      alert("updated")
    }
  }
};
</script>
<style scoped>
.doubled{
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0 10px;
}
.field{
  padding: 0 5px;
}
.inlinefield{
  display: flex;
  align-items: center;
}
.inlinefield *{
  margin: 5px;
  font-weight: 600;
  color: var(--primary);
}
input[type="file"]{
  display: none;
}
.tripled{
  display: flex;
  justify-content: space-evenly;
}
.image{
  border: 2px solid black;
  background-color: lightgray;
  min-height: 50px;
  width: 30%;
}
img{
  width: 100%;
}
</style>
