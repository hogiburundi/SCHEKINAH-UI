<template>
  <div class="container">
    <PrintableHeader/>
    <div class="row">
      <div class="first">
        <table class="amort-table">
          <tbody>
            <tr>
              <td class="identifier">Nom : </td>
              <td>{{ !!credit.account?credit.account.first_name:"" }}</td>
            </tr>
            <tr>
              <td class="identifier">Prenom : </td>
              <td>{{ !!credit.account?credit.account.last_name:"" }}</td>
            </tr>
            <tr>
              <td class="identifier">CNI : </td>
              <td>{{ !!credit.account?credit.account.CNI:"" }}</td>
            </tr>
            <tr>
              <td class="identifier">Numero de Telephone : </td>
              <td>{{ !!credit.account?credit.account.phone_number:"" }}</td>
            </tr>
            <tr>
              <td class="identifier">Adresse : </td>
              <td>{{ !!credit.account?credit.account.adress:"" }}</td>
            </tr>
            <tr>
              <td class="identifier">Personne de confiance : </td>
              <td>{{ !!credit.account?credit.account.confiance:"" }}</td>
            </tr>
            <tr>
              <td class="identifier">CNI de la personne : </td>
              <td>{{ !!credit.account?credit.account.CNI_confiance:"" }}</td>
            </tr>
            <tr>
              <td class="identifier">Restant Dû : </td>
              <td class="logs"><h3>{{ money(cap_restant_du) }} FBU</h3></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="table">
      <table>
        <thead>
          <tr>
            <th>Echéance</th>
            <th>Restant Dû</th>
            <th>Interêt</th>
            <th>Mensualité</th>
            <th class="nonprintable">Reste</th>
            <th>Date</th>
            <th>Penalités</th>
            <th>Payée</th>
            <!-- <th>options</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="line in credit.amortissements">
            <td>{{ money(line.echeance) }}</td>
            <td>{{ money(line.rest) }}</td>
            <td>{{ money(line.interest) }}</td>
            <td>{{ money(line.initial_mensuality) }}</td>
            <td class="nonprintable">{{ money(line.mensuality) }}</td>
            <td>{{ line.date }}</td>
            <td>{{ line.retard }}</td>
            <td>{{ line.done?"OUI":"NON" }}</td>
<!--             <td>
              <button v-if="!line.done" @click="modifier(line)"
                class="btn-sm btn-primary">
                Modifier
              </button>
            </td> -->
          </tr>
        </tbody>
      </table>
      <div class="noms printable">
        <div class="client">
          <span>
            {{ !!credit.account?credit.account.first_name:"" }}
          </span>
          <span>
            {{ !!credit.account?credit.account.last_name:"" }}
          </span>
        </div>
        <div>
          SCHEKINAH OPPORTUNITY
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PrintableHeader from "../components/printable_header"

export default {
  components: { PrintableHeader },
  props: {},
  data(){
    return {
      credit_id:0, credit:{}, //dialog_shown:false, active_line:null
    }
  },
  computed:{
    cap_restant_du(){
      if(!this.credit.amortissements) return 0
      let amortissements = this.credit.amortissements.filter(x => !x.done)
      let total = 0
      if(this.credit.amortissements.length>0){
        total = amortissements.reduce(
          (acc, x) => acc += (parseFloat(x.mensuality) + x.retard)
        , 0)
      }
      return total
    }
  },
  methods:{
    // modifier(line){
    //   this.active_line = line
    //   this.dialog_shown = true
    // },
    fetchAmortissement(){
      axios.get(this.url+`/credit/${this.credit_id}/`, this.headers)
      .then((response) => {
        this.credit = response.data
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchAmortissement)
      })
    },
  },
  mounted(){
    this.credit_id = this.$route.params.id
    if(!!this.credit_id){
      this.fetchAmortissement()
    }
  }
};
</script>
<style scoped>
.info {
  display: inline-block;
  padding: 15px 25px;
  line-height: 1.7;
  background: var(--primary-transparent);
  border-radius: 10px;
}
.desc {
  text-transform: uppercase;
  font-weight: 500;
  font-size: 18px;
}
.amount {
	font-size: 18px;
}
.row {
  width: 80%;
  display: flex;
  justify-content: space-around;
  margin: 30px auto;
}
.first{
	background: #f5f5f5;
	color: #000;
}
.profile-info {
  margin-bottom: 10px;
}
.identifier {
  font-weight: 600;
}
.noms{
  margin-top: 20px;
  display: none;
  justify-content: space-between;
  font-weight: 700;
}
@media print{
  .noms{
    display: flex;
  }
}
@media screen and (max-width:800px) {
  .row {
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-content: space-between;
    flex-wrap: wrap;
    min-height: 180px;
  }
  .info {
    width: 48%;
    padding: 10px 20px;
  }
}

@media screen and (max-width:600px) {
	.container {
		padding: 0 20px;
	}
	.info {
		display: block;
		margin-bottom: 15px;
    width: 100%;
	}
	.desc {
		font-size: 16px;
		font-weight: 600;
	}
	.amount {
		font-size: 15px;
	}
	.row {
    margin: 20px auto;
		display: block;
		width: 100%;
    height: auto;
	}
}
</style>
