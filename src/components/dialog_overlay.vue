<template>
  <div class="parent" @click.stop>
    <div class="content">
      <div class="close nonprintable" @click="close">&times;</div>
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  methods:{
    close(){
      this.$emit("close");
    }
  }
};
</script>
<style scoped>
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
  position: relative;
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
@media print{
  .content{
    margin: 0 0!important;
    max-width: 100%!important;
  }
  .parent{
    position: absolute;
    background-color: white;
    height: 100vh;
  }
}
</style>
