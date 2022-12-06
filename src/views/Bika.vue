<template>
  <div class="container">
    <div class="row">
      <div @click="create_shown=true" class="add">
        Nouvelle tontine
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
            <th>No.</th>
            <th>Nom</th>
            <th>Minimal</th>
            <th>depots</th>
            <th>Montant</th>
            <th>date</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ikirimba in ibirimba" @click="openProfile(ikirimba.id)">
            <td>{{ ikirimba.id }}</td>
            <td>{{ ikirimba.nom }}</td>
            <td>{{ money(ikirimba.montant_minimale) }}</td>
            <td>{{ money(ikirimba.total_depots) }}</td>
            <td>{{ money(ikirimba.compte.balance) }}</td>
            <td>{{ datetime(ikirimba.date_debut) }}</td>
            <td>
              <router-link :to="'/bika-members/'+ikirimba.id" v-slot="{ navigate }">
                <button class="btn-sm bg-secondary" @click.stop="navigate">
                  <fa icon="users"/>
                </button>
              </router-link>
              <router-link :to="'/bika-history/'+ikirimba.id" v-slot="{ navigate }">
                <button class="btn-sm bg-secondary" @click.stop="navigate">
                  <fa icon="list-alt"/>
                </button>
              </router-link>
              <span v-if="active_user_is_responsable">
                <button class="btn-sm bg-primary">
                  <fa icon="pen"/>
                </button>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <a href="#" style="color: lightgray;" @click="loadMore" v-if="!!next">
        gukwega ibindi...
      </a>
    </div>
    <DialogCreate @close="close" :item="active_compte"
      :class="{'hidden':!create_shown}"/>
  </div>
</template>
<script>
import DialogCreate from "../components/bika/dialog_create"

export default {
  props: {},
  components:{
    DialogCreate,
  },
  data(){
    return {
      ibirimba: this.$store.state.ibirimba, create_shown:false, active_compte:null,
      next:null, keyword:null
    }
  },
  watch:{
    "$store.state.ibirimba"(new_val){
      this.ibirimba = new_val;
    },
    keyword(new_val){
      this.ibirimba = this.$store.state.ibirimba.filter( x => {
         return  JSON.stringify(x).toLowerCase().includes(new_val.toLowerCase())
      })
    },
  },
  methods:{
    close(){
      this.active_compte = null
      this.create_shown = false
    },
    rechercher(){
      axios.get(this.url+`/ikirimba/?search=${this.keyword}`, this.headers)
      .then((response) => {
        this.$store.state.ibirimba = response.data.results
        this.next = response.data.next
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.rechercher)
      })
    },
    fetchComptes(){
      axios.get(this.url+"/ikirimba/", this.headers)
      .then((response) => {
        this.$store.state.ibirimba = response.data.results
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchComptes)
      })
    },
    openProfile(compte_id){
      // this.$router.push(`/profile/${compte_id}`)
    },
  },
  mounted(){
    if(this.$store.state.ibirimba.length == 0){
      this.fetchComptes()
    }
  }
};
</script>
<style scoped>
div.add{
  width: 150px;
  text-align: center;
  cursor: default;
}
</style>
