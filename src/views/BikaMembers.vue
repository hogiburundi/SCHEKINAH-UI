<template>
  <div class="container">
    <PrintableHeader/>
    <div class="row">
      <div>
        <button class="btn-sm bg-success" @click="create_shown=true">
          Nouveau membre
        </button>
        <button class="btn-sm bg-secondary" @click="deposer">
          Nouveau dépot
        </button>
      </div>
      <button class="btn-sm bg-danger" @click.stop="cloture_shown=true">
        cloturer
      </button>
    </div>
    <div class="table">
      <table>
        <thead>
          <tr>
            <th>nom</th>
            <th>montant</th>
            <th>date</th>
            <th>options</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in membres">
            <td>{{ record.compte.first_name }} {{ record.compte.last_name }}</td>
            <td>{{ money(record.depots) }}</td>
            <td>{{ datetime(record.date) }}</td>
            <td>
              <button class="btn-sm bg-primary" @click="listDepots(record)">
                <fa icon="list-alt"/>
                depots
              </button>
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <th>total</th>
            <th>{{ 
              money(membres.reduce((acc, x) => acc+parseInt(x.depots),0))
            }}</th>
            <th></th>
            <th></th>
          </tr>
        </tbody>
      </table>
    </div>
    <DialogMember
      :class="{'hidden':!create_shown}"
      :item="ikirimba"
      @close="close"
      @added="added"/>
    <DialogDepot
      :class="{'hidden':!deposer_shown}"
      :tontine="ikirimba"
      :membres="membres"
      @done="depotDone"
      @close="close"/>
    <DialogDepotsList
      :active="depots_list_shown"
      :ikirimba="ikirimba"
      :membre="active_member"
      @close="close"/>
    <DialogCloture
      :active="cloture_shown"
      :tontine="ikirimba"
      :membres="membres"
      @close="close"/>
  </div>
</template>
<script>
import DialogMember from "../components/bika/dialog_member"
import DialogDepot from "../components/bika/dialog_depot"
import DialogDepotsList from "../components/bika/dialog_depots_list"
import DialogCloture from "../components/bika/dialog_cloture"
import PrintableHeader from "../components/printable_header"

export default {
  components:{
    DialogMember,
    DialogDepot,
    DialogDepotsList,
    DialogCloture,
    PrintableHeader
  },
  data(){
    return {
      ikirimba:null,
      membres:[],
      du:null, au:null, next:null,
      create_shown:false,
      depots_list_shown:false,
      active_member:false,
      deposer_shown:false,
      cloture_shown:false
    }
  },
  watch:{
    "$store.state.membres"(new_val){
      this.membres = new_val
    },
  },
  methods:{
    close(){
      this.create_shown = false
      this.deposer_shown = false
      this.depots_list_shown = false
      this.cloture_shown = false
      this.active_member = null
    },
    added(member){
      this.membres.push(member)
      this.create_shown = false
    },
    deposer(){
      this.deposer_shown = true
    },
    depotDone(){
      this.close()
      this.$store.state.membres = []
      this.fetchData()
    },
    listDepots(member){
      this.active_member = member
      this.depots_list_shown = true
    },
    fetchData(){
      let link;
      if(!this.next){
        this.membres = []
        link = this.url+`/membre/?ikirimba=${this.ikirimba.id}`
      } else {
        link = this.next
      }
      axios.get(link, this.headers)
      .then((response) => {
        this.$store.state.membres.push(...response.data.results)
        if(response.data.next != null){
          this.next = response.data.next
          this.fetchData()
        } else {
          this.next = null
        }
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchData)
      })
    },
    fetchIkirimba(param){
      axios.get(this.url+`/ikirimba/${param}/` ,this.headers)
      .then((response) => {
        this.ikirimba = response.data
        if(this.$store.state.membres.length == 0){
          this.fetchData()
        } else {
          this.membres = this.$store.state.membres
        }
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, () => this.fetchIkirimba(param))
      })
    }
  },
  mounted(){
    let param = this.$route.params['id']
    this.ikirimba = this.$store.state.ibirimba.find(x => x.id == param)
    if(!this.ikirimba){
      this.fetchIkirimba(param)
    } else {
      this.$store.state.membres = []
      this.fetchData()
    }
  }
};
</script>
<style scoped>
.container {
    min-height: calc(100vh - 180px);
}
.btn-sm{
  margin-bottom: 0;
}
@media screen and (max-width:600px) {
  .container {
    padding: 0 20px;
  }
}
</style>
