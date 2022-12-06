<template>
  <Overlay @close="$emit('close')">
    <PrintableHeader/>
    <div class="table">
      <h1 class="printable">
        Portefeuille des credits
      </h1>
      <table>
        <tbody>
          <tr>
            <td>Credits en cours totals</td>
            <td>:</td>
            <td>{{ money(overview.credit_en_cours) }}</td>
          </tr>
          <tr>
            <td>Montant remboursé total</td>
            <td>:</td>
            <td>{{ money(overview.credit_rembourse) }}</td>
          </tr>
          <tr>
            <td>Interets remboursé</td>
            <td>:</td>
            <td>{{ money(overview.interet_rembourse) }}</td>
          </tr>
          <tr>
            <td>Interets escomptés</td>
            <td>:</td>
            <td>{{ money(overview.interet_escompte) }}</td>
          </tr>
          <tr>
            <td>Montant moyen de credit</td>
            <td>:</td>
            <td>{{ money(overview.credit_moyen) }}</td>
          </tr>
          <tr>
            <td>Montant en circulation</td>
            <td>:</td>
            <td>{{ money(overview.circulation) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  </Overlay>
</template>
<script>
import Overlay from "../dialog_overlay"
import PrintableHeader from "../printable_header"
export default {
  components:{ Overlay, PrintableHeader},
  data(){
    return {
      overview:this.$store.state.credits_overview
    }
  },
  watch:{
    "$store.state.credits_overview"(new_val){
      this.overview = new_val
    }
  },
  methods:{
    fetchData(){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
      axios.get(this.url+`/credit/overview/`, this.headers)
      .then((response) => {
        this.$store.state.credits_overview = response.data
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchData)
      })
    }
  },
  mounted(){
    this.overview = this.$store.state.credits_overview
    if(this.overview.circulation == undefined){
      this.fetchData()
    }
  }
};
</script>
<style scoped>
table{
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  max-width: 500px;
}
h1{
  text-align: center;
  margin-bottom: 20px;
}
</style>
