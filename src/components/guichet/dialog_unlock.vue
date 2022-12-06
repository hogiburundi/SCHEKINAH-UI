<template>
	<Overlay @close="$emit('close')">
		<div class="field-2">
			<p>
				<input value="0" id="quittance" type="radio" v-model="quittance" />
				<label for="quittance">Avec Quittance</label>
			</p>
		</div>
		<div class="field-2">
			<p>
				<input value="1" id="cheque" type="radio" v-model="quittance" />
				<label for="cheque">Avec Chèque</label>
			</p>
		</div>
		<div class="field-2">
			<p>
				<input value="2" id="ordre_virement" type="radio" v-model="quittance" />
				<label for="ordre_virement">Avec Ordre de virement</label>
			</p>
		</div>
		<div class="field-2">
			<label for="numero">Numero:</label>
			<input id="numero" type="number" v-model="numero" autocomplete="off" />
		</div>
		<div class="field-2">
			<label class="logs">{{ logs }}</label>
		</div>
		<button class="btn" @click="performUnlock">
			Deverouiller
		</button>
	</Overlay>
</template>
<script>
import Overlay from "../dialog_overlay";
export default {
	props: ["compte"],
	components: { Overlay },
	data() {
		return {
			quittance: 0,
			numero: "",
			logs: "",
		};
	},
	methods: {
		performUnlock() {
			if(this.user_is_readonly){
				this.$store.state.alert = {
				type:"danger",
				message:"Vous êtes en lecture seule"
			}
				return
			}
			let url = `/compte/${this.compte.id}/deverouiller/${this.quittance}/${this.numero}/`
			axios.get(this.url + url,this.headers)
			.then((response) => {
				this.$emit("close");
				this.compte.unlock_type = response.data.unlock_type
				this.compte.numero = response.data.numero
				this.compte.balance = response.data.balance
			})
			.catch((error) => {
				this.displayErrorOrRefreshToken(error, this.performUnlock);
			});
		},
	},
};
</script>
<style scoped>
.field-2 {
	padding: 0 30px;
	margin-bottom: 8px;
}
.field-2 p {
	display: flex;
	height: 28px;
	align-items: center;
}

.field-2 input[type="radio"] {
	padding: 0;
	border: none;
	margin-left: 10px;
}
.field-2 input[type="number"] {
	display: block;
	margin-bottom: 15px;
  margin-top: 3px;
  width: 100%;
}

.field-2 p label {
	margin-left: 20px;
  text-transform: capitalize;
}
.field-2 input {
	height: 28px;
	border: none;
	outline: none;
	padding: 0 10px;
	border: 1px solid #55555555;
}
textarea {
	width: 100%;
	height: 80px;
	resize: none;
}
</style>
