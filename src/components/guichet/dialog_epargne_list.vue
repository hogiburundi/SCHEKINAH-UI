<template>
<div class="parent" @click.stop :class="{'hidden':!active}">
  <div class="content">
    <div class="close" @click="close">&times;</div>
    <div class="table">
      <table>
        <thead>
          <tr>
            <th>Mois</th>
            <th>Montant</th>
            <th>cumul</th>
            <th>benefices</th>
            <th>total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="date in dates">
            <td>{{ date }}</td>
            <td>{{ money(grouped_depots[date].amount) }}</td>
            <td>{{ money(grouped_depots[date].cumul) }}</td>
            <td>{{ money(grouped_depots[date].benefice) }}</td>
            <td>{{ money(grouped_depots[date].total) }}</td>
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
  props:["compte", "active"],
  components:{Overlay},
  data(){
    return {
      depots:[], grouped_depots:{}, dates:[]
    }
  },
  watch:{
    active(new_val){
      if(new_val) this.fetchData()
    },
    depots(new_val){
      if(!new_val || new_val.length == 0) return
      let str_date = ""
      let dates = []
      let depot, old_cumul = 0, total = 0
      for(var i=new_val.length-1; i>=0; i--){
        depot = new_val[i] 
        str_date = this.monthYear(depot.date)
        total += depot.amount
        if(!this.grouped_depots[str_date]){
          dates.push(str_date)
          this.grouped_depots[str_date] = {
            date:str_date,
            amount:depot.amount,
            benefice:old_cumul*0.02,
            cumul:total,
            total:total + old_cumul*0.02
          }
        } else {
          this.grouped_depots[str_date].date += str_date,
          this.grouped_depots[str_date].amount += depot.amount,
          this.grouped_depots[str_date].benefice += old_cumul*0.02,
          this.grouped_depots[str_date].cumul += total,
          this.grouped_depots[str_date].total += total + old_cumul*0.02
        }
        old_cumul = total
      }
      this.dates = dates
      this.fillEmptyDates()
    }
  },
  methods:{
    monthYear(isotime){
        let date = new Date(isotime)
        return `${date.getMonth()+1}-${date.getFullYear()}`.padStart(7, "0")
    },
    fillEmptyDates(){
      let dates = []
      let base_date = new Date(this.compte.epargne_start_date)
      let first_month = base_date.getMonth()+1
      let first_year = base_date.getFullYear()

      let final_date = new Date(this.compte.epargne_end_date)
      let last_month = final_date.getMonth()+1
      let last_year = final_date.getFullYear()

      if(base_date.getDate() > 15){
        first_month += 1
      }

      let months = last_month - first_month + (last_year - first_year) * 12 + (last_year - first_year)
      let count_base
      for(var i=first_month; i<first_month+months; i++){
        count_base = i % 13
        dates.push(`${count_base}-${first_year}`.padStart(7, "0"))
        if(count_base == 12){
          i += 1
          first_year += 1
        }
      }
      let temp_depot = null
      let depot
      for(let date of dates){
        if(!this.grouped_depots[date]){
          if(!!temp_depot){
            this.grouped_depots[date] = {
              date: date,
              amount: 0,
              benefice: temp_depot.cumul*0.02,
              cumul: temp_depot.cumul,
              total: temp_depot.total + temp_depot.cumul*0.02
            }
          } else {
            this.grouped_depots[date] = {
              date:date,
              amount:0,
              benefice:0,
              cumul:0,
              total:0
            }
          }
          temp_depot = this.grouped_depots[date]
        } else {
          depot = this.grouped_depots[date]
          if(!!temp_depot){
            depot.benefice = temp_depot.cumul*0.02
            depot.cumul = temp_depot.cumul + depot.amount
            depot.total = temp_depot.cumul + depot.amount + temp_depot.cumul*0.02
          }
          temp_depot = depot
        }
      }
      this.dates = dates
    },
    fetchData(){
      let link;
      let args = `?account=${this.compte.id}`+
        `&date__gte=${this.compte.epargne_start_date}`+
        `&date__lte=${this.compte.epargne_end_date}`
      if(!this.next){
        this.depots = []
        link = this.url+`/depot/`+args
      } else {
        link = this.next
      }
      axios.get(link, this.headers)
      .then((response) => {
        this.depots.push(...response.data.results)
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
    close(){
      this.depots = []
      this.grouped_depots = {}
      this.dates = []
      this.amount = 0
      this.benefice = 0
      this.total = 0
      this.$emit("close")
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
  max-width: 540px;
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
