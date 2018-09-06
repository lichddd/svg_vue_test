<template>
<div class="visio">
<buttonbar class="top"></buttonbar>
  <div class="main">
    <viewport ref="viewport" @SELECT_ITEM_CHANGE="(data)=>{$refs.props.changeItem(data)}"></viewport>
    <itemlist @ADD_ITEM="(data)=>{$refs.viewport.addItem(data)}"></itemlist>

   <div class="right">
     <props ref="props"></props>
     <minimap></minimap>

   </div>
  </div>

</div>
</template>
<script>
import buttonbar from './buttonbar'
import itemlist from './itemlist'
import minimap from './minimap' 
import props from './props'
import viewport from './viewport'
export default {
  name: 'visio',
  components:{
    buttonbar,
    itemlist,
    minimap,
    props,
    viewport,
  },
  data() {
    return {}
  },
  props: {
  },
  computed:{
  },
  watch:{
  },
  mounted() {
  },
  beforeDestroy(){
  },
  methods: {
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.visio{
width:100%;
height: 100%;

    display: flex;
    flex-direction: column;
}
.main{
  position: relative;
}
.main .itemlist
{
  width: 200px;
  height: 100%;
  position: absolute;
  left: 0px;
}
.main .viewport
{
  width:100%;
  height: 100%;
}
.main .right
{
  width: 200px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #E6E9ED;
  position: absolute;
  right: 0px;
}
.main .right .props{
  flex-grow: 1;
  height: calc(100% - 160px);
}
.top{
  z-index:1;
}
</style>
