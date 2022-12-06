import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Guichet from '../views/Guichet'
import Credit from '../views/Credit'
import Placement from '../views/Placement'
import Utilisateur from '../views/Utilisateur'
import Amortissement from '../views/Amortissement'
import HistCompte from '../views/HistCompte'
import HistGuichetier from '../views/HistGuichetier'
import AmortissementPlac from '../views/AmortissementPlac'
import Profile from '../views/Profile'
import Cheque from '../views/Cheque'
import Agence from '../views/Agence'
import AgenceRemiseReprise from '../views/AgenceRemiseReprise'
import Charges from '../views/Charges'
import Parametres from '../views/Parametres'
import Rapports from '../views/Rapports'
import Produits from '../views/Produits'
import ReportingView from '../views/ReportingView'
import Bika from '../views/Bika'
import BikaMembers from '../views/BikaMembers'
import BikaHistory from '../views/BikaHistory'
import Quittances from '../views/Quittances'
import QuittancePrint from '../views/QuittancePrint2'
import MefiInfo from '../views/MefiInfo'

Vue.use(VueRouter)

const routes = [
  { path: "/", name:"home", component:Home},
  { path: "/guichet", name:"guichet", component:Guichet},
  { path: "/credit", name:"credit", component:Credit},
  { path: "/cheque", name:"cheque", component:Cheque},
  { path: "/quittances", name:"quittances", component:Quittances},
  { path: "/agence", name:"agence", component:Agence},
  { path: "/agence-remise-reprise/:id", name:"agence-mva", component:AgenceRemiseReprise},
  { path: "/placement", name:"placement", component:Placement},
  { path: "/utilisateur", name:"utilisateur", component:Utilisateur},
  { path: "/history-compte/", name:"listhistory", component:HistCompte},
  { path: "/history-compte/:id", name:"history", component:HistCompte},
  { path: "/hist-user/", name:"histguichet", component:HistGuichetier},
  { path: "/hist-user/:id", name:"listhistguichet", component:HistGuichetier},
  { path: "/amortissement/:id", name:"amortissement", component:Amortissement},
  { path: "/amortissement-p/:id", name:"amortissement_p", component:AmortissementPlac},
  { path: "/profile/:id", name:"profile", component:Profile},
  { path: "/charges", name:"charges", component:Charges},
  { path: "/parametres", name:"parametres", component:Parametres},
  { path: "/rapports", name:"rapports", component:Rapports},
  { path: "/reporting", name:"reporting", component:ReportingView},
  { path: "/produits", name:"produits", component:Produits},
  { path: "/bika", name:"bika", component:Bika},
  { path: "/bika-members/:id", name:"bikamembers", component:BikaMembers},
  { path: "/bika-history/:id", name:"bikahistory", component:BikaHistory},
  { path: "/quittances-print/:range", name:"quittances_design", component:QuittancePrint},
  { path: "/mefi-info", name:"mefi-info", component:MefiInfo},
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
