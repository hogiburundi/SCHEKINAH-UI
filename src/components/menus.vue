<template>
  <div class="wrapper nonprintable">
    <div class="content">
      <span class="open" @click="openNav">&#9776;</span>
      <div class="menu">
        <div class="close" @click="closeNav">&times;</div>
        <div class="content-item">
          <router-link to="/" v-slot="{ href, navigate, isActive, isExactActive }">
            <div class="menu-item" @click="closeNav">
              <a :href="href" :class="{ 'selected': isExactActive }" @click="navigate">HOME</a>
            </div>
          </router-link>
        </div>
        <div class="content-item">
          <div class="menu-item parent-menu" @click="closeNav">
            <a>MENU</a>
            <div class="submenu">
              <div v-if="active_user.is_admin || user_is_readonly">
                <router-link to="/agence" v-slot="{ href, navigate, isActive, isExactActive }">
                  <div class="submenu-item" @click="closeNav">
                    <a :href="href" :class="{ 'selected': isActive }" @click="navigate">Agences</a>
                  </div>
                </router-link>
              </div>
              <div>
                <router-link to="/guichet" v-slot="{ href, navigate, isActive, isExactActive }">
                  <div class="submenu-item" @click="closeNav">
                    <a :href="href" :class="{ 'selected': isActive }" @click="navigate">Guichet</a>
                  </div>
                </router-link>
              </div>
              <div>
                <router-link to="/credit"
                  v-slot="{ href, navigate, isActive, isExactActive }"
                  v-if="active_user_is_responsable || user_is_readonly">
                  <div class="submenu-item" @click="closeNav">
                    <a :href="href" :class="{ 'selected': isActive }" @click="navigate">Credit</a>
                  </div>
                </router-link>
              </div>
              <div>
                <router-link to="/placement" v-slot="{ href, navigate, isActive, isExactActive }">
                  <div class="submenu-item" @click="closeNav">
                    <a :href="href" :class="{ 'selected': isActive }" @click="navigate">Placement</a>
                  </div>
                </router-link>
              </div>
              <div v-if="active_user.is_admin || user_is_readonly">
                <router-link to="/hist-user" v-slot="{ href, navigate, isActive, isExactActive }">
                  <div class="submenu-item" @click="closeNav">
                    <a :href="href" :class="{ 'selected': isActive }" @click="navigate">
                      Historique
                    </a>
                  </div>
                </router-link>
              </div>
              <div v-if="active_user_is_responsable || user_is_readonly">
                <router-link to="/utilisateur" v-slot="{ href, navigate, isActive, isExactActive }">
                  <div class="submenu-item" @click="closeNav">
                    <a :href="href" :class="{ selected: isActive }" @click="navigate">Utilisateurs</a>
                  </div>
                </router-link>
              </div>
              <div v-if="active_user_is_responsable || user_is_readonly">
                <router-link to="/cheque" v-slot="{ href, navigate, isActive, isExactActive }">
                  <div class="submenu-item" @click="closeNav">
                    <a :href="href" :class="{ selected: isActive }" @click="navigate">Cheques</a>
                  </div>
                </router-link>
              </div>
              <div v-if="active_user_is_responsable || user_is_readonly">
                <router-link to="/quittances" v-slot="{ href, navigate, isActive, isExactActive }">
                  <div class="submenu-item" @click="closeNav">
                    <a :href="href" :class="{ selected: isActive }" @click="navigate">Quittances</a>
                  </div>
                </router-link>
              </div>
              <div>
                <router-link to="/mefi-info" v-slot="{ href, navigate, isActive, isExactActive }">
                  <div class="submenu-item" @click="closeNav">
                    <a :href="href" :class="{ selected: isActive }" @click="navigate">Mefi-Info</a>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="content-item" v-if="active_user.is_admin || user_is_readonly">
          <router-link to="/produits" v-slot="{ href, navigate, isActive, isExactActive }">
            <div class="menu-item" @click="closeNav">
              <a :href="href" :class="{ 'selected': isActive }" @click="navigate">
                PRODUITS
              </a>
            </div>
          </router-link>
        </div>
        <div class="content-item" v-if="active_user.is_admin || user_is_readonly">
          <router-link to="/charges" v-slot="{ href, navigate, isActive, isExactActive }">
            <div class="menu-item" @click="closeNav">
              <a :href="href" :class="{ 'selected': isActive }" @click="navigate">
                CHARGES
              </a>
            </div>
          </router-link>
        </div>
        <div class="content-item">
          <router-link to="/rapports" v-slot="{ href, navigate, isActive, isExactActive }">
            <div class="menu-item" @click="closeNav">
              <a :href="href" :class="{ 'selected': isActive }" @click="navigate">
                RAPPORTS
              </a>
            </div>
          </router-link>
        </div>
<!--         <div class="content-item">
          <router-link to="/reporting" v-slot="{ href, navigate, isActive, isExactActive }">
            <div class="menu-item" @click="closeNav">
              <a :href="href" :class="{ 'selected': isActive }" @click="navigate">
                REPORTING
              </a>
            </div>
          </router-link>
        </div> -->
        <div class="content-item">
          <router-link to="/parametres" v-slot="{ href, navigate, isActive, isExactActive }">
            <div class="menu-item" @click="closeNav">
              <a :href="href" :class="{ 'selected': isActive }" @click="navigate">
                PARAMETRES
              </a>
            </div>
          </router-link>
        </div>
<!--         <div class="content-item">
          <router-link to="/bika" v-slot="{ href, navigate, isActive, isExactActive }">
            <div class="menu-item" @click="closeNav">
              <a :href="href" class="green" 
                :class="{ 'selected': isActive }"
                @click="navigate">
                BIKA
              </a>
            </div>
          </router-link>
        </div> -->
      </div>
      <div class="user-infos" @click="show_context=true" @mouseleave="show_context=false">
        <div class="username">
          {{ active_user.first_name+" "+active_user.last_name }}
          <h6>{{ active_user.groups.join(", ") }}</h6>
        </div>
        <div class="context" v-if="show_context">
          <div @click="logout" class="item">
            <fa icon="sign-out-alt"/> Deconnexion
          </div>
          <div class="item" @click="password_shown=true">
            <fa icon="pen"/> Mot de Passe
          </div>
        </div>
      </div>
    </div>
    <DialogPassword  @close="close" :class="{'hidden':!password_shown}"/>
  </div>
</template>
<script>
import DialogPassword from "./dialog_password"

export default {
  components:{
    DialogPassword
  },
  data(){
    return {
      show_context:false, password_shown:false
    }
  },
  methods:{
    logout(){
      this.$store.state.user = null;
    },
    openNav() {
      var nav = document.querySelector('.menu');

      nav.classList.add('menu-active');
    },
    closeNav(){
      var nav = document.querySelector('.menu');
      nav.classList.remove('menu-active');
    },
    close(){
      this.password_shown = false
    }
  }
};
</script>
<style scoped>
.wrapper {
  background: var(--primary);
  height: 70px;
  position: relative;
  width: 100%;
}
.content {
  display: flex;
  padding: 20px 50px 0;
}
.context{
  position: absolute;
  background-color: white;
  color: black;
  margin-left: auto;
  box-shadow: 0 2px 5px 3px var(--primary);
  cursor: pointer;
}
.content .item{
  padding: 5px;
}
.content .item:hover{
  background-color: var(--secondary);
  color: white;
}
.open {
  cursor: pointer;
  font-size: 26px;
  display: none;
  color: white;
}
.close {
  margin-left: auto;
  margin-right: 20px;
  font-size: 28px;
  font-weight: 600;
  color: white;
  display: none;
  cursor: pointer;
}
.content-item {
  display: inline-block;
}

.menu-item a {
  display: block;
  position: relative;
  padding: 3px 10px 8px;
  text-decoration: none;
  font-size: 18px;
  color: white;
  transition: .5s;
  font-weight: 500;
}
.menu-item a.selected::after, .menu-item a:hover::after {
  position: absolute;
  content: '';
  bottom: 0;
  left: 0;
  height: 2px;
  width: 50%;
  background: white;
  transform: translateX(50%);
}
.submenu-item a.selected::after, .submenu-item a:hover::after {
  width: 100%;
  transform: translateX(0%);
}
.submenu-item a.selected, .submenu-item a:hover {
  background-color: var(--primary-hover);
}
.parent-menu{
  position: relative;
  z-index: 1;
}
.submenu{
  position: absolute;
  background-color: var(--primary);
  box-shadow: 3px 3px 5px black;
  width: 200px;
  display: none;
  border: 1px solid var(--primary-hover);
}
.parent-menu:hover .submenu{
  display: block;
}
.user-infos {
  margin-left: auto;
  height: 100%;
  align-items: center;
  color: white;
}
.username {
  font-weight: 500;
  margin-right: 20px;
  font-size: 18px;
  cursor: pointer;
}
.user-infos button {
  border: none;
  outline: none;
  font-size: 22px;
  cursor: pointer;
  background: transparent;
}
.menu-item .green{
  color: #8CF;
  font-weight: 700;
}
@media screen and (max-width: 900px) {
  .content{
    padding-right: 0;
    padding-left: 0;
  }
}
@media screen and (max-width: 800px) {
  .open {
    display: block;
  }
  .close {
    display: block;
    width: 22px;
  }
  .content-item {
    display: block;
    padding: 12px 0;
  }
  .menu {
    position: absolute;
    left: 0;
    top: 0;
    background: var(--primary);
    width: 450px;
    height: 100vh;
    padding-left: 20px;
    transform: translateX(-100%);
    transition: transform .5s ease-in;
    white-space: nowrap;
  }
  .menu-active {
    transform: translateX(0%);
  }
  .menu-item a {
    position: unset;
    color: #ccc;
  }
  .menu-item a.selected, .menu-item a:hover {
    color: #fff;
  }
  .menu-item a.selected {
    font-size: 18px;
    font-weight: 800;
  }
  .menu-item a::after {
    display: none;
  }
}

@media screen and (max-width: 600px) {
  .content {
    padding: 20px 30px 0;
  }
  .username {
    display: none;
  }
  .menu {
    width: 300px;
  }
}
</style>
