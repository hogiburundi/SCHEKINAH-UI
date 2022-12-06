<template>
	<div class="container">
		<div class="row">
			<button @click="addMember" class="add">
				Nouveau Placement
			</button>
			<div>
				<input type="text" placeholder="rechercher" v-model="keyword">
				<button class="search">Rechercher</button>
			</div>
		</div>
		<div class="table">
			<table> 
				<thead>
					<tr>
						<th>No. compte</th>
						<th>Nom</th>
						<th>Date</th>
						<th>taux</th>
						<th>periode</th>
						<th>Somme</th>
						<th>interval</th>
						<th>Options</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="placement in $store.state.placements"
						@click="$router.push('/amortissement-p/'+placement.id)"
						:class="{'approved':placement.approved}">
						<td>{{ placement.account.account_number }}</td>
						<td>{{ placement.account.first_name+" "+placement.account.last_name }}</td>
						<td> {{ datetime(placement.date) }}</td>
						<td>{{ placement.interest_rate }}%</td>
						<td>{{ placement.period_time }} mois</td>
						<td>{{ money(placement.amount) }} FBu</td>
						<td>{{ placement.intervalle }} mois</td>
						<td>
							<div v-if="!placement.approved && active_user_is_responsable">
								<button class="btn-sm bg-success"
									@click.stop="validatePlacement(placement)">
									<fa icon="check"/>
								</button>
								<button class="btn-sm bg-danger"
									@click.stop="deletePlacement(placement)">
									<fa icon="times"/>
								</button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<DialogPlacement @close="close" :class="{'hidden':!dialog_shown}"/>
	</div>
</template>
<script>
import DialogPlacement from "../components/dialog_placement"
export default {
  props: {
  },
  components:{DialogPlacement},
  data(){
  	return {
  		dialog_shown:false, keyword:"", next:null
  	}
  },
  methods:{
  	addMember(){
  		this.dialog_shown = true;
  	},
  	close(){
  		this.dialog_shown = false;
  	},
  	validatePlacement(placement){
  		let confirm = this.active_user.first_name+" "+this.active_user.last_name;
  		if (prompt(`veuiller taper: "${confirm}" pour confirmer`) === confirm) {
				axios.get(this.url+`/placement/${placement.id}/validate/`, this.headers)
				.then((response) => {
					placement.approved = true;
					placement.approved_by = this.active_user
				}).catch((error) => {
					this.displayErrorOrRefreshToken(error, this.deletePlacement)
				});
  		} else {
  			alert("ABANDONÉE")
  		}
  	},
  	deletePlacement(placement){
  		let confirm = this.active_user.first_name+" "+this.active_user.last_name;
  		if (prompt(`veuiller taper: "${confirm}" pour confirmer`) === confirm) {
				axios.delete(this.url+`/placement/${placement.id}/`, this.headers)
				.then((response) => {
					let index = this.$store.state.placements.indexOf(placement)
					if(index >= 0) this.$store.state.placements.splice(index, 1)
	  				alert("FAIT")
				}).catch((error) => {
					this.displayErrorOrRefreshToken(error, this.deletePlacement)
				})
  		} else {
  			alert("ABANDONÉE")
  		}
  	},
	  fetchPlacement(){
	    let link;
	    if(!this.next){
	    	this.$store.state.placements = []
	      link = this.url+"/placement/"
	    } else {
	      link = this.next
	    }
			axios.get(link, this.headers)
			.then((response) => {
				this.$store.state.placements.push(...response.data.results)
	      if(response.data.next != null){
	        this.next = response.data.next
	        this.fetchPlacement()
	      } else {
	        this.next = null
	      }
			}).catch((error) => {
				this.displayErrorOrRefreshToken(error, this.fetchPlacement)
			})
   	},
  },
  mounted(){
    if(this.$store.state.placements.length<2){
      this.fetchPlacement()
    }
  }
};
</script>
<style scoped>
</style>
