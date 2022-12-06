<template>
	<Overlay @close="close">
		<div class="field">
			<label for="numero">Ancien Mot de passe:</label>
			<input id="numero" type="password" v-model="old_password"
				placeholder="Ancien Mot de passe" />
		</div>
		<div class="field">
			<label for="numero">Nouveau Mot de passe:</label>
			<input id="numero" type="password" v-model="new_password"
				placeholder="Nouveau Mot de passe" />
		</div>
		<label class="logs">{{ pass_logs }}</label>
		<div class="field">
			<label for="numero">Retaper le mot de passe:</label>
			<input id="numero" type="password" v-model="new_password_2"
				placeholder="Nouveau Mot de passe" />
		</div>
		<div class="field">
			<label class="logs">{{ logs }}</label>
		</div>
		<button class="btn" @click="changePassword" :v-if="is_valid">
			Changer
		</button>
	</Overlay>
</template>
<script>
import Overlay from "./dialog_overlay";
export default {
	props: ["compte"],
	components: { Overlay },
	data() {
		return {
			numero: "", logs: "", old_password:"",
			new_password:"", new_password_2:"",
			pass_logs:"", is_valid:false
		};
	},
	watch:{
		new_password(new_val){
			this.isPasswordWeak(new_val)
		},
		new_password_2(new_val){
			if(new_val.length==0) this.logs=""
			if(new_val!=this.new_password){
				this.logs = "les nouveaux mot de passe ne se ressemble pas"
			} else {
				this.logs=""
				this.is_valid = true
			}
		}
	},
	methods: {
		isPasswordWeak(password){
			if(password.length<8){
				this.pass_logs = "trop court"
			}else if(new Set(password.split("")).size<5){
				this.pass_logs = "moins de 6 different caractère"
			}else if((password == password.toUpperCase()) || (password==password.toLowerCase())){
				this.pass_logs = "melangez majiscules et miniscules"
			}else if((password.match(/[0-9]+/) == null) || (password.match(/[a-zA-Z]+/) == null)){
				this.pass_logs = "melangez lettres et chiffres"
			} else{
				this.pass_logs = ""
			}
		},
		changePassword() {
			if(this.user_is_readonly){
			this.$store.state.alert = {
				type:"danger",
				message:this.cleanString(error.response.data)
			}
				return
			}
			if(!this.is_valid){
				this.logs = "mot de passe trop faible"
				return
			}
			let data = {
				"old_password":this.old_password,
				"new_password":this.new_password
			}
			axios.post(this.url +`/user/changepassword/`, data, this.headers)
			.then((response) => {
				alert("OK");
				this.$emit("close");
			})
			.catch((error) => {
				this.displayErrorOrRefreshToken(error, this.changePassword);
			});
		},
		close(){
			this.numero = 0;
			this.logs = "";
			this.$emit('close')
		}
	},
};
</script>
<style scoped>
</style>
