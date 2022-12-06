<template>
  <div class="container">
    <PrintableHeader/>
    <div class="row nonprintable">
      <div class="left">
        <div class="field">
          <label for="du">Du: </label>
          <input type="date" id="du" v-model="du">
        </div>
        <div class="field">
          <label for="au">Au: </label>
          <input type="date" id="au" v-model="au">
        </div>
        <button class="btn-sm bg-primary" @click="filterDate">Filtrer</button>
      </div>
      <button class="btn-sm bg-primary" @click="imprimer">Imprimer</button>
    </div>
    <div class="table" :class="{'nonprintable':!can_print}">
      <table>
        <thead>
          <tr>
            <th>Heure</th>
            <th>debit</th>
            <th>credit</th>
            <th>solde</th>
            <th>action</th>
            <th v-if="motif">motif</th>
            <th class="nonprintable">acteur</th>
            <th class="nonprintable" v-if="active_user.is_admin">action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in history">
            <td>{{ datetime(record.date) }}</td>
            <td class="money">{{ money(debit(record)) }}</td>
            <td class="money">{{ money(credit(record)) }}</td>
            <td class="money">{{ money(record.balance_compte_apres) }}</td>
            <td>{{ record.details }}</td>
            <td v-if="motif">{{ record.action }}</td>
            <td class="nonprintable">{{ record.user.first_name }} {{ record.user.last_name }}</td>
            <td class="nonprintable" v-if="active_user.is_admin" >
              <button class="btn-sm bg-danger"
                  @click="deleteHistory(record.id)" >
									<fa icon="trash"/>
								</button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th class="center"> Total</th>
            <th class="money">{{ money(
              history.reduce((acc, x) => acc += debit(x), 0)
            ) }}
            </th>
            <th class="money">{{ money(
              history.reduce((acc, x) => acc += credit(x), 0)
            ) }}
            </th>
            <th class="money">
              {{ money(history[history.length-1].balance_compte_apres) }}
            </th>
            <th colspan="2"></th>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
<script>
import PrintableHeader from "../components/printable_header"

export default {
  components: { PrintableHeader },
  data(){
    return {
      du:null,
      au:null,
      can_print:false,
      history:[],
      motif:false,
      next:null
    }
  },
  computed:{
    id(){
      return this.$route.params.id
    }
  },
  watch:{
    can_print(new_val){
      if(new_val){
        setTimeout(() => print(), 100)
      }
    }
  },
  methods:{
    debit(record){
      if(record.balance_compte_avant){
        if(record.balance_compte_avant>record.balance_compte_apres){
          return record.balance_compte_avant - record.balance_compte_apres
        }
      }
      return 0
    },
    credit(record){
      if(record.balance_compte_avant){
        if(record.balance_compte_avant<record.balance_compte_apres){
          return record.balance_compte_apres - record.balance_compte_avant
        }
      }
      return 0
    },
    fetchHistory(){
      axios.get(this.url+`/compte/${this.id}/historique/`, this.headers)
      .then((response) => {
        this.history = response.data.historique
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchHistory)
      })
    },
    filterDate(){
      let link;
      if(!this.next){
        this.history = []
        link = this.url+`/historique/?compte=${this.id}&date__gte=${this.du}T00:00&date__lte=${this.au}T23:59`
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
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
      if(this.can_print){
        print()
      } else {
        axios.get(this.url+`/compte/${this.id}/demande_impression/`, this.headers)
        .then((response) => {
          this.history.push(response.data)
          this.can_print = true
        }).catch((error) => {
          alert(this.cleanString(error.response.data))
        })
      }
    }
  },
  mounted(){
    if(this.$store.state.history.length == 0){
      this.fetchHistory()
    }
  }
};
</script>
<style scoped>
.container {
    min-height: calc(100vh - 180px);
}
.row {
  width: 90%;
  display: flex;
  justify-content: space-between;
  margin: 10px auto;
  align-items: flex-end;
}
.left{
  display: flex;
  align-items: flex-end;
}
input[type='date'], select{
  width: 200px;
  outline: none;
  border: 2px solid var(--primary);
}
.field label{
  color: #0F0;
  font-weight: 700;
}
.field{
  padding: 0 10px 0 0;
  margin-bottom: 0;
}
.buttons{
  display: flex;
  align-items: flex-end;
  margin-bottom: 5px;
}
.btn-sm{
  margin: 0 5px;
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
.money{
  white-space: nowrap;
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
}
</style>
