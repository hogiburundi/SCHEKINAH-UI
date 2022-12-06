<template>
<div class="parent" @click.stop :class="{'hidden':!active}">
  <div class="content">
    <div class="close" @click="close">&times;</div>
    <div class="table">
      <table>
        <thead>
          <tr>
            <th>date</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="depot in depots">
            <td>{{ datetime(depot.date) }}</td>
            <td>{{ money(depot.montant) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>
<script>
import Overlay from "../dialog_overlay"
export default {
  props:["membre", "active", "ikirimba"],
  components:{Overlay},
  data(){
    return {
      depots:[],
    }
  },
  watch:{
    active(new_val){
      console.log(this.membre)
      if(new_val && !!this.membre){
        this.fetchData()
      } else {
        this.depots = []
      }
    }
  },
  methods:{
    close(){
      this.$emit("close")
    },
    fetchData(){
      let params = `?membre=${this.membre.id}&membre__ikirimba=${this.ikirimba.id}`
      axios.get(this.url+`/depot-kirimba/${params}`, this.headers)
      .then((response) => {
        this.depots = response.data.results
      })
    }
  },
  mounted(){
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
  max-width: 400px;
  margin: 4% auto;
  padding-bottom: 10px;
  box-sizing: border-box;
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

@media screen and (max-width: 800px) {
  .content {
    margin: 10% auto;
  }
}
</style>
