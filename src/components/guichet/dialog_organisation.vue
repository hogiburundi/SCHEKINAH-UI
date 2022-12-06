<template>
  <div class="parent">
    <div class="content">
      <div class="close" @click="$emit('close')">&times;</div>
      <div class="fields">
        <fieldset>
          <legend>Organisation</legend>
          <div class="doubled">
            <div class="field">
              <label for="first_name">Nom(Sigle):</label>
              <input id="first_name" type="text" v-model="first_name">
            </div>
            <div class="field">
              <label for="last_name">Nom en toute lettre:</label>
              <input id="last_name" type="text" v-model="last_name">
            </div>
            <div class="field">
              <label for="status_j">Statut Juridique:</label>
              <input id="status_j" type="text" v-model="status_j">
            </div>
            <div class="field">
              <label for="NIF">NIF:</label>
              <input id="NIF" type="text" autocomplete="off" v-model="NIF">
            </div>
            <div class="field">
              <label for="RC">Registre de Commerce:</label>
              <input id="RC" type="text" autocomplete="off" v-model="RC">
            </div>
            <div class="field">
              <label for="cible">Cible:</label>
              <input id="cible" type="text" autocomplete="off" v-model="cible">
            </div>
            <div class="field">
              <label for="adress">Adresse:</label>
              <input id="adress" type="text" autocomplete="off" v-model="adress">
            </div>
            <div class="field">
              <label for="date_emission">Date d'émission:</label>
              <input id="date_emission" type="date" v-model="date_emission">
            </div>
            <div class="field">
              <label for="No_ord_min">No. ord ministeriel:</label>
              <input id="No_ord_min" type="text" autocomplete="off" v-model="No_ord_min">
            </div>
            <div class="field">
              <label for="capital">Capital:</label>
              <input id="capital" type="number" autocomplete="off" v-model="capital">
            </div>
            <div class="field">
              <label for="phone_number">Contact:</label>
              <input id="phone_number" type="text" autocomplete="off" v-model="phone_number">
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>Titulaire principal</legend>
          <div class="doubled">
            <div class="field">
              <label for="fullname_principal">Nom:</label>
              <input id="fullname_principal" type="text" v-model="fullname_principal">
            </div>
            <div class="field">
              <label for="phone_number_principal">Numero de telephone:</label>
              <input id="phone_number_principal" type="text" v-model="phone_number_principal">
            </div>
            <div class="field">
              <label for="CNI_principal">CNI:</label>
              <input id="CNI_principal" type="text" autocomplete="off" v-model="CNI_principal">
            </div>
            <div class="field">
              <label for="adress_principal">Adresse:</label>
              <input id="adress_principal" type="text" autocomplete="off" v-model="adress_principal">
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>Titulaire adjoint 1</legend>
          <div class="doubled">
            <div class="field">
              <label for="fullname_adjoint_1">Nom et prenom:</label>
              <input id="fullname_adjoint_1" type="text" v-model="fullname_adjoint_1">
            </div>
            <div class="field">
              <label for="CNI_adjoint_1">CNI:</label>
              <input id="CNI_adjoint_1" type="text" autocomplete="off" v-model="CNI_adjoint_1">
            </div>
            <div class="field">
              <label for="phone_number_adjoint_1">Numero de telephone:</label>
              <input id="phone_number_adjoint_1" type="text" autocomplete="off" v-model="phone_number_adjoint_1">
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>Titulaire adjoint 2</legend>
          <div class="doubled">
            <div class="field">
              <label for="fullname_adjoint_2">Nom et Prenom:</label>
              <input id="fullname_adjoint_2" type="text" v-model="fullname_adjoint_2">
            </div>
            <div class="field">
              <label for="CNI_adjoint_2">CNI:</label>
              <input id="CNI_adjoint_2" type="text" autocomplete="off" v-model="CNI_adjoint_2">
            </div>
            <div class="field">
              <label for="phone_number_adjoint_2">Numero de telephone:</label>
              <input id="phone_number_adjoint_2" type="text" autocomplete="off" v-model="phone_number_adjoint_2">
            </div>
          </div>
        </fieldset>
        <input id="img1" type="file" accept=".jpeg,.jpg,.png" @change="e => loadImage(e)">
        <input id="img2" type="file" accept=".jpeg,.jpg,.png" @change="e => loadImage(e)">
        <input id="img3" type="file" accept=".jpeg,.jpg,.png" @change="e => loadImage(e)">
        <div class="tripled">
          <div class="image" @click="clickOn('img1')">
            <img :src="!!img1_src?img1_src:'/static/logo.png'" alt="">
          </div>
          <div class="image" @click="clickOn('img2')">
            <img :src="!!img2_src?img2_src:'/static/logo.png'" alt="">
          </div>
          <div class="image" @click="clickOn('img3')">
            <img :src="!!img3_src?img3_src:'/static/logo.png'" alt="">
          </div>
        </div>
        <div class="field">
          <label class="logs">{{ logs }}</label>
        </div>
      </div>
      <button class="btn" @click="createMember">
        Soumettre
      </button>
    </div>
  </div>
</template>
<script>
import Overlay from "../dialog_overlay"
export default {
  props:["item"],
  components:{Overlay},
  data(){
    return {
      status_j: "",
      cible: "",
      No_ord_min: "",
      NIF: "",
      RC: "",
      capital: null,
      date_emission: null,
      fullname_principal: "",
      phone_number_principal: "",
      CNI_principal: "",
      adress_principal: "",
      fullname_adjoint_1: "",
      phone_number_adjoint_1: "",
      CNI_adjoint_1: "",
      fullname_adjoint_2: "",
      phone_number_adjoint_2: "",
      CNI_adjoint_2: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      adress: "",
      document1: null,
      document2: null,
      document3: null,
      CNI: "",
      account_type: null,
      is_active: false,
      confiance: "",
      CNI_confiance: "",
      img1_src:"",
      img2_src:"",
      img3_src:"",
      logs:""
    }
  },
  watch:{
    item(new_val){
      if(!!new_val){
        if(new_val.organisation == null) return
        this.status_j = new_val.organisation.status_j
        this.cible = new_val.organisation.cible
        this.No_ord_min = new_val.organisation.No_ord_min
        this.NIF = new_val.organisation.NIF
        this.RC = new_val.organisation.RC
        this.capital = new_val.organisation.capital
        this.date_emission = new_val.organisation.date_emission
        this.naissance = new_val.organisation.naissance
        this.fullname_principal = new_val.organisation.fullname_principal
        this.phone_number_principal = new_val.organisation.phone_number_principal
        this.CNI_principal = new_val.organisation.CNI_principal
        this.adress_principal = new_val.organisation.adress_principal
        this.fullname_adjoint_1 = new_val.organisation.fullname_adjoint_1
        this.phone_number_adjoint_1 = new_val.organisation.phone_number_adjoint_1
        this.CNI_adjoint_1 = new_val.organisation.CNI_adjoint_1
        this.fullname_adjoint_2 = new_val.organisation.fullname_adjoint_2
        this.phone_number_adjoint_2 = new_val.organisation.phone_number_adjoint_2
        this.CNI_adjoint_2 = new_val.organisation.CNI_adjoint_2

        this.first_name = new_val.first_name
        this.last_name = new_val.last_name
        this.phone_number = new_val.phone_number
        this.adress = new_val.adress
        this.document1 = new_val.document1
        this.document2 = new_val.document2
        this.document3 = new_val.document3
        this.CNI = new_val.CNI
        this.account_type = new_val.account_type
        this.is_active = new_val.is_active
        this.confiance = new_val.confiance
        this.CNI_confiance = new_val.CNI_confiance
        this.img1_src = new_val.document1
        this.img2_src = new_val.document2
        this.img3_src = new_val.document3
      } else {
        this.status_j = ""
        this.cible = ""
        this.No_ord_min = ""
        this.NIF = ""
        this.RC = ""
        this.capital = null
        this.date_emission = null
        this.naissance = null
        this.fullname_principal = ""
        this.phone_number_principal = ""
        this.CNI_principal = ""
        this.adress_principal = ""
        this.fullname_adjoint_1 = ""
        this.phone_number_adjoint_1 = ""
        this.CNI_adjoint_1 = ""
        this.fullname_adjoint_2 = ""
        this.phone_number_adjoint_2 = ""
        this.CNI_adjoint_2 = ""
        this.first_name = ""
        this.last_name = ""
        this.phone_number = ""
        this.adress = ""
        this.document1 = null
        this.document2 = null
        this.document3 = null
        this.CNI = ""
        this.account_type = null
        this.is_active = false
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
            case "img1":
              vue.document1 = file
              vue.img1_src = fr.result
              break;
            case "img2":
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
      this.logs = ""
      let data = new FormData()
      data.append("organisation.status_j", this.status_j)
      data.append("organisation.cible", this.cible)
      data.append("organisation.No_ord_min", this.No_ord_min)
      data.append("organisation.NIF", this.NIF)
      data.append("organisation.RC", this.RC)
      data.append("organisation.capital", this.capital)
      data.append("organisation.date_emission", this.date_emission)
      data.append("organisation.fullname_principal", this.fullname_principal)
      data.append("organisation.phone_number_principal", this.phone_number_principal)
      data.append("organisation.CNI_principal", this.CNI_principal)
      data.append("organisation.adress_principal", this.adress_principal)
      data.append("organisation.fullname_adjoint_1", this.fullname_adjoint_1)
      data.append("organisation.phone_number_adjoint_1", this.phone_number_adjoint_1)
      data.append("organisation.CNI_adjoint_1", this.CNI_adjoint_1)
      data.append("organisation.fullname_adjoint_2", this.fullname_adjoint_2)
      data.append("organisation.phone_number_adjoint_2", this.phone_number_adjoint_2)
      data.append("organisation.CNI_adjoint_2", this.CNI_adjoint_2)
      data.append("organisation.CNI_adjoint_2", this.CNI_adjoint_2)
      data.append("pay_on_create", true)

      data.append("first_name", this.first_name)
      data.append("last_name", this.last_name)
      data.append("phone_number", this.phone_number)
      data.append("adress", this.adress)

      if(!!this.document1 && typeof this.document1 != "string"){
        data.append("document1", this.document1)
      }
      if(!!this.document2 && typeof this.document2 != "string"){
        data.append("document2", this.document2)
      }
      if(!!this.document3 && typeof this.document3 != "string"){
        data.append("document3", this.document3)
      }
      data.append("CNI", this.CNI)
      data.append("account_type", 0)
      data.append("is_active", this.is_active)
      data.append("naissance", new Date(this.date_emission).getFullYear())
      data.append("is_organization", true)
      data.append("confiance", this.confiance)
      data.append("CNI_confiance", this.CNI_confiance)

      if(!!this.item){
        axios.patch(this.$store.state.url+`/compte/${this.item.id}/`, data, this.headers)
        .then((response) => {
          let index = this.$store.state.comptes.indexOf(this.item)
          this.$store.state.comptes[index] = response.data
          this.$emit("close")
        }).catch((error) => {
          this.displayErrorOrRefreshToken(error, this.createMember)
        })
      } else {
        axios.post(this.$store.state.url+"/compte/", data, this.headers)
        .then((response) => {
          this.$store.state.comptes.push(response.data)
          this.$emit("close")
        }).catch((error) => {
          this.displayErrorOrRefreshToken(error, this.createMember)
        })
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
  grid-template-columns: repeat(3, 1fr);
  padding: 0 5px;
}
fieldset{
  margin: 0 10px 10px 10px;
}
.field{
  padding: 0 5px;
}
input[type="file"]{
  display: none;
}
.tripled{
  display: flex;
  justify-content: space-evenly;
}
.image{
  position: relative;
  border: 2px solid black;
  background-color: lightgray;
  height: 150px;
  width: 30%;
  overflow: hidden;
}
img{
  width: 100%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.parent{
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .8);
  width: 100%;
  height: 100%;
  overflow-y: auto;
  z-index: 5;
}
.content{
  background-color: white;
  max-width: 600px;
  margin: 4% auto;
  padding-bottom: 20px;
  height: 90%;
  box-sizing: border-box;
  overflow-y: hidden;
}
.fields{
  max-height: calc(100% - 70px);
  padding-top: 10px;
  overflow-y: auto;
}
.close{
  background-color: red;
  width: 30px;
  height: 30px;
  margin-left: auto;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: var(--white);
  cursor: pointer;
}
.btn{
  margin-top: 10px;
}
@media screen and (max-width: 800px) {
  .content {
    margin: 10% auto;
  }
}
</style>
