<template>
<svg xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 1000 1000"
version="1.1"
preserveAspectRatio="xMid yMid meet"
@mousemove="onMouseMove($event)"
@mouseup="dragnode=null;prePoint=null;"
>
  <g transform="translate(500,500)">
    <g
    stroke="#222222"
    stroke-width="1"
    >
    <g
    v-for="l in lines"
    @mouseover="linkitems=[l.from,l.to]"
    @mouseout="linkitems=[]"
    class="force-line"
    :class="{link:linklines.includes(l)}"
    >
      <line
      :x1="l.from.x" :y1="l.from.y" :x2="l.to.x" :y2="l.to.y"
      >

    </line>
    <text :x="(l.from.x+l.to.x)/2" :y="(l.from.y+l.to.y)/2">{{l.len}}</text>
  </g>
    </g>
    <g
    fill-opacity="0.1"
    stroke="#222222"
    stroke-width="1"
    fill="rgba(100,100,100,0.5)"
    >
      <g v-for="i in items"
      @mouseover="linklines=i.links"
      @mouseout="linklines=[]"
      @mousedown="dragnode=i"
      class="force-node"
      :class="{link:linkitems.includes(i)}"
      >
      <circle
          :stroke="i.color"
          :fill="i.color"

      :r="i.size" :cx="i.x" :cy="i.y"

      ></circle>
      <text text-anchor="middle" :x="i.x" :y="i.y-i.size-5">{{i.name}}</text>
    </g>

    </g>
  </g>
  </svg>
</template>
<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      lines: [],
      items: [],
      linklines:[],
      linkitems:[],
      dragnode:null,
      prePoint:null,
      rate:1,
      nodes:[],
      edges:[],
    }
  },
  props: {
    // nodes: {
    //   type: Array,
    //   default(){return [{name:"A",size:20,},{name:"B",size:10,},{name:"C",size:27,},]},
    // },
    // edges: {
    //   type: Array,
    //   default(){return [{from:"B",to:"A",len:2},{from:"B",to:"C",len:10},{from:"C",to:"A",len:15},]},
    // }
  },
  watch:{
    nodes(){
      this.init();
    },
    edges(){
      this.init();
    }
  },
  mounted() {
    let count =200;
    for (var i = 0; i < count; i++) {
      let color=Math.floor((Math.random()*0xffffff)).toString(16);
      while(color.length<6)
      {
        color="0"+color;
      }
      this.nodes.push({name:`node${i}`,size:Math.ceil(Math.random()*20+1),color:`#${color}`});

      let arr=[];
      for (var j = 0; j < 5; j++) {
        arr.push(`node${Math.ceil(Math.random()*(count-1))}`);
      }
      arr=Array.from(new Set(arr));
      arr.forEach((l)=>{
        this.edges.push({from:`node${i}`,to:l,len:Math.ceil(Math.random()*50+1),});
      })

    }

    console.log(this.edges);



    window.addEventListener('resize',this.onResize);
    this.onResize();
    this.init();
    window.requestAnimationFrame(this.move);
  },
  beforeDestroy(){
    window.removeEventListener('resize',this.onResize);
  },
  methods: {
    move()
    {
        this.items.forEach((i)=>{
          if (i.x>=500) {
            i.xs=-Math.abs(i.xs);
          }
          if (i.x<= -500) {
            i.xs=Math.abs(i.xs);
          }
          if (i.y>=500) {
            i.ys=-Math.abs(i.ys);
          }
          if (i.y<= -500) {
            i.ys=Math.abs(i.ys);
          }
          i.x+=i.xs*5;
          i.y+=i.ys*5;
        })
        window.requestAnimationFrame(this.move);
    }
    ,
    onResize(e){
      this.rate=1000/Math.min(this.$el.clientWidth,this.$el.clientHeight);
    },
    onMouseMove(e){
      if(this.dragnode&&this.prePoint)
      {
        this.dragnode.x+=(e.clientX-this.prePoint.x)*this.rate;
        this.dragnode.y+=(e.clientY-this.prePoint.y)*this.rate;
      }
      this.prePoint={x:event.clientX,y:event.clientY};
    },
    init() {
      this.lines=[];
      this.items=[];
      this.linklines=[];
      this.linkitems=[];
      let nodes={};
      let edges={};
      let count = this.nodes.length;
      this.nodes.forEach((i,inx)=>{
        nodes[i.name]={
          name:i.name,
          size:Math.max(Math.min(i.size,20),10),
          color:i.color,
          xs:Math.random()-0.5,
          ys:Math.random()-0.5,
          x: Math.sin(Math.PI * 2 * inx / count)*500,
          y: Math.cos(Math.PI * 2 * inx / count)*500,
        };
        this.items.push(nodes[i.name]);
      })
      this.edges.forEach((i)=>{
        let l={from:nodes[i.from],to:nodes[i.to],len:i.len,};
        if (edges[i.from]) {
          edges[i.from].push(l);
        } else {
          edges[i.from]=[l];


        }
        if (edges[i.to]) {
          edges[i.to].push(l);
        } else {
          edges[i.to]=[l];

        }
        this.lines.push(l);
      })
      this.items.forEach((i)=>{
        i.links=edges[i.name];
      })
    },
  },
  computed: {}
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
svg {
  width: 100%;
  height: 100%;
}

.force-line line{
  transition: fill-opacity 0.5s, stroke-width 0.5s, transform 0.5s;
}
.force-line text{
  user-select: none;
  transition: font-size 0.5s;
}
.force-line:hover line{
  fill-opacity: 1;
  stroke-width: 5;
}
.force-line.link line{
  fill-opacity: 1;
  stroke-width: 5;
}
.force-line:hover text{
  font-size: 24px;
}
.force-line.link text{
  font-size: 24px;
}
.force-node{
  cursor: move;
}
.force-node circle{
  transition: fill-opacity 0.5s, stroke-width 0.5s, transform 0.5s;
}
.force-node text{
  user-select: none;
    transition: font-size 0.5s;
}
.force-node:hover circle{
  fill-opacity: 1;
  stroke-width: 5;
}
.force-node:hover text{
  font-size: 24px;
}
.force-node.link circle {
  fill-opacity: 1;
  stroke-width: 5;
}
.force-node.link text{
  font-size: 24px;
}
</style>
