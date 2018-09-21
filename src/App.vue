<template>
  <div class="main">

    <div class="menu">

      <router-link style="margin-right:20px;" :key="r.name" v-for="r in router" v-if="r.name" :to="r.path">{{r.name}}</router-link>
    </div>
    <div class="continer">
      <div>
        <router-view></router-view>
      </div>

    </div>
  </div>
</template>

<script>
import router from '@/router'
export default {
  name: 'App',
  data(){
    return {
      list:[1,2,3,4,5,6,7,8,9],
      router:router.options.routes,
    };
  },
  mounted()
  {
  },
  methods:{
    aaa(){

      this.list.reverse();

    }
  }
}
</script>
<style scoped>
  .main{
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .continer{
    flex-grow: 1;
    position: relative;
  }
  .continer > div{
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
  }
</style>
<style>
*{
  box-sizing: border-box;
}
body{
  margin: 0px;
  padding: 0px;
}

</style>
