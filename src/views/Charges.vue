<template>
  <div class="container">
    <PrintableHeader/>
    <div class="row nonprintable">
      <div class="left">
        <div class="field">
          <label for="du">Du: </label>
          <input type="date" id="du" v-model="du">
        </div >
        <div class="field">
          <label for="au">Au: </label>
          <input type="date" id="au" v-model="au">
        </div>
        <button class="btn-sm bg-primary" @click="filterDate">Filtrer</button>
      </div>
      <div class="buttons">
        <button class="btn-sm bg-success" @click="charges_shown=true">Créer</button>
        <button class="btn-sm bg-primary" @click="imprimer">Imprimer</button>
      </div>
    </div>
    <div class="table">
      <table>
        <thead>
          <tr>
            <th>date</th>
            <th>montant</th>
            <th>details</th>
            <th>user</th>
            <th>ajouté le</th>
            <th class="nonprintable">options</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in history">
            <td>{{ datetime(record.date) }}</td>
            <td class="money">{{ money(record.montant) }}</td>
            <td>{{ record.details }}</td>
            <td>{{ record.user.first_name }} {{ record.user.last_name }}</td>
            <td>{{ datetime(record.created_at) }}</td>
            <td>
              <button class="btn-sm bg-danger" @click="cancel(record)">
                annuler
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th class="center"> Total</th>
            <th>{{ money(
              history.reduce((acc, x) => acc += x.montant, 0)
            ) }}
            </th>
            <th colspan="2"></th>
          </tr>
        </tfoot>
      </table>
    </div>
    <DialogCharges :class="{'hidden':!charges_shown}" @close="close"/>
  </div>
</template>
<script>
import DialogCharges from "../components/dialog_charge"
import PrintableHeader from "../components/printable_header"

export default {
  components:{ DialogCharges, PrintableHeader },
  data(){
    return {
      history:[], charges_shown:false, du:null, au:null,
    }
  },
  computed:{
    INCOME_TYPES(){
      return Object.keys(this.$store.state.INCOME_TYPES)
    }
  },
  watch:{
    "$store.state.depenses"(new_val){
      this.history = new_val
    }
  },
  methods:{
    close(){
      this.charges_shown = false
    },
    cancel(record){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
      let first_name = this.active_user.first_name
      if(prompt(`veuiller taper ${first_name} pour supprimer:`) == first_name){
        axios.delete(this.url+`/depense/${record.id}/`, this.headers)
        .then((response) => {
          let index = this.$store.state.depenses.indexOf(record)
          this.$store.state.depenses.splice(index, 1)
        }).catch((error) => {
          console.error(error);
        })
      }
    },
    fetchData(){
      let link;
      if(!this.next){
        this.history = []
        link = this.url+`/depense/`
      } else {
        link = this.next
      }
      axios.get(link, this.headers)
      .then((response) => {
        this.$store.state.depenses.push(...response.data.results)
        if(response.data.next != null){
          this.next = response.data.next
          this.fetchData()
        } else {
          this.next = null
        }
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchData)
      })
    },
    filterDate(){
      let link;
      if(!this.next){
        this.history = []
        link = this.url+`/depenses/?date__gte=${this.du}T00:00&date__lte=${this.au}T23:59`
      } else {
        link = this.next
      }
      axios.get(link, this.headers)
      .then((response) => {
        this.history.push(...response.data.results)
        if(response.data.next != null){
          this.next = response.data.next
          this.filterDate()
        } else {
          this.next = null
        }
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.filterDate)
      })
    },
    imprimer(){
      print()
    }
  },
  mounted(){
    if(this.$store.state.depenses.length == 0){
      this.fetchData()
    } else {
      this.history = this.$store.state.depenses
    }
  }
};
</script>
<style scoped>
.container {
    min-height: calc(100vh - 180px);
}
input[type='date'], select{
  height: 28px;
  width: 200px;
  outline: none;
  border: 2px solid var(--primary);
}
.btn-sm{
  margin-bottom: 0;
}
.buttons{
  display: flex;
  align-items: flex-end;
  margin-bottom: 0;
}
.field label{
  color: #0F0;
  font-weight: 700;
}
.field{
  padding: 0 10px 0 0;
  margin-bottom: 0;
}
.left{
  display: flex;
  align-items: flex-end;
}
@media screen and (max-width:800px) {
  .row {
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-content: space-between;
    flex-wrap: wrap;
  }
}
@media screen and (max-width:600px) {
  .container {
    padding: 0 20px;
  }
  .row {
    margin: 10px auto;
    display: block;
    width: 100%;
    height: auto;
  }
  .left{
    flex-direction: column;
  }
}
</style>
