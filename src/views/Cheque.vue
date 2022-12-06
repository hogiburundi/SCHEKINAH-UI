<template>
	<div class="container">
    <PrintableHeader/>
		<div class="row nonprintable">
			<button class="btn" @click="cheques = $store.state.cheques">
				Tout
			</button>
			<button class="add" v-if="active_user.is_admin" @click="generateCheque">
				Generer les Commandes
			</button>
			<button class="btn" @click="fetchCommandes">
				Commandes
			</button>
			<button class="btn" onclick="window.print()">
				Imprimer
			</button>
			<div class="search-area">
				<input type="text" v-on:keyup.enter="rechercher" placeholder="rechercher" v-model="keyword">
				<button class="search" @click="rechercher">Rechercher</button>
			</div>
		</div>
		<div class="table">
			<table> 
				<thead>
					<tr>
						<th>No. cheque</th>
						<th>Nom</th>
						<th>Prenom</th>
						<th>En cours</th>
						<th class="nonprintable">Restant</th>
						<th>modifié le</th>
						<th>En attente</th>
						<th>Agence</th>
						<th>Demandé</th>
						<th class="nonprintable">Options</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="cheque in cheques" @click="openProfile(cheque.id)">
						<td>{{ cheque.compte.account_number }}</td>
						<td>{{ cheque.compte.first_name }}</td>
						<td>{{ cheque.compte.last_name }}</td>
						<td>{{ cheque.current }}</td>
						<td class="nonprintable">
							<span v-if="!!cheque.remaining_numbers">
								{{ cheque.remaining_numbers.slice(0, 30) }}
								<span v-if="cheque.remaining_numbers.length>30">...</span>
							</span>
						</td>
						<td>{{ datetime(cheque.date) }}</td>
						<td>{{ cheque.waiting }}</td>
						<td>{{ cheque.agence.name }}</td>
						<td>{{ cheque.asked }}</td>
						<td class="nonprintable">
							<button class="btn-sm bg-primary" v-if="!cheque.asked && !cheque.waiting"
									@click.stop="askCheque(cheque)">
								Commander
							</button>
							<span v-if="active_user_is_responsable && !!cheque.waiting">
								<button class="btn-sm bg-success" @click.stop="affecterCheque(cheque)">
									Affecter
								</button>
							</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<script>
import PrintableHeader from "../components/printable_header"

export default {
  props: {},
  components:{ PrintableHeader },
  data(){
  	return {
  		cheques: this.$store.state.cheques, keyword:""
  	}
  },
  watch:{
  	"$store.state.cheques"(new_val){
  		this.cheques = new_val;
  	},
  	keyword(new_val){
  		this.cheques = this.$store.state.cheques.filter( x => {
  		   return  JSON.stringify(x).toLowerCase().includes(new_val.toLowerCase())
		})
  	},
  },
  methods:{
  	askCheque(cheque){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
  		if(confirm(`Voulez-vous passer une commande pour ${cheque.compte.first_name} ${cheque.compte.last_name}?`)){
				axios.get(this.url+`/cheque/${cheque.id}/commander/`,this.headers)
				.then((response) => {
					cheque.asked = true
				}).catch((error) => {
					this.displayErrorOrRefreshToken(error, this.askCheque)
				})
  		}
  	},
  	generateCheque(cheque){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
			axios.get(this.url+`/cheque/generate/`, this.headers)
			.then((response) => {
				this.cheques = response.data
				alert(`${response.data.length} ont été génerée avec success`);
			}).catch((error) => {
				this.displayErrorOrRefreshToken(error, this.generateCheque)
			})
  	},
  	affecterCheque(cheque){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
  		if(confirm(`Voulez remettre à ${cheque.compte.first_name} ${cheque.compte.last_name} son carnet?`)){
				axios.get(this.url+`/cheque/${cheque.id}/remettre/`, this.headers)
				.then((response) => {
					alert("success")
					this.cheques[this.cheques.indexOf(cheque)] = response.data
				}).catch((error) => {
						alert("échec");
				})
  		}
  	},
  	rechercher(){
			axios.get(this.url+`/cheque/?search=${this.keyword}`, this.headers)
			.then((response) => {
				this.$store.state.cheques = response.data.results
			}).catch((error) => {
				this.displayErrorOrRefreshToken(error, this.rechercher)
			})
  	},
    fetchCheques(){
			axios.get(this.url+"/cheque/", this.headers)
			.then((response) => {
				this.$store.state.cheques = response.data.results
			}).catch((error) => {
				this.displayErrorOrRefreshToken(error, this.fetchCheques)
			})
    },
    fetchCommandes(){
			axios.get(this.url+"/cheque/commandes/", this.headers)
			.then((response) => {
				this.cheques = response.data
			}).catch((error) => {
				this.displayErrorOrRefreshToken(error, this.fetchCommandes)
			})
    },
  },
  mounted(){
    if(this.$store.state.cheques.length<2){
      this.fetchCheques()
    }
  }
};
</script>
<style scoped>
</style>
