<template>
  <div class="minimap">
    <div class="title">
      导航
    </div>
    <div class="continer" @mousedown.stop="draging=true;"  @mousemove.stop="onMouseMove($event)" @mouseup.stop="onMouseUp($event)">
      <svg
      xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 10000 10000"
       version="1.1"
      v-html="svg">

      </svg>
      <div class="mask">
        <div class="row" :style="{'height':`${((position.width/2-position.y/position.scale)/5000-0.2/position.scale/2/(1000/1000))*100}%`}">

        </div>
        <div class="row center" :style="{'height':`${0.2/position.scale/(1000/1000)*100}%`}">
          <div class="col" :style="{'width':`${((position.width/2-position.x/position.scale)/5000-0.2/position.scale/2/(1000/1000))*100}%`}">

          </div>
          <div class="col center" :style="{'width':`${0.2/position.scale/(1000/1000)*100}%`}">

          </div>
          <div class="col last">

          </div>
        </div>
        <div class="row last">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'minimap',
  props:{
    position:{
      type:Object,
      default(){
        return {};
      },
    },
  },
  data(){
    return {
      svg:'',
      windowSize:0,
      draging: false,
      prePoint: null,
    };
  },
  mounted()
  {
    window.addEventListener('resize',this.onResize);
    this.onResize();
  },
  beforeDestroy(){
    window.removeEventListener('resize',this.onResize);
  },
  methods:{
    updateSVG(svg){
      this.svg=svg;
    },
    onResize(e){
      this.windowSize=Math.min(window.innerWidth,window.innerHeight);
    },
    onMouseMove(e) {
      if (this.draging && this.prePoint) {
        let tx= this.position.x -(e.clientX - this.prePoint.x)*(5000/200*this.position.scale);
        let ty= this.position.y -(e.clientY - this.prePoint.y)*(5000/200*this.position.scale);
        this.position.x=(tx<=0?Math.max(tx,-this.position.width*this.position.scale/2):Math.min(tx,this.position.width*this.position.scale/2));
        this.position.y=(ty<=0?Math.max(ty,-this.position.width*this.position.scale/2):Math.min(ty,this.position.width*this.position.scale/2));
      }
      this.prePoint = {
        x: e.clientX,
        y: e.clientY
      };
    },
    onMouseUp() {
      this.draging = false;
      this.prePoint = null;
    },
  }
}
</script>

<style scoped="">
.minimap{
  width: 100%;
  height: 100%;
  background: #F7F9FB;
  border-right: 1px solid #E6E9ED;
}
.continer
{
  width: 100%;
  height: calc(100% - 30px);
  overflow: hidden;
}
.continer svg{
  width: 100%;
  height: 100%;
}
.title
{
  width: 100%;
  height: 30px;
  border-bottom: 1px solid #DCE3E8;
background: #EBEEF2;
padding: 5px;
}
.mask{
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
}
.mask .row{
  background: rgba(0,0,0,0.5);
  width: 100%;
  flex-grow: 0;
  display: flex;
}
.mask .row.center{
  background: none;
  flex-grow:0;
}
.mask .row.last{
  flex-grow: 1;
}
.mask .row .col{
  background: rgba(0,0,0,0.5);
  height:100%;
  flex-grow: 0;
}
.mask .row .col.last{
  flex-grow: 1;
}
.mask .row .center{
  background: none;
}
</style>
