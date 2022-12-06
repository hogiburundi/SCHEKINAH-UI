<template>
	<div class="container">
		<div class="row nonprintable">
			<button class="btn" @click="genererQuittances">
				Nouveaux quittances
			</button>
		</div>
		<div class="table">
			<table> 
				<thead>
					<tr>
						<th>Date</th>
						<th>Demande par</th>
						<th>Num debut</th>
						<th>Num fin</th>
						<th>Status</th>
						<th class="nonprintable">Options</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="quittance in quittances">
						<td>{{ datetime(quittance.date)}}</td>
						<td>{{ quittance.user }}</td>
						<td>{{ quittance.start}}</td>
						<td>{{ quittance.end }}</td>
						<td>{{ quittance.printed ? 'Oui':'Non' }}</td>
						<td class="nonprintable">
							<button class="btn-sm bg-primary"
								@click="$router.push('/quittances-print/'+quittance.start+'-'+quittance.end)"
									>
								Imprimer
							</button>
						</td>
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
  		quittances:[], keyword:""
  	}
  },
  methods:{
  	genererQuittances(){
  		if(confirm("Voulez-vous generer 100 quittances ?")) {
				axios.get(this.url+`/quittances/generate/`, this.headers)
				.then((response) => {
					alert("success")
					this.quittances.push(response.data)
				}).catch((error) => {
						alert("échec");
				})
			}
  	},
    fetchQuittances(){
			axios.get(this.url+"/quittances/", this.headers)
			.then((response) => {
				this.quittances = response.data.results
			}).catch((error) => {
				this.displayErrorOrRefreshToken(error, this.fetchQuittances)
			})
    },
  },
  mounted(){
      this.fetchQuittances()
  }
};
</script>
<style scoped>
</style>
