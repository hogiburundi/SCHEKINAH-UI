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
        <button class="btn-sm bg-primary" @click="filterDate">Filtrer</button>
      </div>
      <div class="buttons">
        <button class="btn-sm bg-success" @click="imprimer">Imprimer</button>
      </div>
    </div>
    <div class="table">
      <table>
        <thead>
          <tr>
            <th>user</th>
            <th>date</th>
            <th>montant</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in history">
            <td>{{ record.membre.compte.first_name }} {{ record.membre.compte.last_name }}</td>
            <td>{{ datetime(record.date) }}</td>
            <td class="money">{{ money(record.montant) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th colspan="2" style="text-align: center;">dépots total</th>
            <th>{{ 
              money(history.reduce((acc, x) => acc+parseInt(x.montant),0))
            }}
            </th>
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
    "$store.state.depots_kirimba"(new_val){
      this.history = new_val
    }
  },
  methods:{
    close(){
      this.charges_shown = false
    },
    fetchData(){
      let link;
      if(!this.next){
        this.history = []
        let id = this.$route.params.id
        link = this.url+`/depot-kirimba/?membre__ikirimba=${id}`
      } else {
        link = this.next
      }
      axios.get(link, this.headers)
      .then((response) => {
        this.$store.state.depots_kirimba.push(...response.data.results)
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
        link = this.url+`/depot-kirimba/?date__gte=${this.du}T00:00&date__lte=${this.au}T23:59`
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
    this.$store.state.depots_kirimba = []
    this.fetchData()
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
