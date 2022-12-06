<template>
  <div class="container">
    <PrintableHeader/>
    <div class="row nonprintable">
      <div class="left">
        <div class="field">
          <label for="du">Du: </label>
          <input type="date" id="du" v-model="du">
        </div class="field">
        <div class="field">
          <label for="au">Au: </label>
          <input type="date" id="au" v-model="au">
        </div>
        <div class="field">
          <label for="icome_type">type: </label>
          <select v-model="icome_type">
            <option v-for="entry in INCOME_TYPES" :value="entry[1]">
              {{ entry[0] }}
            </option>
          </select>
        </div>
        <div class="field">
          <label for="user_filter">Utilisateur: </label>
          <select v-model="user_filter">
            <option v-for="personnel in personnels_list" :value="personnel.user.id">
              {{ personnel.user.first_name }} {{ personnel.user.last_name }}
            </option>
          </select>
        </div>
        <button class="btn-sm bg-primary" @click="fetchData">Filtrer</button>
      </div>
      <div class="buttons">
        <button class="btn-sm bg-success" @click="produit_shown=true">Créer</button>
        <button class="btn-sm bg-primary" @click="imprimer">Imprimer</button>
      </div>
    </div>
    <div class="table">
      <table>
        <thead>
          <tr>
            <th>date</th>
            <th>création</th>
            <th>type</th>
            <th>montant</th>
            <th>details</th>
            <th>user</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in history">
            <td>{{ datetime(record.date) }}</td>
            <td>{{ onlyDate(record.date_cree) }}</td>
            <td>{{ getIncomeType(record.icome_type) }}</td>
            <td class="money">{{ money(record.montant) }}</td>
            <td>{{ record.details }}</td>
            <td>{{ record.user.first_name }} {{ record.user.last_name }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th colspan="3" class="center"> Total</th>
            <th class="money">{{ money(
              history.reduce((acc, x) => acc += x.montant, 0)
            ) }}
            </th>
            <th colspan="2"></th>
          </tr>
        </tfoot>
      </table>
    </div>
    <DialogProduit :class="{'hidden':!produit_shown}" @close="close"/>
  </div>
</template>
<script>
import DialogProduit from "../components/dialog_produit"
import PrintableHeader from "../components/printable_header"

export default {
  components:{ DialogProduit, PrintableHeader },
  data(){
    return {
      history: [],
      produit_shown: false,
      icome_type: "",
      personnels_list:[],
      user_filter:"",
      du: this.getFirstDate(),
      au: this.getToday(),
    }
  },
  computed:{
    INCOME_TYPES(){
      return Object.entries(this.$store.state.INCOME_TYPES)
    },
  },
  watch:{
    "$store.state.incomes":{
      deep:true,
      handler(new_val){
        this.history = new_val
      }
    }
  },
  methods:{
    close(){
      this.produit_shown = false
    },
    getIncomeType(val){
      for(let key of this.INCOME_TYPES){
        if(key[1] == val){
          return key[0]
        }
      }
    },
    getFirstDate(){
      let date = new Date()
      date.setDate(1)
      return date.toISOString().split("T")[0]
    },
    getToday(){
      return new Date().toISOString().split("T")[0]
    },
    fetchData(){
      let link;
      if(!this.next){
        this.$store.state.incomes = []
        let date_params = `date_cree__gte=${this.du}T00:00&date_cree__lte=${this.au}T23:59`
        link = this.url+`/income/?${date_params}&icome_type=${this.icome_type}&user=${this.user_filter?this.user_filter:""}`
      } else {
        link = this.next
      }
      axios.get(link, this.headers)
      .then((response) => {
        this.$store.state.incomes.push(...response.data.results)
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
    fetchUsers(){
      axios.get(this.url+"/personnel/", this.headers)
      .then((response) => {
        this.personnels_list = response.data.results
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchUsers)
      })
    },
    imprimer(){
      print()
    }
  },
  mounted(){
    this.fetchUsers()
    if(this.$store.state.incomes.length == 0){
      this.fetchData()
    } else {
      this.history = this.$store.state.incomes
    }
  }
};
</script>
<style scoped>
.container {
  min-height: calc(100vh - 180px);
}
.row{
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  width: 90%;
  margin: 10px auto;
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
