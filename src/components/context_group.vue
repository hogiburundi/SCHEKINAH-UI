<template>
<div id="context" @click.stop>
  <div class="field-2" v-for="group in groups">
    <input type="radio" :id="group.name" :value="group.id"
      v-model="role" :checked="group.id == group">
    <label for="somme" :for="group.name">{{ group.name }}</label>
  </div>
  <div class="field">
    <label class="logs">{{ logs }}</label>
  </div>
  <button class="btn" @click=changeGroup>Soumettre</button>
</div>
</template>
<script>
import Overlay from "./dialog_overlay"
export default {
  props:["x", "y", "item"],
  components:{Overlay},
  data(){
    return {
      logs:"", personnel:{"user":{}}, role:""
    }
  },
  computed:{
    groups(){
      return this.$store.state.groups;
    },
    group(personnel){
      !!this.personnel.user? this.personnel.user.groups[0]:-1;
    }
  },
  watch:{
    x(new_val){
      context.style.top = this.y-150+"px";
      context.style.left = new_val-100+"px";
    },
    item(new_val){
      if(!!new_val){
        this.personnel = new_val
      } else {
        this.personnel = {"user":{}}
      }
    },
  },
  methods:{
    changeGroup(){
      axios.get(this.url+`/user/${this.personnel.user.id}/changegroup/${this.role}/`, this.headers)
      .then((response) => {
        this.personnel.user.groups = [this.role]
        this.$emit("close")
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.changeGroup)
      });
    }
  }
};
</script>
<style scoped>
#context{
  width: 200px;
  border: 1px solid gray;
  box-shadow: 2px 2px 3px gray;
  position: fixed;
  background-color: white;
  padding: 10px 25px;
}
.field-2 {
  display: flex;
  height: 28px;
  align-items: center;
}
label {
  margin-left: 20px;
  text-transform: capitalize;
}
textarea {
  width: 100%;
  height: 80px;
  resize: none;
}

.btn {
  padding: 5px 18px;
  margin: 10px auto 0;
}
</style>
