<template>
  <div class="container">
    <div class="row nonprintable">
      <div class="left">
        <div class="field">
          <label for="du">Du : </label>
          <input type="date" id="du" v-model="du">
        </div>
        <div class="field">
          <label for="au">Au : </label>
          <input type="date" id="au" v-model="au">
        </div>
        <button class="btn-sm bg-primary" @click="filterDate">Filtrer</button>
      </div>
    </div>
    <div class="table">
      <table>
        <thead>
          <tr>
            <th>Heure</th>
            <th>Action</th>
            <th>Options</th>
            <th v-if="active_user.is_admin" >S.U</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in history" :key="record.id">
            <td>{{ datetime(record.date) }}</td>
            <td>{{ record.details }}</td>
            <td>
              <button class="btn-sm bg-danger nonprintable" @click="annuler(record.id)">
                Annuler
              </button>
            </td>
            <td>
              <button class="btn-sm bg-danger"
                  v-if="active_user.is_admin"
                  @click="deleteHistory(record.id)" >
									<fa icon="trash"/>
								</button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th class="center">Total</th>
            <th class="money">
              Depot:
              <b>
                {{ money(
                  history.reduce((acc, x) => acc += depot(x), 0)
                ) }}
              </b>
              Retrait:
              <b>
                {{ money(
                  history.reduce((acc, x) => acc += retrait(x), 0)
                ) }}
              </b>
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      du:null, au:null, history:[], next:null
    }
  },
  computed:{
    id(){
      return this.$route.params.id
    }
  },
  methods:{
    depot(record){
      if(record.action == "Depot"){
        return record.balance_compte_apres - record.balance_compte_avant
      }
      return 0
    },
    retrait(record){
      if(record.action == "Retrait"){
        return record.balance_compte_avant - record.balance_compte_apres
      }
      return 0
    },
    fetchHistory(){
      let args = !!this.id?`?user=${this.id}`:''
      axios.get(this.url+`/historique/${args}`, this.headers)
      .then((response) => {
        this.history = response.data.results
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchHistory)
      })
    },
    annuler(hist_id){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
      axios.get(this.url+`/historique/${hist_id}/annuler/`, this.headers)
      .then((response) => {
        this.history.unshift(response.data)
        alert("SUCCESS")
      }).catch((error) => {
        alert(JSON.stringify(error.response.data));
      })
    },
    filterDate(){
      let link;
      let date_arg = `date__gte=${this.du}T00:00&date__lte=${this.au}T23:59`
      let args = ""
      if(!this.next){
        this.history = []
        args = !!this.id?`user=${this.id}&`:''
        link = this.url+`/historique/?${args}${date_arg}`
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
        this.displayErrorOrRefreshToken(error, this.fetchHistory)
      })
    },
    imprimer(){
      print()
    }
  },
  mounted(){
    this.fetchHistory()
  }
};
</script>
<style scoped>
.container {
    min-height: calc(100vh - 180px);
}
.row {
  width: 90%;
  margin: 10px auto;
}
.left {
  width: 90%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}
input[type='date'] {
  height: 28px;
  width: 200px;
  outline: none;
  padding-bottom: 2px;
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
.btn-sm{
  margin: 0 5px;
}
@media screen and (max-width:800px) {
}
@media screen and (max-width:600px) {
}
</style>
