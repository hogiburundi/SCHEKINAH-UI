<template>
	<div class="container" @click="close">
		<div class="table">
			<table> 
				<thead>
					<tr>
						<th>Nom</th>
						<th>montant</th>
						<th>Options</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="agence in agences">
						<td>{{ agence.name }}</td>
						<td>{{ money(agence.amount) }} BIF</td>
						<td>
							<button class="btn-sm bg-primary" @click.stop="remiseA(agence)">
								remise
							</button>
							<button class="btn-sm bg-primary" @click.stop="reprendre(agence)">
								reprise
							</button>
							<button class="btn-sm bg-primary" @click.stop="$router.push('/agence-remise-reprise/'+agence.id)">
								Mvmnt Argent
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<DialogRemise @close="close" :class="{'hidden':!remise_shown}" :item="item"/>
		<DialogReprise @close="close" :class="{'hidden':!reprise_shown}" :item="item"/>
	</div>
</template>
<script>
import DialogRemise from "../components/dialog_remise_agence"
import DialogReprise from "../components/dialog_reprise_agence"
export default {
  props: {
  },
  components:{DialogRemise,DialogReprise, },
  data(){
  	return {
  		remise_shown:false, agences:[], item:null,reprise_shown:false
  	}
  },
  methods:{
  	close(){
  		this.remise_shown = false;
		this.reprise_shown=false
  		this.item = null
  	},
  	remiseA(agence){
  		this.item = agence
  		this.remise_shown = true
  	},
  	reprendre(agence){
		this.item = agence
		this.reprise_shown=true
  	},
  	fetchAgences(){
			axios.get(this.url+"/agence/", this.headers)
			.then((response) => {
				this.agences = response.data.results
			}).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchAgences)
			})
  	}
  },
  mounted(){
  	this.fetchAgences()
  }
};
</script>
<style scoped>
table{
	margin-top: 30px;
}
</style>
