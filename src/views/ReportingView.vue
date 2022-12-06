<template>
  <div class="container">
    <PrintableHeader/>
    <div class="row nonprintable">
      <div v-if="journalier" class="left">
        <div class="field">
          <label for="du">En date du: </label>
          <input v-model="date" type="date" name="">
        </div>
        <div class="field">
          <label for="du">Agence</label>
          <select name="" id="" v-model="selected_agency">
            <option v-for="agence in agences" :value="agence.id" :key="agence.id" >{{agence.name}}</option>
          </select>
        </div>
        <button class="btn-sm bg-primary" @click="fetchComptes">Filtrer</button>
      </div>
      <div v-else class="left">
        <div class="field">
          <label for="du">Au mois de: </label>
          <select v-model="month">
            <option v-for="i in currentMonthDigit" :value="i">{{ i }}</option>
          </select>
        </div>
        <button class="btn-sm bg-primary" @click="fetchComptes">Filtrer</button>
      </div>
      <div class="buttons">
        <button class="btn-sm bg-primary" @click="handlerDaily">Journalier</button>
        <button class="btn-sm bg-primary" @click="handlerMonthly">Mensuel</button>
        <button
          class="btn-sm bg-primary"
          @click="imprimer">
          Imprimer
        </button>
      </div>
    </div>
    <div class="table">
        <table>
          <tr >Charges
            <td>
              <table>
                  <tr>
                    <th>Libellé</th>
                    <th>Qte totale</th>
                    <th>Montant</th>
                    <th>Pièces justificatives</th>
                    <th>Observations</th>
                  </tr>
                <tbody>
                  <tr>
                    <td>2000</td>
                    <td>2000</td>
                    <td>2000</td>
                    <td>2000</td>
                    <td>2000</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            Total des dépôts
            <td>{{money($store.state.home_infos.depots)}}</td>
          </tr>
          <tr>
            Total des retraits
          </tr>
          <tr>
            Total des alimentations
          </tr>
          <tr>
            Total des collectes
          </tr>
          <tr>
            Manquant et erreurs
            <td>
              <table>
                  <tr>
                    <th>Type de manquant</th>
                    <th>Montant</th>
                    <th>Responsable</th>
                  </tr>
                <tbody>
                  <tr>
                    <td>2000</td>
                    <td>2000</td>
                    <td>2000</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </table>
    </div>
  </div>
</template>
<script>
import PrintableHeader from "../components/printable_header"

export default {
  components:{ PrintableHeader },
  data(){
    return {
      date:"",
      journalier:true,
      month:1,selected_agency:1,
      agences:[],rapp_journ:[]
    }
  },
  methods:{
    fetchAgences(){
			axios.get(this.url+"/agence/", this.headers)
			.then((response) => {
				this.agences = response.data.results
			}).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchAgences)
			}).finaly(()=>{
        this.fetchRappJourn()
      })
  	},
    fetchRappJourn(){
			axios.get(this.url+`/agence/${this.selected_agency}/rapport-journalier/2022-11-15/`, this.headers)
			.then((response) => {
				this.rapp_journ = response.data.results
			}).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchRappJourn)
			})
  	},
    imprimer(){
      print()
    },
    handlerDaily(){
      this.journalier=true
    },
    handlerMonthly(){
      this.journalier=false
    }
  },
  mounted(){
    
    this.fetchRappJourn()
  }
};
</script>
<style scoped>
.container {
  min-height: calc(100vh - 180px);
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
td{
  font-weight: inherit;
  vertical-align: bottom;
}
@media screen and (max-width:600px) {
  .container {
    padding: 0 20px;
  }
  .left{
    flex-direction: column;
  }
}
</style>
