<template>
<div class="field">
  <label for="keyword">Rechercher:</label>
  <div class="input">
    <input type="text" autocomplete="off" id="keyword" v-model="keyword"
      placeholder="CNI ou No. de compte" @change="search">
    <button @click="search"><fa icon="search"/></button>
    <div class="result">
      {{ result }}
      <div v-if="results.length > 1">
        <div v-for="dest in results.slice(0, 4)" class="found">
          <input type="radio"
            v-model="compte" :value="dest"
            :id="dest.account_number">
          <label :for="dest.account_number">
            {{ dest.account_number }} {{ dest.first_name }}
          </label>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  data(){
    return {
      result:"",
      results:[],
      keyword:"",
      compte:null,
    }
  },
  watch:{
    keyword(new_val){
      let founds = this.$store.state.comptes.filter(x =>{
        return JSON.stringify(x).includes(new_val) && x.id != this.compte.id
      })
      this.result = `found: ${founds.length} results`;
      if(founds.length == 1) {
        this.compte = founds[0]
      }
    },
    compte(new_val){
      this.result = `${new_val.first_name} ${new_val.last_name}`
      this.$emit("found", new_val)
    }
  },
  methods:{
    search(){
      this.result = "recherche..."
      this.compte = null
      axios.get(this.$store.state.url+`/compte/?search=${this.keyword}`, this.headers)
      .then((response) => {
        if(response.data.results.length == 1) {
          this.compte = response.data.results[0]
        } else {
          this.results = response.data.results
        }
        this.result = ""
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.search)
      })
    },
  }
};
</script>
<style scoped>
.found{
  white-space: nowrap;
  padding: 0 0 0 5px;
  display: flex;
  align-items: center;
}
.found *{
  width: inherit;
}
.found label{
  margin: 0;
  margin-left: 5px;
  font-weight: bold;
}
.found:hover{
  background-color: var(--secondary);
}
</style>
