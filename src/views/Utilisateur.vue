<template>
	<div class="container" @click="close">
		<div class="row">
			<button @click.stop="close();personnel_shown=true" class="add">
				Nouveau Utilisateur
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
						<th>CNI</th>
						<th>Agence</th>
						<th>Nom</th>
						<th>Role</th>
						<th>Initial</th>
						<th>Retrait</th>
						<th>Depot</th>
						<th>Total</th>
						<th>Options</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="personnel in users" v-if="!!personnel" :class="{'limogee':isLimogee(personnel)}">
						<td>{{ personnel.CNI || parseInt(Math.random()*100000) }}</td>
						<td>{{ personnel.agency.name }}</td>
						<td>{{ personnel.user.last_name +" "+ personnel.user.first_name}}</td>
						<td>
							<button class="btn-sm bg-success" v-if="personnel.user.is_active"
									@click.stop="e => showContext(e, personnel)">
								<fa icon="pen"/>
							</button>
							{{ getGroupName(personnel.user.groups[0]) }}
						</td>
						<td>{{ money(personnel.activite.somme_initial)}} FBu</td>
						<td>{{ money(personnel.activite.retrait)}} FBu</td>
						<td>{{ money(personnel.activite.depot)}} FBu</td>
						<td>{{ money(
							personnel.activite.somme_initial+
							(personnel.activite.depot-personnel.activite.retrait)
							)
						}} FBu</td>
						<td>
							<button @click.stop="e => showOptions(e)" class="btn-sm bg-primary">plus...</button>
							<div class="dropdownmenu">
								<div v-if="personnel.user.is_active">
									<!-- <div v-if="userIs(personnel, getGroupId('guichetier'))"> -->
										<button class="btn-sm bg-primary" @click.stop="remiseA(personnel)">
											remise
										</button>
										<button class="btn-sm bg-primary" @click.stop="reprendreA(personnel)">
											reprise
										</button>
										<router-link :to="'/hist-user/'+personnel.user.id" v-slot="{ navigate }">
											<button class="btn-sm bg-secondary" @click.stop="navigate">
												Historique
											</button>
										</router-link>
									<!-- </div> -->
								</div>
								<div v-if="personnel.user.is_active">
									<button class="btn-sm bg-primary" @click.stop="edit(personnel)">
										modifier
									</button>
									<button class="btn-sm bg-secondary" @click="resetPassword(personnel)">
										reset password
									</button>
									<button class="btn-sm bg-danger" @click="limoger(personnel)">
										limoger
									</button>
								</div>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<DialogPersonnel @close="close" :class="{'hidden':!personnel_shown}" :item="item"/>
		<DialogRemise @close="close" :class="{'hidden':!remise_shown}" :item="item"/>
		<DialogReprise @close="close" :class="{'hidden':!reprise_shown}" :item="item"/>
		<ContextGroup @close="close" :x="x" :y="y" :class="{'hidden':!context_shown}" :item="item"/>
	</div>
</template>
<script>
import DialogPersonnel from "../components/dialog_personnel"
import DialogRemise from "../components/dialog_remise"
import DialogReprise from "../components/dialog_reprise"
import ContextGroup from "../components/context_group"
export default {
  props: {
  },
  components:{DialogPersonnel, DialogRemise, ContextGroup,DialogReprise},
  data(){
  	return {
  		personnel_shown:false, remise_shown:false,reprise_shown:false,
  		users:this.$store.state.users, item:null,
  		context_shown:false, x:0, y:0, keyword:""
  	}
  },
  watch:{
  	"$store.state.users"(new_val){
  		this.users = new_val;
  	},
  	keyword(new_val){
  		console.log(new_val)
  		this.users = this.$store.state.users.filter(x=>
  			JSON.stringify(x).toLowerCase().includes(new_val.toLowerCase())
  		)
  	}
  },
  methods:{
  	addMember(){
  		this.close()
  		this.personnel_shown = true;
  	},
  	isLimogee(personnel){
  		if(!!personnel){
  			return !personnel.user.is_active
  		}
  		return false;
  	},
  	showContext(event, personnel){
  		this.close()
  		this.context_shown = true;
  		this.item = personnel;
  		this.x = event.clientX;
  		this.y = event.clientY;
  	},
  	showOptions(e){
  		this.close()
  		let menu = e.target.nextSibling;
  		menu.style.display="block";
  	},
  	hideOptionsMenu(){
  		let menus = document.getElementsByClassName("dropdownmenu")
  		for(let menu of menus){
  			menu.style.display="none";
  		}
  	},
  	close(){
  		this.remise_shown = false;
  		this.personnel_shown = false;
  		this.context_shown = false;
  		this.reprise_shown = false;
  		this.user = null
  		this.hideOptionsMenu()
  	},
  	remiseA(personnel){
  		this.close()
  		this.remise_shown = true;
  		this.item = personnel
  	},
  	limoger(personnel){
  		if(this.user_is_readonly){
  			this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
  			return
  		}
  		let message = `${this.active_user.first_name} ${this.active_user.last_name}`
  		let personne = `${personnel.user.first_name} ${personnel.user.last_name}`
  		if(message == personne){
  			alert("impossible de vous licencier vous même")
  			return
  		}
  		if(prompt(`si vous voulez vraiment licencier ${personne} tapez "${message}"`) == message){
				axios.delete(this.url+`/personnel/${personnel.id}/`, this.headers)
				.then((response) => {
					alert(response.data.status)
					personnel.user.is_active="false"
				}).catch((error) => {
  				alert("ÉCHOUÉE")
				  console.error(error);
				})
  		}
  	},
  	resetPassword(personnel){
  		if(this.user_is_readonly){
  			this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
  			return
  		}
  		let password = prompt(`Tapez son nouveau mot de passe :`)
  		if(password.length<8){
  			alert("au moins 8 caractères")
  			return
  		}
			axios.post(this.url+`/user/${personnel.user.id}/resetpassword/`,
				{"new_password":password}, this.headers)
			.then((response) => {
				alert(response.data.status)
				personnel.user.is_active="false"
			}).catch((error) => {
				alert("ÉCHOUÉE")
			  console.error(error);
			})
  	},
  	reprendreA(personnel){
		this.close()
		this.reprise_shown = true;
  		this.item = personnel
  	},
  	edit(personnel){
  		this.close()
  		this.personnel_shown = true;
  		this.item = personnel
  	},
  	getAgenceName(id){
  		let agence = this.$store.state.agences.find(x => x.id == id);
  		return !agence?"-":agence.name
  	},
  	fetchUsers(){
			axios.get(this.url+"/personnel/", this.headers)
			.then((response) => {
				this.$store.state.users = response.data.results
				this.fetchOtherData()
			}).catch((error) => {
				this.displayErrorOrRefreshToken(error, this.fetchUsers)
			})
  	},
  	fetchOtherData(){
			axios.get(this.url+"/group/", this.headers)
			.then((response) => {
				this.$store.state.groups = response.data.results
			}).catch((error) => {
				console.error(error);
			})
			axios.get(this.url+"/agence/", this.headers)
			.then((response) => {
				this.$store.state.agences = response.data.results
			}).catch((error) => {
				console.error(error);
			})
  	}
  },
  mounted(){
  	if(!this.active_user_is_responsable && !this.user_is_readonly){
  		this.$router.push("/")
  	} else {
			if(this.$store.state.users.length<2){
				this.fetchUsers()
			}
  	}
  }
};
</script>
<style scoped>
.limogee{
	text-decoration: line-through;
  color: #777;
}
.dropdownmenu *{
	display: block;
	width: 100%;
}
.dropdownmenu{
	position: absolute;
	z-index: 2;
	background-color: white;
	display: none;
	padding: 2px 2px 0 2px;
}
</style>
