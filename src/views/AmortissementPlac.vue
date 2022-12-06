<template>
  <div class="container">
    <PrintableHeader/>
    <div class="row">
      <div class="first">
        <table class="amort-table">
          <tbody>
            <tr>
              <td class="identifier">Nom : </td>
              <td class="nom">{{ !!placement.account?placement.account.first_name:"" }}</td>
            </tr>
            <tr>
              <td class="identifier">Prenom : </td>
              <td class="nom">{{ !!placement.account?placement.account.last_name:"" }}</td>
            </tr>
            <tr>
              <td class="identifier">CNI : </td>
              <td class="nom">{{ !!placement.account?placement.account.CNI:"" }}</td>
            </tr>
            <tr>
              <td class="identifier">Numero de Telephone : </td>
              <td class="nom">{{ !!placement.account?placement.account.phone_number:"" }}</td>
            </tr>
            <tr>
              <td class="identifier">Addresse : </td>
              <td class="nom">{{ !!placement.account?placement.account.adress:"" }}</td>
            </tr>
            <tr>
              <td class="identifier">Personne de confiance : </td>
              <td class="nom">{{ !!placement.account?placement.account.confiance:"" }}</td>
            </tr>
            <tr>
              <td class="identifier">CNI de la personne : </td>
              <td class="nom">{{ !!placement.account?placement.account.CNI_confiance:"" }}</td>
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
            <th>Capital</th>
            <th>Date</th>
            <th>Prélevée</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="line in placement.amortissements">
            <td>{{ line.echeance }}</td>
            <td>{{ money(line.rest) }}</td>
            <td>{{ money(line.interest) }}</td>
            <td>{{ money(line.mensuality) }}</td>
            <td>{{ line.date }}</td>
            <td>{{ line.done?"OUI":"NON" }}</td>
          </tr>
        </tbody>
      </table>
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
      placement_id:0, placement:{},
      total:0
    }
  },
  methods:{
   fetchAmortissement(){
    axios.get(this.url+`/placement/${this.placement_id}/`, this.headers)
    .then((response) => {
      this.placement = response.data
      for(let i=0; i<response.data.amortissements.length; i++){
        this.total+=parseFloat(response.data.amortissements[i].interest)
      }
    }).catch((error) => {
      this.displayErrorOrRefreshToken(error, this.fetchAmortissement)
    })
    },
  },
  mounted(){
    this.placement_id = this.$route.params.id
    if(!!this.placement_id){
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
