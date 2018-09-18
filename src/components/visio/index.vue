<template>
<div class="visio">
<buttonbar class="top" ref="buttonbar" @COMMOND="(code)=>{$refs.viewport.commond(code);}"></buttonbar>
  <div class="main" :class="{'add-cursor':$refs.itemlist&&$refs.itemlist.add_item}">
    <viewport
    ref="viewport"
    @STATE_CHANGE="(data,svg)=>{$refs.buttonbar.updateState(data);$refs.minimap.updateSVG(svg)}"
    :add_item="$refs.itemlist&&$refs.itemlist.add_item"
    ></viewport>
    <itemlist
    ref="itemlist"
    ></itemlist>

   <div class="right" @keyup.stop="">
     <props ref="props"

     :item="$refs.viewport&&$refs.viewport.selectitem"

     :edge="$refs.viewport&&$refs.viewport.selectedge"></props>
     <minimap ref="minimap" :position="$refs.viewport&&$refs.viewport.getPosition()"></minimap>

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
  border-left: 1px solid #E6E9ED;
  position: absolute;
  right: 0px;
}
.main .right .props{
  height: calc(100% - 200px);
}
.main .right .minimap{
  height:200px;
}
.top{
  z-index:1;
}
.add-cursor{
  cursor: copy!important;
}
</style>
