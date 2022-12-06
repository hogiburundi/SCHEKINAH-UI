<template>
	<div class="container">
		<div class="row">
			<div class="search-area">
				<input type="text" v-on:keyup.enter="rechercher" placeholder="rechercher" v-model="keyword">
				<button class="search" @click="rechercher">Rechercher</button>
			</div>
		</div>
		<div class="table">
			<table>
				<thead>
					<tr >
						<th>No. compte</th>
						<th>Nom & Prenom</th>
						<th>Sexe</th>
						<th>CNI</th>
						<th>Options</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="compte in comptes">
						<td>{{ compte.account_number }}</td>
						<td style="max-width:150px">
							{{ compte.last_name }} {{ compte.first_name }}
						</td>
						<td>
							{{ getSexe(compte) }} 
						</td>
						<td>{{ compte.CNI }}</td>
						<td>
							<span v-if="compte.is_active">
								<button v-if="compte.info" class="btn-sm bg-success"
									@click="unsubscribe(compte)">
									Désactiver Mefi-Info
								</button>
								<button v-else class="btn-sm bg-danger"
									@click="subscribe(compte)">
									Activer Mefi-Info
								</button>
							</span>
						</td>
					</tr>
				</tbody>
			</table>
			<a href="#" style="color: lightgray;" @click="loadMore" v-if="!!next">
				gukwega ibindi...
			</a>
		</div>
	</div>
</template>
<script>
export default {
  props: {},
  data(){
  	return {
  		comptes: this.$store.state.comptes,
  		next:null,
  		active_compte:undefined,
  		keyword:"",
  		active_org:undefined,
  	}
  },
  watch:{
  	"$store.state.comptes"(new_val){
  		this.comptes = new_val;
  	},
  	keyword(new_val){
  		this.comptes = this.$store.state.comptes.filter( x => {
  		   return  JSON.stringify(x).toLowerCase().includes(new_val.toLowerCase())
		})
  	},
  },
  methods:{
  	close(){
  		this.active_compte = null
  	},
  	loadMore(){
			axios.get(this.next, this.headers)
			.then((response) => {
				this.$store.state.comptes.push(...response.data.results)
				this.next = response.data.next
			}).catch((error) => {
				this.displayErrorOrRefreshToken(error, this.loadMore)
			})
  	},
  	subscribe(compte){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
  		let confirm = this.active_user.first_name+" "+this.active_user.last_name;
  		if (prompt(`veuiller taper: "${confirm}" pour confirmer`) === confirm) {
				axios.get(this.url+`/compte/${compte.id}/subscribe/`, this.headers)
				.then(() => {
					compte.info=true
				}).catch((error) => {
					this.displayErrorOrRefreshToken(error, this.subscribe)
				})
  		} else {
  			alert("ABANDONÉE")
  		}
  	},
  	unsubscribe(compte){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
  		let confirm = this.active_user.first_name+" "+this.active_user.last_name;
  		if (prompt(`veuiller taper: "${confirm}" pour confirmer`) === confirm) {
				axios.get(this.url+`/compte/${compte.id}/unsubscribe/`, this.headers)
				.then(() => {
					compte.info=false
				}).catch((error) => {
					this.displayErrorOrRefreshToken(error, this.unsubscribe)
				})
  		} else {
  			alert("ABANDONÉE")
  		}
  	},
  	 rechercher(){
			axios.get(this.url+`/compte/?search=${this.keyword}`, this.headers)
			.then((response) => {
				this.$store.state.comptes = response.data.results
				this.next = response.data.next
			}).catch((error) => {
				this.displayErrorOrRefreshToken(error, this.rechercher)
			})
  	},
	  fetchComptes(){
			axios.get(this.url+"/compte/", this.headers)
			.then((response) => {
				this.$store.state.comptes = response.data.results
			}).catch((error) => {
				this.displayErrorOrRefreshToken(error, this.fetchComptes)
			})
    }
  },
  mounted(){
    // if(this.$store.state.comptes.length<2){
    //   this.fetchComptes()
    // }
  }
};
</script>
<style scoped>
div.add{
	width: 150px;
	text-align: center;
	cursor: default;
}
td{
	user-select: none;
}
</style>
