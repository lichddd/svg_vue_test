<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" version="1.1" preserveAspectRatio="xMid yMid meet">
    <g>
      <rect
      v-for="(l,index) in list"
      class="rect"
      :width="(1000/list.length-40-20)"
      :height="l*90"
      :x="index*(80)+20"
      :y="1000-l*90"
  style=""/>
</g>
  </svg>

</template>

<script>
export default {
  data(){
    return {
        list:[1,2,3,4,5,6,7,8,9,10],
    };
  }
}
</script>

<style scoped>
svg{
  width: 100%;
  height: 100%;
}
  .rect{
    width:100;
    height: 100;
    fill:rgb(200,200,255);
    stroke-width:1;
    stroke:rgb(0,0,0);
    cursor: pointer;
    rx:5;
    ry:5;
  }
  .rect:hover{
    fill:rgb(240,240,255);
    stroke-width:5;
    stroke:rgb(100,100,100);
  }

</style>
