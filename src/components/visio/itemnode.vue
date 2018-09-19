<template>
  <g
  :transform="`translate(${item.x},${item.y})`"
  class="item"
  :class="{'select':selectitem==item}"
  >
    <defs>
        <pattern id="avatar" width="100%" height="100%" patternContentUnits="objectBoundingBox">
            <image width="1" height="1" xlink:href="../../assets/logo.png"/>
        </pattern>
    </defs>
    <ellipse
    v-if="item.shape=='ellipse'"
    :rx="item.width/2"
    :ry="item.height/2"
    fill="url(#avatar)"
    >

    </ellipse>
    <rect
    :x="-item.width/2"
    :y="-item.height/2"
    v-if="item.shape=='rect'"
    :rx="item.radius"
    :ry="item.radius"
    :width="item.width"
    :height="item.height"
    :fill="item.color"
    ></rect>
    <polygon
    v-if="item.shape=='polygon'"
    :fill="item.color"
    :points="util.getPoints(item.width,item.height,item.point_num)"/>
    <path
    v-if="item.shape=='path'"
    :fill="item.color"
    :d="util.getD(item.width,item.height,item.d)"/>

    <!-- <image :x='-item.width/2' :y='-item.height/2' :width='item.width' :height='item.height' xlink:href='../../assets/logo.png' ></image> -->

    <text text-anchor="middle" :x="0" :y="8">{{item.name}}</text>
    <g>
      <g
      :transform="`translate(${item.width*a.x},${item.height*a.y})`"
      @mousedown.stop="$emit('DRAW_ANCHOR',item,index)"
      @mouseup="(drawindex==index&&drawitem==item)?'':$emit('DRAW_ANCHOR_FINISH',item,index)"
      v-for="(a,index) in item.anchors"
      class="anchor"
      :class="{'draw-from':drawindex==index&&drawitem==item}">
        <circle
        class="anchor-light"
        :cx="0"
        :cy="0"
        :r="16/scale*1.5"/>
        <circle
        class="anchor-center"
        :cx="0"
        :cy="0"
        :r="8/scale*1.5"/>

      </g>
    </g>
  </g>
</template>

<script>
import util from './util'
export default {
  name: 'itemnode',
  data(){
    return {
      util:util,
    };
  },
  props:{
    selectitem:{
      type:Object,
      default(){
        return null;
      },
    },
    item:{
      type:Object,
      default(){
        return null;
      },
    },
    drawindex:{
      type:Number,
      default:0,
    },
    drawitem:{
      type:Object,
      default(){
        return null;
      },
    },
    scale:{
      type:Number,
      default:1,
    }
  },
  mounted()
  {
  },
  methods:{
  }
}
</script>

<style scoped="">

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
  stroke:#444444;
  stroke-width:1;
  fill:#ffffff;
  cursor: crosshair;

}
.item .anchor-center{
  opacity: 0;
  transition: opacity 0.5s,fill 0.5s;
}
.item .anchor-light {
  opacity: 0;
  stroke-width:0;
  stroke:#22b2ec;
  fill:#22b2ec;
  transition: opacity 0.5s,stroke-width 0.5s;
}
:not(.drawing).item .anchor:hover .anchor-center {
  fill:#22b2ec;
}
.item:hover .anchor  .anchor-center,.item.select .anchor{
  opacity: 1;
}
.drawing.item .anchor-light
{
  opacity: 0.5;
}
.drawing.item .anchor-center{
  opacity: 1;
}
.drawing.item .draw-from .anchor-light{
  opacity: 0;
}
.drawing.item .draw-from .anchor-center{
  opacity: 1;
  fill:#22b2ec;
}
.drawing.item .anchor:hover .anchor-light{
  stroke-width:10;
}


.item text
{
  font-size: 24px;
  stroke-width:2;
  user-select:none;
}
</style>
