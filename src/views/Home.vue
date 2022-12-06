<template>
  <div class="container">
    <div class="row">
      <div v-if="active_user_is_responsable || user_is_readonly" class="info bg-primary">
        <div class="desc">Agence: {{ $store.state.home_infos.agence }}</div>
        <div class="amount">
          SCHEKINAH: 
          <b>{{ money($store.state.home_infos.capital) }} FBu</b>
        </div>
        <div class="amount">
          Agence: 
          <b>{{ money($store.state.home_infos.montant_agence) }} FBu</b>
        </div>
        <div class="amount">
          Comptes: 
          <b>{{ money(total_comptes) }} FBu</b>
        </div>
      </div>
      <div class="info bg-primary">
        <div class="desc">
          Somme Initialle: 
          <b>{{ money($store.state.home_infos.somme_initial) }} FBu</b>
        </div>
        <div class="amount">
          Depots: 
          <b>{{ money($store.state.home_infos.depots) }} FBu</b>
        </div>
        <div class="amount">
          Retraits: 
          <b>{{ money($store.state.home_infos.retraits) }} FBu</b>
        </div>
      </div>
    </div>
    <div class="table" v-if="active_user.is_admin || user_is_readonly">
      <table>
        <thead>
          <tr>
            <th>Agence</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="agence in agences">
            <td>{{ agence.name }}</td>
            <td>{{ money(agence.amount) }} Fbu</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table" v-else>
      <table>
        <thead>
          <tr>
            <th>Heure</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in $store.state.home_infos.historique">
            <td>{{ datetime(record.date) }}</td>
            <td>{{ record.details }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  data(){
    return {
      total_comptes:0,agences:[]
    }
  },
  computed:{
  },
  methods:{
    fetchTotals(){
      axios.get(this.url+`/compte/total-clients/`, this.headers)
      .then((response) => {
        this.total_comptes = response.data.total_clients
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchTotals)
      })
    },
    fetchAgences(){
			axios.get(this.url+"/agence/", this.headers)
			.then((response) => {
				this.agences = response.data.results
			}).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchAgences)
			})
  	},
    fetchHistory(){
      axios.get(this.url+`/user/${this.active_user.id}/user-info/`, this.headers)
      .then((response) => {
        this.$store.state.home_infos = response.data
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchHistory)
      })
    },
  },
  mounted(){
    if(this.active_user.is_admin || this.user_is_readonly)
      this.fetchAgences()
    // if(this.$store.state.home_infos.historique.length == 0){
      this.fetchHistory()
      this.fetchTotals()
    // }
  }
};
</script>
<style scoped>
.info {
  display: inline-block;
  padding: 15px 25px;
  max-width: 300px;
  line-height: 1.7;
  opacity: .8;
  border-radius: 8px;
  color: #f1f1f1;
}
.info b{
  font-weight: 600;
}
.desc{
  text-transform: uppercase;
  font-weight: 600;
  font-size: 18px;
}
.amount {
	font-size: 16px;
}
.row {
  width: 80%;
  display: flex;
  justify-content: space-around;
  margin: 30px auto;
}
.btn-group {
  width: 100%;
  display: flex;
  margin-bottom: 20px;
  justify-content: center;
  flex-wrap: wrap;
}
.btn-group .btn {
  margin: 0;
  margin-right: 20px;
  text-transform: capitalize;
}
.btn:last-child {
  margin: 0;
}
.btn .desc {
  text-align: center;
}

@media screen and (max-width:800px) {
  .row {
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-content: space-between;
    flex-wrap: wrap;
    min-height: 85px;
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
    width: 100%!important;
    max-width: 100%!important;
	}
  .info:last-child {
    margin-bottom: 0px;
  }
	.desc {
		font-size: 16px;
		font-weight: 600;
	}
	.amount {
		font-size: 15px;
	}
	.row {
    margin: 20px 0;
		display: block;
		width: 100%;
    height: auto;
	}

  .btn-group {
    margin: 10px 0;
  }
  .btn-group .btn {
    width: 100%;
    margin: 0;
    text-align: center;
    margin-bottom: 10px;
  }
}
</style>
