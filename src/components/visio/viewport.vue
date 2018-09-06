<template>
<div class="viewport" @mousemove.stop="onMouseMove($event)" @mouseup.stop="onMouseUp($event)">
  <div class="fixed">
    <svg xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10000 10000"
      version="1.1"
      preserveAspectRatio="xMid yMid meet"
      @mousedown.stop="draging=true;"
      @wheel.stop="onWheel($event)"
      :class="{'drag':draging}"
      :style="{'transform':`translate(-${position.width*position.scale/2}px,-${position.width*position.scale/2}px)`,
      'left':`${position.x}px`,
      'top':`${position.y}px`,
      'width':`${position.width*position.scale}px`,
      'height':`${position.width*position.scale}px`,
      'background-size':`${20*position.scale}px ${20*position.scale}px`
      }"



      >
            <g :transform="`translate(5000,5000)`">
              <g
              v-for="item in itemlist"
              @click="selectitem=item"
              :transform="`translate(${item.x},${item.y})`"
              class="item"
              :class="{'select':selectitem==item}"
              >
                <ellipse

                @mousedown.stop="dragitem=item"

                v-if="item.shape=='ellipse'"
                :rx="item.width"
                :ry="item.height"
                :fill="item.color"
                ></ellipse>
                <rect
                @mousedown.stop="dragitem=item"
                :x="-item.width/2"
                :y="-item.height/2"
                v-if="item.shape=='rect'"
                :rx="item.radius/item.width"
                :ry="item.radius/item.height"
                :width="item.width"
                :height="item.height"
                :fill="item.color"
                ></rect>
                <polygon
                @mousedown.stop="dragitem=item"
                v-if="item.shape=='polygon'"
                :fill="item.color"
                :points="util.getPoints(item.width,item.height,item.point_num)"/>
                <path
                @mousedown.stop="dragitem=item"
                v-if="item.shape=='path'"
                :fill="item.color"
                :d="util.getD(item.width,item.height,item.d)"/>

                <g class="anchor">



                  <template v-if="item.shape=='rect'">
                    <circle :cx="-item.width/2" :cy="0" r="8"/>
                    <circle :cx="item.width/2" :cy="0" r="8"/>
                    <circle :cx="0" :cy="-item.height/2" r="8"/>
                    <circle :cx="0" :cy="item.height/2" r="8"/>
                  </template>
                  <template v-if="item.shape=='ellipse'">
                    <circle :cx="-item.width" :cy="0" r="8"/>
                    <circle :cx="item.width" :cy="0" r="8"/>
                    <circle :cx="0" :cy="-item.height" r="8"/>
                    <circle :cx="0" :cy="item.height" r="8"/>
                  </template>

                  <template v-if="item.shape=='polygon'">
                    <circle v-for="a in util.getPointsAnchor(item)" :cx="a.x" :cy="a.y" r="8"/>
                  </template>

                  <template v-if="item.shape=='path'">
                    <circle v-for="a in util.getPathAnchor(item)" :cx="a.x" :cy="a.y" r="8"/>
                  </template>
                </g>
              </g>






            </g>
    </svg>
  </div>


</div>
</template>

<script>
import color from '@/util/color'
import util from './util'
export default {
  name: 'viewport',
  data() {
    return {
      draging: false,
      linking:false,
      prePoint: null,
      dragitem: null,
      selectitem: null,
      position: {
        x: 0,
        y: 0,
        scale: 1,
        width: 5000
      },
      itemlist: [
        // {name:"分叉节点",shape:"polygon",width:"80",height:"50",point_num:5,color:color.randomColor(),x:0,y:0},
        // {name:"分叉节点",shape:"polygon",width:"80",height:"80",point_num:6,color:color.randomColor(),x:0,y:0},
        // {name:"分叉节点",shape:"polygon",width:"80",height:"50",point_num:7,color:color.randomColor(),x:0,y:0},
        // {name:"常规节点",shape:"rect",width:"80",height:"80",radius:"10",color:"#321455",x:0,y:0},
        // {name:"起止节点",shape:"ellipse",width:"80",height:"60",color:"#3ff455",x:0,y:0},

      ],
      util: util,
    };
  },
  mounted() {},
  beforeDestroy() {},
  methods: {

    onMouseMove(e) {
      if (this.draging && this.prePoint) {
        this.position.x += (e.clientX - this.prePoint.x);
        this.position.y += (e.clientY - this.prePoint.y);
      }
      if (this.dragitem && this.prePoint) {
        this.dragitem.x += (e.clientX - this.prePoint.x) * 10000 / this.position.scale / this.position.width;
        this.dragitem.y += (e.clientY - this.prePoint.y) * 10000 / this.position.scale / this.position.width;
      }
      this.prePoint = {
        x: e.clientX,
        y: e.clientY
      };
    },
    onMouseUp() {
      this.draging = false;
      this.dragitem = null;
      this.selectitem = null;
      this.prePoint = null;
    },
    onWheel(e) {
      console.log(e);
      this.position.scale += e.deltaY > 0 ? 0.1 : -0.1;
      this.position.scale = Math.min(Math.max(0.2, this.position.scale), 4);
      // this.position.x+=(this.position.x-this.position.x*this.position.scale)/2;
      // this.position.y+=(this.position.y-this.position.y*this.position.scale)/2;
    },
    addItem(data) {
      this.itemlist.push(Object.assign({
        x: 0,
        y: 0
      }, data));
    },
  },
  watch: {
    selectitem() {

      this.$emit("SELECT_ITEM_CHANGE", this.selectitem);


    }


  }

}
</script>

<style scoped="">
.viewport {
  overflow: hidden;
  position: relative;
}

.viewport .fixed {
  width: 0px;
  height: 0px;
  margin: auto;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  position: absolute;
}

.viewport svg {
  position: absolute;
  cursor: grab;
  background-image: url(./bg.jpg);
}

.viewport svg.drag {
  cursor: grabbing;
}

.item {
  stroke: #000000;
  transition: stroke-width 0.5s;
  cursor: move;
}

.item:hover {
  stroke-width: 5;
}

.item.select {
  stroke-width: 5;
}

.item .anchor {
  opacity: 0;
  transition: opacity 0.5s;
  stroke:#444444;
  stroke-width:1;
  fill:#ffffff;
  cursor: crosshair;
}
.item:hover .anchor,.item.select .anchor{
  opacity: 1;
}
</style>
