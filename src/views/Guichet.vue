<template>
	<div class="container">
		<div class="row">
			<div @click="indiv_shown=true" class="add">
				Créer compte individuel
			</div>
			<div @click="org_shown=true" class="add">
				Créer compte organisation
			</div>
			<div class="search-area">
				<input type="text" v-on:keyup.enter="rechercher" placeholder="rechercher" v-model="keyword">
				<button class="search" @click="rechercher">Rechercher</button>
			</div>
		</div>
		<div class="table">
			<table>
				<thead>
					<tr>
						<th>No. compte</th>
						<th>Nom & Prenom</th>
						<th>Sexe</th>
						<th>CNI</th>
						<th>Somme</th>
						<th>Options</th>
					</tr>
				</thead>
				<tbody>
					<tr
						:class="{'disabled':!compte.is_active}"
						v-for="compte in comptes"
						@click="e => activateRow(e)"
						@dblclick="openProfile(compte.id)">
						<td>{{ compte.account_number }}</td>
						<td style="max-width:150px">
							{{ compte.last_name }} {{ compte.first_name }}
						</td>
						<td>
							{{ getSexe(compte) }} 
						</td>
						<td>{{ compte.CNI }}</td>
						<td>{{ !!compte.balance?money(compte.balance):"-" }}</td>
						<td>
							<router-link :to="'/history-compte/'+compte.id" v-slot="{ navigate }">
								<button class="btn-sm bg-secondary" @click.stop="navigate">
									<fa icon="list-alt"/>
								</button>
							</router-link>
							<span v-if="compte.is_active">
								<button class="btn-sm bg-primary"
									@click.stop="dupliquer(compte)">
									x2
								</button>
								<button class="btn-sm bg-danger"
									@click.stop="removeCompte(compte)">
									<fa icon="trash"/>
								</button>
								<button class="btn-sm bg-primary"
									@click.stop="editCustomer(compte)">
									<fa icon="pen"/>
								</button>
								<span v-if="active_user_is_responsable">
									<span v-if="!isEpargne(compte)" style="margin-right: 5px;">
										<button class="btn-sm bg-success" v-if="compte.unlock_type==-1"
											@click.stop="unlockCompte(compte)">
											<fa icon="unlock"/>
										</button>
										<button class="btn-sm bg-danger" v-else
											@click.stop="lockCompte(compte)">
											<fa icon="lock"/>
										</button>
										<button class="btn-sm bg-success"
											@click.stop="epargner(compte)">
											epargner
										</button>
									</span>
									<span v-else>
										<button class="btn-sm bg-primary"
											@click.stop="liberer(compte)">
											liberer
										</button>
										<button class="btn-sm bg-primary"
											@click.stop="listerEpargne(compte)">
											état
										</button>
									</span>
								</span>
							</span>
						</td>
					</tr>
				</tbody>
			</table>
			<a href="#" style="color: lightgray;" @click="loadMore" v-if="!!next">
				gukwega ibindi...
			</a>
		</div>
		<DialogCustomer @close="close" :item="active_compte"
			:class="{'hidden':!indiv_shown}"/>
		<DialogOrganisation @close="close" :item="active_compte"
			:class="{'hidden':!org_shown}"/>
		<DialogEpargner @close="close" :item="active_compte"
			:class="{'hidden':!epargner_shown}"/>
		<DialogUnlock @close="close" :compte="active_compte"
			:class="{'hidden':!unlock_shown}"/>
		<DialogEpargneList @close="close" :compte="active_compte"
			:active="epargne_list_shown"/>
	</div>
</template>
<script>
import DialogCustomer from "../components/guichet/dialog_individu"
import DialogOrganisation from "../components/guichet/dialog_organisation"
import DialogEpargner from "../components/guichet/dialog_epargner"
import DialogUnlock from "../components/guichet/dialog_unlock"
import DialogEpargneList from "../components/guichet/dialog_epargne_list"

export default {
  props: {},
  components:{
  	DialogCustomer,
  	DialogOrganisation,
  	DialogUnlock,
  	DialogEpargner,
	  DialogEpargneList
	},
  data(){
  	return {
  		comptes: this.$store.state.comptes,
  		indiv_shown:false,
  		unlock_shown:false,
  		cheque_shown:false,
  		next:null,
  		active_compte:undefined,
  		keyword:"",
  		active_org:undefined,
  		org_shown:false,
  		epargner_shown:false,
  		epargne_list_shown:false
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
  		this.indiv_shown = false;
  		this.org_shown = false;
  		this.unlock_shown = false;
  		this.cheque_shown = false;
  		this.epargner_shown = false;
  		this.epargne_list_shown = false;
  	},
  	isEpargne(compte){
  		return compte.epargne_end_date && new Date(compte.epargne_end_date) > new Date()
  	},
  	openProfile(compte_id){
  		this.$router.push(`/profile/${compte_id}`)
  	},
  	editCustomer(compte){
  		this.active_compte = compte
  		if(compte.organisation != null){
  			this.org_shown = true
  		} else {
  			this.indiv_shown = true
  		}
  	},
  	epargner(compte){
  		this.active_compte = compte
  		this.epargner_shown = true
  	},
  	listerEpargne(compte){
  		this.active_compte = compte
  		this.epargne_list_shown = true
  	},
  	unlockCompte(compte){
  		this.active_compte = compte
  		this.unlock_shown = true
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
  	lockCompte(compte){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
  		if(confirm("Voulez-vous vraiment reverouiller ce compte?")){
				axios.get(this.url+`/compte/${compte.id}/verrouiller/`, this.headers)
				.then((response) => {
					compte.unlock_type = response.data.unlock_type
					compte.balance = response.data.balance
				}).catch((error) => {
					console.error(error)
				})
  		}
  	},
  	removeCompte(compte){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
  		let confirm = this.active_user.first_name+" "+this.active_user.last_name;
  		if (prompt(`veuiller taper: "${confirm}" pour confirmer`) === confirm) {
				axios.delete(this.url+`/compte/${compte.id}/`, this.headers)
				.then((response) => {
					if(response.status == 204){
						let index = this.$store.state.comptes.indexOf(compte)
						if(index >= 0) this.$store.state.comptes.splice(index, 1)
					} else {
						compte.is_active = false
					}
				}).catch((error) => {
					this.displayErrorOrRefreshToken(error, this.removeCompte)
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
		liberer(compte){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
			axios.get(this.url+`/compte/${compte.id}/liberer/`, this.headers)
			.then(() => {
				compte.epargne_start_date=null
				compte.epargne_end_date=null
			}).catch((error) => {
				this.displayErrorOrRefreshToken(error, this.liberer)
			})
		},
		dupliquer(compte){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
	    axios.get(this.$store.state.url+`/compte/${compte.id}/dupliquer/`, this.headers)
	    .then((response) => {
	    	this.$store.state.comptes.push(response.data.data)
	    }).catch((error) => {
	      this.displayErrorOrRefreshToken(error, this.dupliquer)
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
