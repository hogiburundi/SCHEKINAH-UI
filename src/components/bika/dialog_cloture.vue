<template>
<div class="parent" @click.stop :class="{'hidden':!active}">
  <div class="content">
    <div class="close" @click="close">&times;</div>
    <div class="table">
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Depôts</th>
            <th>Parts</th>
            <th>Benefices</th>
            <th>Resultat</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in membres">
            <td>{{ item.compte.first_name }} {{ item.compte.last_name }}</td>
            <td>{{ money(item.depots) }}</td>
            <td>{{ item.depots/ikirimba.montant_minimale }}</td>
            <td>{{ money(deduction(item) - item.depots) }}</td>
            <td class="right">{{ money(deduction(item)) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th>Total</th>
            <th>{{money(ikirimba.total_depots)}}</th>
            <th>{{ikirimba.total_depots/ikirimba.montant_minimale}}</th>
            <th v-if="!!ikirimba.compte">
              {{money(ikirimba.compte.balance - ikirimba.total_depots)}}
            </th>
            <th v-else>0</th>
            <th v-if="!!ikirimba.compte" class="right">
              {{money(ikirimba.compte.balance)}}
            </th>
            <th v-else class="right">0</th>
          </tr>
          <tr>
            <th colspan="2"></th>
            <th colspan="2" class="right">
              prix virement
            </th>
            <th class="right">-{{ money(prix_virement) }}</th>
          </tr>
        </tfoot>
      </table>
      <button class="btn-sm bg-success" @click="cloturer">Cloturer</button>
    </div>
  </div>
</div>
</template>
<script>
import Overlay from "../dialog_overlay"
export default {
  props:["membres", "active", "tontine"],
  components:{Overlay},
  data(){
    return {
      depots:[], ikirimba:{}, prix_virement:0
    }
  },
  watch:{
    tontine(new_val){
      this.ikirimba = !!new_val?new_val:{}
    }
  },
  methods:{
    close(){
      this.$emit("close")
    },
    deduction(member){
      if(!this.ikirimba.compte) return 0
      let balance = this.ikirimba.compte.balance - this.prix_virement
      return member.depots*balance/this.ikirimba.total_depots
    },
    cloturer(){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
      if(!this.ikirimba.date_fin){
        let data = {
          date_fin : new Date().toISOString()
        }
        axios.patch(this.url+`/ikirimba/${this.ikirimba.id}/`, data,this.headers)
        .then((response) => {
          this.ikirimba.date_fin = data.date_fin
          this.performVirement()
        }).catch((error) => {
          console.error(error);
        })
      } else {
        this.performVirement()
      }
    },
    performVirement(){
      if(this.user_is_readonly){
        this.$store.state.alert = {
          type:"danger",
          message:"Vous êtes en lecture seule"
        }
        return
      }
      let to_accounts = []
      for(let membre of this.membres){
        to_accounts.push(
          {"account":membre.compte.account_number, "amount":this.deduction(membre)}
        )
      }
      console.log(this.ikirimba)
      let data = {
        "amount": this.ikirimba.montant_total,
        "details": "dividendes ikirimba",
        "from_account": this.ikirimba.compte.id,
        "to_accounts": to_accounts
      }
      axios.post(this.url+`/virement/`, data, this.headers)
      .then((response) => {
        this.ikirimba.montant_total = 0
        this.close()
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.performVirement)
      })
    },
    fetchVirement(){
      axios.get(this.url+`/prix/?code=PV`, this.headers)
      .then((response) => {
        if(response.data.results.length == 1){
          this.prix_virement = response.data.results[0].prix
        }
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, fetchVirement)
      })
    }
  },
  mounted(){
    this.fetchVirement()
  }
};
</script>
<style scoped>
th{
  padding: 5px;
}
td{
  padding: 0 5px;
}
.parent{
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .8);
  width: 100%;
  height: 100%;
  overflow-y: auto;
  z-index: 5;
}
.content{
  background-color: white;
  max-width: 500px;
  margin: 4% auto;
  padding-bottom: 10px;
  box-sizing: border-box;
}
button.btn-sm{
  display: block;
  margin-left: auto;
}
.close{
  background-color: red;
  width: 30px;
  height: 30px;
  margin-left: auto;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: var(--white);
  cursor: pointer;
}
.right{
  text-align: right;
}
@media screen and (max-width: 800px) {
  .content {
    margin: 10% auto;
  }
}
</style>
