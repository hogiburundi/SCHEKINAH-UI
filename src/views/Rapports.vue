<template>
  <div class="container">
    <PrintableHeader/>
    <div class="row nonprintable">
      <div class="left">
        <div class="field">
          <label for="du">Année: </label>
          <select v-model="year">
            <option v-for="year in years" :value="year">{{ year }}</option>
          </select>
        </div class="field">
        <button class="btn-sm bg-primary" @click="fetchComptes">Filtrer</button>
      </div>
      <div class="buttons">
        <button
          class="btn-sm bg-primary"
          @click="imprimer">
          Imprimer
        </button>
      </div>
    </div>
    <div class="table">
      <table>
        <thead>
          <tr>
            <th>Indicateur</th>
            <th>Janv</th>
            <th>Févr</th>
            <th>Mars</th>
            <th>Avr</th>
            <th>Mai</th>
            <th>Juin</th>
            <th>Juil</th>
            <th>Août</th>
            <th>Sept</th>
            <th>Oct</th>
            <th>Nov</th>
            <th>Dec</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="nb_membres">
            <td>
              <div><b>Nombre de membre</b></div>
              <div>Hommes</div>
              <div>Femmes</div>
              <div>Autres</div>
              <div>Total</div>
            </td>
            <td v-for="m in Object.keys(nb_membres)">
              <div>{{ nombre(nb_membres[m].hommes) }}</div>
              <div>{{ nombre(nb_membres[m].femmes) }}</div>
              <div>{{ nombre(nb_membres[m].autres) }}</div>
              <div>{{ nombre(nb_membres[m].autres+nb_membres[m].femmes+nb_membres[m].hommes) }}</div>
            </td>
          </tr>
          <tr v-if="nb_contribs">
            <td>
              <div><b>Nombre de membres ayant cotisé</b></div>
              <div>Hommes</div>
              <div>Femmes</div>
              <div>Autres</div>
              <div>Total</div>
            </td>
            <td v-for="m in Object.keys(nb_contribs)">
              <div>{{ nombre(nb_contribs[m].hommes) }}</div>
              <div>{{ nombre(nb_contribs[m].femmes) }}</div>
              <div>{{ nombre(nb_contribs[m].autres) }}</div>
              <div>{{nombre(nb_contribs[m].autres+nb_contribs[m].femmes+nb_contribs[m].hommes)}}</div>
            </td>
          </tr>
          <tr v-if="contribs">
            <td>
              <div><b>Montant des cotisations</b></div>
              <div>Hommes</div>
              <div>Femmes</div>
              <div>Autres</div>
              <div>Total</div>
            </td>
            <td v-for="m in Object.keys(contribs)">
              <div>{{ money(contribs[m].hommes) }}</div>
              <div>{{ money(contribs[m].femmes) }}</div>
              <div>{{ money(contribs[m].autres) }}</div>
              <div>{{money(contribs[m].autres+contribs[m].femmes+contribs[m].hommes)}}</div>
            </td>
          </tr>
          <tr v-if="nb_credits">
            <td>
              <div><b>Nombre des membres beneficiaires de crédits</b></div>
              <div>Hommes</div>
              <div>Femmes</div>
              <div>Autres</div>
              <div>Total</div>
            </td>
            <td v-for="m in Object.keys(nb_credits)">
              <div>{{ nombre(nb_credits[m].hommes) }}</div>
              <div>{{ nombre(nb_credits[m].femmes) }}</div>
              <div>{{ nombre(nb_credits[m].autres) }}</div>
              <div>{{nombre(nb_credits[m].autres+nb_credits[m].femmes+nb_credits[m].hommes)}}</div>
            </td>
          </tr>
          <tr v-if="credits">
            <td>
              <div><b>Montant des crédits octroyés</b></div>
              <div>Hommes</div>
              <div>Femmes</div>
              <div>Autres</div>
              <div>Total</div>
            </td>
            <td v-for="m in Object.keys(credits)">
              <div>{{ money(credits[m].hommes) }}</div>
              <div>{{ money(credits[m].femmes) }}</div>
              <div>{{ money(credits[m].autres) }}</div>
              <div>{{money(credits[m].autres+credits[m].femmes+credits[m].hommes)}}</div>
            </td>
          </tr>
          <tr v-if="nb_credits_sains">
            <td>
              <div><b>Nombre des crédits sains</b></div>
              <div>Hommes</div>
              <div>Femmes</div>
              <div>Autres</div>
              <div>Total</div>
            </td>
            <td v-for="m in Object.keys(nb_credits_sains)">
              <div>{{ nombre(nb_credits_sains[m].hommes) }}</div>
              <div>{{ nombre(nb_credits_sains[m].femmes) }}</div>
              <div>{{ nombre(nb_credits_sains[m].autres) }}</div>
              <div>{{nombre(nb_credits_sains[m].autres+nb_credits_sains[m].femmes+nb_credits_sains[m].hommes)}}</div>
            </td>
          </tr>
          <tr v-if="credits_sains">
            <td>
              <div><b>Montant des crédits sains</b></div>
              <div>Hommes</div>
              <div>Femmes</div>
              <div>Autres</div>
              <div>Total</div>
            </td>
            <td v-for="m in Object.keys(credits_sains)">
              <div>{{ money(credits_sains[m].hommes) }}</div>
              <div>{{ money(credits_sains[m].femmes) }}</div>
              <div>{{ money(credits_sains[m].autres) }}</div>
              <div>{{money(credits_sains[m].autres+credits_sains[m].femmes+credits_sains[m].hommes)}}</div>
            </td>
          </tr>
          <tr v-if="nb_credits_souffr">
            <td>
              <div><b>Nombre de crédits en souffrance </b></div>
              <div>Hommes</div>
              <div>Femmes</div>
              <div>Autres</div>
              <div>Total</div>
            </td>
            <td v-for="m in Object.keys(nb_credits_souffr)">
              <div>{{ nombre(nb_credits_souffr[m].hommes) }}</div>
              <div>{{ nombre(nb_credits_souffr[m].femmes) }}</div>
              <div>{{ nombre(nb_credits_souffr[m].autres) }}</div>
              <div>{{nombre(nb_credits_souffr[m].autres+nb_credits_souffr[m].femmes+nb_credits_souffr[m].hommes)}}</div>
            </td>
          </tr>
          <tr v-if="credits_souffr">
            <td>
              <div><b>Montant des crédits en souffrance</b></div>
              <div>Hommes</div>
              <div>Femmes</div>
              <div>Autres</div>
              <div>Total</div>
            </td>
            <td v-for="m in Object.keys(credits_souffr)">
              <div>{{ money(credits_souffr[m].hommes) }}</div>
              <div>{{ money(credits_souffr[m].femmes) }}</div>
              <div>{{ money(credits_souffr[m].autres) }}</div>
              <div>{{money(credits_souffr[m].autres+credits_souffr[m].femmes+credits_souffr[m].hommes)}}</div>
            </td>
          </tr>
          <tr v-if="taux_tarif">
            <td>
              <div><b>Tarification des opérations avec les membre</b></div>
              <div>Taux d'interet créditeur sur les cotisation</div>
              <div>Taux d'interet débiteur sur les crédits</div>
            </td>
            <td v-for="m in Object.keys(taux_tarif)">
              <div>{{ money(taux_tarif[m].credit) }}</div>
              <div>{{ money(taux_tarif[m].debit) }}</div>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
<script>
import PrintableHeader from "../components/printable_header"

export default {
  components:{ PrintableHeader },
  data(){
    return {
      year: new Date().getFullYear(),
      nb_membres: null,
      nb_contribs: null,
      contribs: null,
      nb_credits: null,
      credits: null,
      nb_credits_sains: null,
      credits_sains: null,
      nb_credits_souffr : null,
      credits_souffr: null,
      taux_tarif: null,
    }
  },
  computed:{
    years(){
      let list = []
      let year = new Date().getFullYear()
      for(var i=2021; i <= year; i++){
        list.push(i)
      }
      return list
    }
  },
  methods:{
    fetchComptes(){
      let date_params = `year=${this.year}`
      let link = this.url+`/rapports/comptes/?${date_params}`
      axios.get(link, this.headers)
      .then((response) => {
        this.nb_membres = response.data
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchComptes)
      }).finally(() => {
        this.fetchNbContribs()
      })
    },
    fetchNbContribs(){
      let date_params = `year=${this.year}`
      let link = this.url+`/rapports/nb_contribs/?${date_params}`
      axios.get(link, this.headers)
      .then((response) => {
        this.nb_contribs = response.data
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchNbContribs)
      }).finally(() => {
        this.fetchContribs()
      })
    },
    fetchContribs(){
      let date_params = `year=${this.year}`
      let link = this.url+`/rapports/contribs/?${date_params}`
      axios.get(link, this.headers)
      .then((response) => {
        this.contribs = response.data
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchContribs)
      }).finally(() => {
        this.fetchNbCredit()
      })
    },
    fetchNbCredit(){
      let date_params = `year=${this.year}`
      let link = this.url+`/rapports/nb_credit/?${date_params}`
      axios.get(link, this.headers)
      .then((response) => {
        this.nb_credits = response.data
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchNbCredit)
      }).finally(() => {
        this.fetchCredit()
      })
    },
    fetchCredit(){
      let date_params = `year=${this.year}`
      let link = this.url+`/rapports/credit/?${date_params}`
      axios.get(link, this.headers)
      .then((response) => {
        this.credits = response.data
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchCredit)
      }).finally(() => {
        this.fetchNbCreditSain()
      })
    },
    fetchNbCreditSain(){
      let date_params = `year=${this.year}`
      let link = this.url+`/rapports/nb_credit_sain/?${date_params}`
      axios.get(link, this.headers)
      .then((response) => {
        this.nb_credits_sains = response.data
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchNbCreditSain)
      }).finally(() => {
        this.fetchCreditSain()
      })
    },
    fetchCreditSain(){
      let date_params = `year=${this.year}`
      let link = this.url+`/rapports/credit_sain/?${date_params}`
      axios.get(link, this.headers)
      .then((response) => {
        this.credits_sains = response.data
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchCreditSain)
      }).finally(() => {
        this.fetchNbCreditSouffr()
      })
    },
    fetchNbCreditSouffr(){
      let date_params = `year=${this.year}`
      let link = this.url+`/rapports/nb_credit_souffr/?${date_params}`
      axios.get(link, this.headers)
      .then((response) => {
        this.nb_credits_souffr = response.data
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchNbCreditSouffr)
      }).finally(() => {
        this.fetchCreditSouffr()
      })
    },
    fetchCreditSouffr(){
      let date_params = `year=${this.year}`
      let link = this.url+`/rapports/credit_souffr/?${date_params}`
      axios.get(link, this.headers)
      .then((response) => {
        this.credits_souffr = response.data
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchCreditSouffr)
      }).finally(() => {
      })
    },
    imprimer(){
      print()
    }
  },
  mounted(){
    this.fetchComptes()
  }
};
</script>
<style scoped>
.table>table,th,td {
  border-collapse: collapse;
}
.container {
  min-height: calc(100vh - 180px);
}
.btn-sm{
  margin-bottom: 0;
}
.buttons{
  display: flex;
  align-items: flex-end;
  margin-bottom: 0;
}
.field label{
  color: #0F0;
  font-weight: 700;
}
.field{
  padding: 0 10px 0 0;
  margin-bottom: 0;
}
.left{
  display: flex;
  align-items: flex-end;
}
td{
  font-weight: inherit;
  vertical-align: bottom;
}
@media screen and (max-width:600px) {
  .container {
    padding: 0 20px;
  }
  .left{
    flex-direction: column;
  }
}
</style>
