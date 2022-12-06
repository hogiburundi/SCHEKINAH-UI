<template>
	<div class="container">
		<div class="row nonprintable">
			<div class="line">
				<button @click="addMember" class="add">
					Nouveau Credit
				</button>
				<button @click="displayAllCredits" class="btn bg-primary">
					Tous
				</button>
				<button class="btn bg-primary" @click="displayResume">
						Resumé
				</button>
				<div>
					<button @click.stop="e => showOptions(e)" class="btn-sm bg-primary">Autres...</button>
					<div class="dropdownmenu">
						<button class="btn-sm bg-secondary" @click.stop="displayUndoneCredits">
							En cours
						</button>
						<button class="btn-sm bg-primary" @click.stop="displayDoneCredits">
							Rembourse
						</button>
						<button class="btn-sm bg-danger" @click.stop="displayBlackBox">
							Boite noir
						</button>
					</div>
				</div>
				
			</div>
			<div>
				<input type="text" v-model="keyword" placeholder="rechercher">
				<button class="search">Rechercher</button>
			</div>
		</div>
		<div class="table" v-if="black_box_shown">
			<table> 
				<thead>
					<tr>
						<th>No. compte</th>
						<th>Nom</th>
						<th>Date</th>
						<th>Projet</th>
						<th>taux</th>
						<th>periode</th>
						<th>Somme</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="credit in black_box_credits"
						@click="e => activateRow(e)"
						@dblclick="goto(credit)"
						:class="{
							'approved':!!credit.first_name,
							'done':credit.done,
							'waiting':credit.en_attente
						}">
						<td>{{ credit.account.account_number }}</td>
						<td>{{ credit.account.first_name+" "+credit.account.last_name }}</td>
						<td>{{ datetime(credit.date)}}</td>
						<td>{{ credit.motif }}</td>
						<td>{{ credit.interest_rate }}%</td>
						<td>{{ credit.period_time }} mois</td>
						<td>{{ money(credit.asked_amount) }}  FBu</td>
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<td colspan="6">Total</td>
						<td>{{money(black_box_credits.reduce((sum, x) => sum + x.asked_amount, 0))}} Fbu</td>
					</tr>
				</tfoot>
			</table>
		</div>
		<div class="table" v-if="undone_credits_shown">
			<table> 
				<thead>
					<tr>
						<th>No. compte</th>
						<th>Nom</th>
						<th>Date</th>
						<th>Projet</th>
						<th>taux</th>
						<th>periode</th>
						<th>Somme</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="credit in undone_credits"
						@click="e => activateRow(e)"
						@dblclick="goto(credit)"
						:class="{
							'approved':!!credit.first_name,
							'done':credit.done,
							'waiting':credit.en_attente
						}">
						<td>{{ credit.account.account_number }}</td>
						<td>{{ credit.account.first_name+" "+credit.account.last_name }}</td>
						<td>{{ datetime(credit.date)}}</td>
						<td>{{ credit.motif }}</td>
						<td>{{ credit.interest_rate }}%</td>
						<td>{{ credit.period_time }} mois</td>
						<td>{{ money(credit.asked_amount) }}  FBu</td>
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<td colspan="6">Total</td>
						<td>{{money(undone_credits.reduce((sum, x) => sum + x.asked_amount, 0))}} Fbu</td>
					</tr>
				</tfoot>
			</table>
		</div>
		<div class="table" v-if="done_credits_shown">
			<table> 
				<thead>
					<tr>
						<th>No. compte</th>
						<th>Nom</th>
						<th>Date</th>
						<th>Projet</th>
						<th>taux</th>
						<th>periode</th>
						<th>Somme</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="credit in done_credits"
						@click="e => activateRow(e)"
						@dblclick="goto(credit)"
						:class="{
							'approved':!!credit.first_name,
							'done':credit.done,
							'waiting':credit.en_attente
						}">
						<td>{{ credit.account.account_number }}</td>
						<td>{{ credit.account.first_name+" "+credit.account.last_name }}</td>
						<td>{{ datetime(credit.date)}}</td>
						<td>{{ credit.motif }}</td>
						<td>{{ credit.interest_rate }}%</td>
						<td>{{ credit.period_time }} mois</td>
						<td>{{ money(credit.asked_amount) }}  FBu</td>
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<td colspan="6">Total</td>
						<td>{{money(done_credits.reduce((sum, x) => sum + x.asked_amount, 0))}} Fbu</td>
					</tr>
				</tfoot>
			</table>
		</div>
			<div v-if="all_credits_shown" class="table">
			<table> 
				<thead>
					<tr>
						<th>ID</th>
						<th>No. compte</th>
						<th>Nom</th>
						<th>Date</th>
						<th>Projet</th>
						<th>taux</th>
						<th>periode</th>
						<th>Somme</th>
						<th>Options</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="credit in credits"
						@click="e => activateRow(e)"
						@dblclick="goto(credit)"
						:class="{
							'approved':!!credit.first_name,
							'done':credit.done,
							'waiting':credit.en_attente
						}">
						<td>{{ credit.id }}</td>
						<td>{{ credit.account.account_number }}</td>
						<td>{{ credit.account.first_name+" "+credit.account.last_name }}</td>
						<td>{{ datetime(credit.date)}}</td>
						<td>{{ credit.motif }}</td>
						<td>{{ credit.interest_rate }}%</td>
						<td>{{ credit.period_time }} mois</td>
						<td>{{ money(credit.asked_amount) }}  FBu</td>
						<td>
							<div v-if="active_user_is_responsable && !credit.done" class="inline">
								<span v-if="!credit.approved_by">
									<button class="btn-sm bg-success" @click.stop="validateCredit(credit)">
										<fa icon="check"/>
									</button>
									<button class="btn-sm bg-danger" @click.stop="deleteCredit(credit)">
										<fa icon="times"/>
									</button>
								</span>
								<span v-else>
									<button class="btn-sm bg-primary" @click.stop="liquider(credit)">
										liquider
									</button>
									<button
										v-if="credit.en_attente"
										class="btn-sm bg-primary"
										@click.stop="continuer(credit)">
										<fa icon="play"/>
									</button>
									<button
										v-else
										class="btn-sm bg-primary"
										@click.stop="attendre(credit)">
										<fa icon="pause"/>
									</button>
								</span>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<DialogCredit
			@close="close"
			:class="{'hidden':!dialog_shown}"/>
		<DialogOverview
			@close="close"
			:class="{'hidden':!overview_shown}"/>
		<DialogCreditValidation
			@close="close"
			:credit="active_credit"
			:class="{'hidden':!validation_shown}"/>
	</div>
</template>
<script>
import DialogCredit from "../components/credit/dialog_credit"
import DialogCreditValidation from "../components/credit/dialog_credit_validation"
import DialogOverview from "../components/credit/dialog_overview_credit"

export default {
  props: {
  },
  components:{
  	DialogCredit,
  	DialogCreditValidation,
  	DialogOverview,
  },
  data(){
  	return {
  		dialog_shown:false,
  		overview_shown:false,
  		black_box_shown:false,
		undone_credits_shown:false,
		done_credits_shown:false,
		all_credits_shown:true,
		done_credits:[],
		undone_credits:[],
  		credits:this.$store.state.credits,
  		keyword:"",
  		next:null,
  		validation_shown:false,
  		black_box_credits:[],
  		active_credit:null
  	}
  },
  watch:{
  	"$store.state.credits"(new_val){
  		this.credits = new_val
  	},
  	keyword(new_val){
  		console.log(new_val)
  		this.credits = this.$store.state.credits.filter(x=>
  			JSON.stringify(x).toLowerCase().includes(new_val.toLowerCase())
  		)
  	}
  },
  methods:{
  	addMember(){
  		this.dialog_shown = true;
  	},
  	displayResume(){
  		this.overview_shown = true;
  	},
  	close(){
  		this.dialog_shown = false;
  		this.overview_shown = false;
  		this.validation_shown = false;
  	},
  	continuer(credit){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
  		let confirm = this.active_user.first_name+" "+this.active_user.last_name;
  		if (prompt(`veuiller taper: "${confirm}" pour confirmer`) === confirm) {
				axios.get(this.url+`/credit/${credit.id}/continuer/`, this.headers)
				.then((response) => {
					credit.en_attente = false
				}).catch((error) => {
					this.displayErrorOrRefreshToken(error, this.continuer)
				})
  		} else {
  			alert("ABANDONÉE")
  		}
  	},
	attendre(credit){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
  		let confirm = this.active_user.first_name+" "+this.active_user.last_name;
  		if (prompt(`veuiller taper: "${confirm}" pour confirmer`) === confirm) {
				axios.get(this.url+`/credit/${credit.id}/attendre/`, this.headers)
				.then((response) => {
					credit.en_attente = true
				}).catch((error) => {
					this.displayErrorOrRefreshToken(error, this.attendre)
				})
  		} else {
  			alert("ABANDONÉE")
  		}
	},
  	deleteCredit(credit){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
  		let confirm = this.active_user.first_name+" "+this.active_user.last_name;
  		if (prompt(`veuiller taper: "${confirm}" pour confirmer`) === confirm) {
				axios.delete(this.url+`/credit/${credit.id}/`, this.headers)
				.then((response) => {
					let index = this.$store.state.credits.indexOf(credit)
					if(index >= 0) this.$store.state.credits.splice(index, 1)
	  				alert("FAIT")
				}).catch((error) => {
					this.displayErrorOrRefreshToken(error, this.deleteCredit)
				})
  		} else {
  			alert("ABANDONÉE")
  		}
  	},
  	goto(credit){
  		this.$router.push('/amortissement/'+credit.id)
  	},
  	liquider(credit){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
			axios.get(this.url+`/credit/${credit.id}/liquidation/`, this.headers)
			.then((response) => {
				let data = response.data
				let total = Math.ceil(data.capital_restant + data.benefice + data.penalite)
				let fullname = this.active_user.last_name +" "+ this.active_user.first_name
				if (prompt(`Si vous avez reçu: "${total}" dont ${JSON.stringify(data)} pour confirmer tapez : ${fullname}:`) === fullname){
						axios.get(this.url+`/credit/${credit.id}/liquider/`, this.headers)
						.then((response) => {
							alert(JSON.stringify(response.data))
							credit.done = true
						})
				}
			}).catch((error) => {
				this.displayErrorOrRefreshToken(error, this.liquider)
			})
  	},
  	validateCredit(credit){
  		this.active_credit = credit
  		this.validation_shown = true
  	},
	fetchCredit(){
	   	let link;
	    if(!this.next){
	      link = this.url+"/credit/"
	    } else {
	      link = this.next
	    }
	    axios.get(link, this.headers)
			.then((response) => {
				this.$store.state.credits.push(...response.data.results)
				if(response.data.next != null){
	        this.next = response.data.next
	        this.fetchCredit()
	      } else {
	      	this.next = null
	      }
			}).catch((error) => {
				this.displayErrorOrRefreshToken(error, this.fetchCredit)
			})
    },
    displayBlackBox(){
		this.init()
	  	this.black_box_shown=true
    	 axios.get(this.url+"/credit/black-box/", this.headers)
			.then((response) => {
				this.black_box_credits=response.data
			}).catch((error) => {
				this.displayErrorOrRefreshToken(error, this.displayBlackBox)
			})
	  },
	  init(){
		this.dialog_shown=false
  		this.overview_shown=false
  		this.black_box_shown=false
		this.undone_credits_shown=false
		this.done_credits_shown=false
		this.all_credits_shown=false
		this.hideOptionsMenu()
	  },
	  displayAllCredits(){
		this.init()
		this.all_credits_shown=true
	  },
	  displayUndoneCredits(){
		this.init()
	  	this.undone_credits_shown=true
    	this.undone_credits=this.credits.filter(x=> x.approved==true && x.done==false)
	  },
	  displayDoneCredits(){
		this.init()
	  	this.done_credits_shown=true
    	this.done_credits=this.credits.filter(x=> x.approved==true && x.done==true)
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
  },
  mounted(){
    if(this.$store.state.credits.length<2){
      this.fetchCredit()
    }
  }
};
</script>
<style scoped>
.approved{
	color: blue;
}
.line{
	display: flex;
	column-gap: 10px;
}
.waiting{
	color: darkgreen;
}
.inline{
	min-width: 110px;
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
