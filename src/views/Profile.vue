<template>
	<div class="container">
		<div class="nonprintable">
			<div class="row" v-if="!!compte">
				<div class="col-2 first">
					<div class="compte">
						<div>
							<div class="identifier">Nom: </div>
							<div class="nom">{{ compte.first_name }}</div>
						</div>
						<div>
							<div class="identifier">Prenom: </div>
							<div class="nom">{{ compte.last_name }}</div>
						</div>
						<div>
							<div class="identifier">CNI: </div>
							<div class="nom">{{ compte.CNI }}</div>
						</div>
						<div>
							<div class="identifier">Age: </div>
							<div class="nom">{{ getAge(compte) }}</div>
						</div>
						<div>
							<div class="identifier">Télephone: </div>
							<div class="nom">{{ compte.phone_number }}</div>
						</div>
						<div>
							<div class="identifier">Adresse: </div>
							<div class="nom">{{ compte.adress }}</div>
						</div>
						<div>
							<div class="identifier">Personne de confiance: </div>
							<div class="nom">{{ compte.confiance }}</div>
						</div>
						<div>
							<div class="identifier">CNI de confiance: </div>
							<div class="nom">{{ compte.CNI_confiance }}</div>
						</div>
						<div>
							<div class="identifier">Sexe: </div>
							<div class="nom">{{ getSexe(compte) }}</div>
						</div>
					</div>
				</div>
				<div class="table" v-if="active_user_is_responsable">
					<table>
						<caption>CREDITS</caption>
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
							<tr v-for="credit in compte.credit">
								<td>{{ credit.account.account_number }}</td>
								<td>{{ credit.account.first_name+" "+credit.account.last_name }}</td>
								<td> {{ datetime(credit.date)}}</td>
								<td>{{ credit.motif }}</td>
								<td>{{ credit.interest_rate }}%</td>
								<td>{{ credit.period_time }} mois</td>
								<td>{{ money(credit.asked_amount) }}  FBu</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="table" v-if="active_user_is_responsable">
					<table> 
						<caption>PLACEMENTS</caption>
						<thead>
							<tr>
								<th>No. compte</th>
								<th>Nom</th>
								<th>Date</th>
								<th>taux</th>
								<th>periode</th>
								<th>Somme</th>
								<th>interval</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="placement in compte.placement">
								<td>{{ placement.account.account_number }}</td>
								<td>{{ placement.account.first_name+" "+placement.account.last_name }}</td>
								<td> {{ datetime(placement.date) }}</td>
								<td>{{ placement.interest_rate }}%</td>
								<td>{{ placement.period_time }} mois</td>
								<td>{{ money(placement.amount) }} FBu</td>
								<td>{{ placement.intervalle }} mois</td>
							</tr>
						</tbody>
					</table>
				</div>
				<center class="col-2 second amaphotos">
					<!-- image au format A4 -->
					<img :src="active_img">
				</center>
				<div class="controls" id="ubuto">
					<input @click="e => selectImg(e, compte.document1)" type="radio" name="" checked>
					<input @click="e => selectImg(e, compte.document2)" type="radio" name="">
					<input @click="e => selectImg(e, compte.document3)" type="radio" name="">
				</div>
			</div>
			<div class="inputs custom-inputs" v-if="!!compte && compte.is_active">
				<SpinnerComp v-if="spinner"></SpinnerComp>
				<label for="action">Action</label>
				<select v-model="action" id="action">
					<option value="retrait">Retrait</option>
					<option value="depot">Depot</option>
					<option value="virement">Virement</option>
					<option value="multivirement">Virement Multiple</option>
				</select>
				<div class="text-input">
					<label for="fullname">Personne présente:</label>
					<input type="text"
						placeholder="Nom et prenom"
						id="fullname"
						v-model="personne">
					<div v-if="action=='multivirement'">
						<input type="file" accept=".csv" 
							@change="e => prepareData(e)">
						<div class="virement" v-if="to_accounts.length > 0">
							<table>
								<thead>
									<tr>
										<th>Nom</th>
										<th>No. compte</th>
										<th>Montant</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="acc in to_accounts">
										<td>{{ acc.name }}</td>
										<td>{{ acc.account }}</td>
										<td>{{ money(acc.amount) }}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<div v-else-if="action=='depot'">
						<div class="billets">
							<label>Les billets</label>
							<div class="row">
								<div class="valeur">10 000 x</div>
								<div>
									<input type="number" min="0"
										v-model="dixmille"
										@change="computeMontant">
								</div>
								<div class="tot">{{ money(dixmille * 10000) }}</div>
							</div>
							<div class="row">
								<div class="valeur">5 000 x</div>
								<div>
									<input type="number" min="0"
										v-model="cinqmille"
										@change="computeMontant">
								</div>
								<div class="tot">{{ money(cinqmille * 5000) }}</div>
							</div>
							<div class="row">
								<div class="valeur">2 000 x</div>
								<div>
									<input type="number" min="0"
										v-model="deuxmille"
										@change="computeMontant">
								</div>
								<div class="tot">{{ money(deuxmille * 2000) }}</div>
							</div>
							<div class="row">
								<div class="valeur">1 000 x</div>
								<div>
									<input type="number" min="0"
										v-model="mille"
										@change="computeMontant">
								</div>
								<div class="tot">{{ money(mille * 1000) }}</div>
							</div>
							<div class="row">
								<div class="valeur">500 x</div>
								<div>
									<input type="number" min="0"
										v-model="cinqcent"
										@change="computeMontant">
								</div>
								<div class="tot">{{ money(cinqcent * 500) }}</div>
							</div>
							<div class="row">
								<div class="valeur">100 x</div>
								<div>
									<input type="number" min="0"
										v-model="cent"
										@change="computeMontant">
								</div>
								<div class="tot">{{ money(cent * 100) }}</div>
							</div>
							<div class="row">
								<div class="valeur">50 x</div>
								<div>
									<input type="number" min="0"
										v-model="cinquante"
										@change="computeMontant">
								</div>
								<div class="tot">{{ money(cinquante * 50) }}</div>
							</div>
						</div>
					</div>
					<div v-else>
						<label for="montant">Montant:</label>
						<input type="number" id="montant" 
							placeholder="Le Montant"
							v-model="montant"
							min="500" step="100">
					</div>
					<div class="input" v-if="action=='virement'">
						<input type="text" autocomplete="off"
							id="keyword" v-on:keyup.enter="rechercher"
							v-model="keyword" placeholder="CNI ou No. de compte">
						<button @click="rechercher">
							<fa icon="search"/>
						</button>
						<div class="result">
							{{ result }}
							<div v-if="destinations.length > 1">
								<div v-for="dest in destinations.slice(0, 4)" class="found">
									<input type="radio"
										v-model="destination" :value="dest"
										:id="dest.account_number">
									<label :for="dest.account_number">
										{{ dest.account_number }} {{ dest.first_name }}
									</label>
								</div>
							</div>
						</div>
					</div>
					<div class="details">
						<label for="details">Motif</label>
						<textarea id="details" v-model="details"
							placeholder="autre informations y relatives">
						</textarea>
					</div>
					<label class="logs">{{ logs }}</label>
					<button  class="submit-button" v-if="!!action && !spinner" @click="performAction">
						{{action.toUpperCase()+" de "+money(montant)+" FBu"}}
					</button>
				</div>
			</div>
		</div>
		<div class="invoice" v-for="i in 1">
			<center>
				<!-- <img style="width: 100%" src="@/assets/logo_hd.jpeg"> -->
				<img src="/static/logo.png">
			</center>
			<center>
				<b>SCHEKINAH FINANCE</b>
			</center>
			<div>Tel 68 33 41 00 </div>
			<div>Capital Social </div>
			<div class="border">
				{{ action.toUpperCase() }} No. {{ id }}
			</div>
			<div>
				du: {{ datetime(new Date) }}
			</div>
			<div>
				compte No. {{ !!compte?compte.account_number:"" }}
			</div>
			<div>
				{{ action }} effectué par {{ personne }}
			</div>
			<div>
				la somme de <b>{{ money(montant) }}</b> FBu
			</div>
			<div>
				<b>Motif: </b>{{ details }}
			</div>
			<div v-if="!!destination && action=='virement'">
				<div>vers le compte No. {{destination.account_number}}</div>
				<div>de {{ destination.first_name+" "+ destination.last_name}}</div>
			</div>
			<div>
				Guichetier: {{ active_user.first_name+" "+active_user.last_name }} 
			</div>
		</div>
	</div>
</template>
<script>
import SpinnerComp from "../components/spinner_comp.vue"
export default {
  data(){
  	return {
		spinner:false,
  		dialog_shown:false,
  		action:"retrait",
  		result:"",
  		keyword:"",
  		compte:{},
  		montant:0,
  		destination:null,
  		destinations:[],
  		details:"",
  		result_id:-1,
  		logs:"",
  		personne:"",
  		id:undefined,
  		to_accounts:[],
  		dixmille:0, cinqmille:0, deuxmille:0, mille:0, cinqcent:0, cent:0, cinquante:0,
  		active_img:""
  	}
  },
  components:{
	SpinnerComp
  },
  watch:{
  	keyword(new_val){
  		this.destinations = []
  		let founds = this.$store.state.comptes.filter(x =>{
  			return JSON.stringify(x).includes(new_val) && x.id != this.compte.id
  		})
  		this.result = `found: ${founds.length} results`;
  		if(founds.length == 1) {
  			this.destination = founds[0]
  		} else {
  			this.destinations = founds
  		}
  	},
  	destination(new_val){
  		this.to_accounts = [
				{"account":new_val.account_number, "amount":this.montant}
			]
			this.result = `found: ${new_val.first_name} ${new_val.last_name}`;
  	},
  	action(new_val){
  		if (new_val=="virement" || new_val=="multivirement" )
  			this.personne = this.compte.first_name+" "+ this.compte.last_name
  	},
  	id(new_val){
  		setTimeout(()=>{
  			this.compte.unlock_type = -1
  			window.print()
  		}, 100)
  	}
  },
  methods:{
  	computeMontant(){
  		this.montant = (
  			this.dixmille*10000 + this.cinqmille*5000 + this.deuxmille*2000 + 
  			this.mille*1000 + this.cinqcent*500 + this.cent*100 + this.cinquante*50
  		)
  	},
  	selectImg(e, img){
  		this.active_img = img
  		let ubuto = document.getElementById("ubuto")
  		for(let agato of ubuto.children){
  			console.log(agato)
  			if(agato != event.target){
  				agato.checked = false
  			}
  		}
  	},
  	rechercher(){
  		this.result = "recherche..."
  		this.destinations = []
      axios.get(this.$store.state.url+`/compte/?search=${this.keyword}`, this.headers)
      .then((response) => {
        if(response.data.results.length == 1) {
          this.destination = response.data.results[0]
        } else {
          this.result = `found: ${response.data.results.length} results`;
  				this.destinations = response.data.results
        }
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.createMember)
        console.log(error)
        this.result = `found: 0 results`;
      })
  	},
  	prepareData(event){
  		this.montant=0
  		let file_path = event.target.files[0]
			var reader = new FileReader()
			reader.onload = (event) => {
			    const file = event.target.result;
			    const lines = file.split(/\r\n|\n/);
			    let array_line = []
			    lines.forEach((line) => {
			      array_line = line.split(/,|;/);
			      if(array_line.length>1){
			      	if(array_line[2].length > 2){
								this.to_accounts.push({
									"name":array_line[0],
									"account":array_line[1],
									"amount":array_line[2]
								})
								this.montant += parseInt(array_line[2])
			      	}
			      }
			    });
			};
    	reader.onerror = (event) => {
        alert(event.target.error.name);
			};
			reader.readAsText(file_path, 'ISO-8859-1');
  	},
  	virer(montant){
			let data = {
				"amount": this.montant,
				"details": this.details,
				"from_account": this.compte.id,
				"to_accounts": this.to_accounts
			}
			this.spinner=true
			axios.post(this.url+`/virement/`, data, this.headers)
			.then((response) => {
				this.compte.balance = undefined.montant
				this.id = this.compte.numero
	      this.logs = ""
	      this.action = ""
	      if(data.to_accounts.length>1){
	      	alert("SUCCESS")
	      }
			}).catch((error) => {
				this.displayErrorOrRefreshToken(error, () => this.virer(montant))
			}).finally(() => this.spinner = false)
  	},
  	deposer(montant){
			let data = {
				"account": this.compte.id,
				"amount": montant,
				"details": this.details,
				"depositaire":this.personne
			}
			this.spinner=true
			axios.post(this.url+"/depot/", data, this.headers)
			.then((response) => {
				this.compte.balance = undefined
				this.id = response.data.id
	      this.logs = ""
	      this.action = ""
			}).catch((error) => {
        this.displayErrorOrRefreshToken(error, () => this.deposer(montant))
			}).finally(() => this.spinner = false)
  	},
  	retirer(montant){
			let data = {
				"account": this.compte.id,
				"amount": this.montant,
				"details": this.details,
				"depositaire":this.personne
			}
			this.spinner=true
			axios.post(this.url+"/retrait/", data, this.headers)
			.then((response) => {
				this.compte.balance = undefined
				this.id = response.data.id
	      this.logs = ""
	      this.action = ""
			}).catch((error) => {
        this.displayErrorOrRefreshToken(error, () => this.retirer(montant))
			}).finally(() => this.spinner = false)
  	},
		performAction(){
			if(this.user_is_readonly){
				this.$store.state.alert = {
					type:"danger",
					message:"Vous êtes en lecture seule"
				}
				return
			}
		if(confirm("Verifiez si les informations fournies sont correctes !")){
			this.logs = "soumission en cours..."
			let montant = Math.abs(parseInt(this.montant));
			if (this.action == "virement"){
				this.virer(montant)
			}
			if (this.action == "depot"){
				this.deposer(montant)
			}
			if (this.action == "retrait"){
				this.retirer(montant)
			}
			if (this.action == "multivirement"){
				this.virer(montant)
			}
		}else
			this.alert("Abandonee")
  	},
  	getCompte(id){
		axios.get(this.url+`/compte/${id}/`, this.headers)
		.then((response) => {
          this.compte = response.data
		}).catch((error) => {
      this.displayErrorOrRefreshToken(error, this.performAction)
		})
  	}
  },
  mounted(){
  	let id = this.$route.params.id;
  	this.compte = this.$store.state.comptes.find(x => x.id==id)
  	if(!this.compte){
  		this.getCompte(id)
  	}
  	this.active_img = this.compte.document1
  }
};
</script>
<style scoped>
.virement{
	margin-top: 10px;
	max-height: 120px;
	overflow-y: auto;
}
.virement *{
	font-size: .95em;
	margin: 0;
	padding: 0 0 0 2px;
}
.container {
	width: 80%;
	margin: 50px auto;
}
.row {
	width: 100%;
	display: block;
	/* flex-wrap: wrap; */
}
.second {
	width: 100%;
	height: 100%;
	overflow-x: auto;
}
img {
	width: 210mm;
	height: 297mm;
}
.first {
	padding: 20px;
	margin-bottom: 20px;
	background: #f5f5f5;
}
input[type=text], input[type=number], select{
	display: block!important;
	padding: 3px 5px;
	margin-right: 5px;
	margin-bottom: 5px;
	width: 330px;
	font-size: 1.2em;
	border: 2px solid var(--primary);
}
.text-input button {
	position: relative;
	display: block;
	font-size: 1.2em;
	padding: 5px 15px;
}
.input button {
	display: block;
	font-size: 1.2em;
	height: 40px;
	width: 40px;
}
.inputs {
	width: 330px;
	margin: auto;
	color: black;
}
.billets{
	color: white;
}
.billets .row{
	display: flex;
	margin: 0;
	text-align: right;
	align-items: center;
}
.billets input{
	width: 70px;
	margin-left: 5px;
}
.text-input {
	overflow-x: hidden;
}
.text-input textarea {
	width: 330px;
	padding: 5px 10px;
}
.tot{
	width: 120px;
}
.valeur{
	flex-grow: 1;
}
.valeur, .tot, .billets label{
	font-weight: 600;
	font-size: 1.2em;
	text-shadow:
		1px 1px var(--primary),
		1px -1px var(--primary),
		-1px 1px var(--primary),
		-1px -1px var(--primary);

}
.input {
	position: relative;
}
.input input {
	padding-right: 38px;
}
.input button {
	position: absolute;
	right: 0px;
}
label, .result {
	color: var(--white);
	font-weight: 400;
}
.details > * {
	display: block;
	margin-bottom: 5px;
}
.identifier {
  font-weight: 600;
}
caption{
	color: whitesmoke;
	font-weight: 700;
}
.amaphotos{
	overflow-x: hidden;
	display: flex;
}
.controls{
	width: 50px;
	margin: 5px auto;
}
.amaphotos *{
	width: 100%;
}
.found{
	white-space: nowrap;
	padding: 5px;
}
.found label{
	margin-left: 5px;
	font-weight: bold;
}
.found:hover{
	background-color: var(--secondary);
}
.compte{
	display: grid;
	grid-template-columns: repeat(4, 1fr);
}
.compte>*{
	margin-bottom: 10px;
}
@media screen and (max-width: 900px) {
	.container {
		width: 100%;
	}
	.compte{
		grid-template-columns: repeat(3, 1fr);
	}
}

@media screen and (max-width: 600px) {
	.container {
		padding: 0;
	}
	.row {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
	}
	.col-2 {
		width: 100%;
		display: block;
		flex-basis: 100%;
	}
}
.custom-inputs{
	position: relative;
}
.submit-button{
	position:absolute
}
</style>
