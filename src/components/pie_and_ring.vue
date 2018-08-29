<template>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" version="1.1" preserveAspectRatio="xMid yMid meet">
  <g transform="translate(500,500)">
    <g v-for="p in paths"
    class="radar-line"
    fill-opacity="0.2"
    stroke="#222222"
    stroke-width="0"
    fill="rgba(100,100,100,0.1)"
    @mouseover="p.hover=true;"
    @mouseout="p.hover=false;"
    :transform="`${p.hover==true?'scale(1.1)':''} ${(p.hover==true&&type=='ring')?'translate('+p.rx*-300*0.1+','+p.ry*-300*0.1+')':''}`"
    >
      <path :fill="`#${p.color}`" :stroke="`#${p.color}`" :d="p.line" ></path>
    </g>
  </g>
  </svg>
</template>
<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      list: [],
      paths:[],
    }
  },
  props:{
    type:{
      type:String,
      default:'ring',
    },
    gap:{
      type:Number,
      default:10,
    }
  },
  mounted(){
    this.type=Math.random()>0.5?'pie':'ring';
    for (var i = 0; i < 8; i++) {
      this.list.push(Math.random()*500);
    }
    this.init();


  },
  methods: {
    getAngel(value, total) {
      return {
        x: Math.sin(Math.PI * 2 * value / total),
        y: Math.cos(Math.PI * 2 * value / total) * -1,
      };
    },
    init() {
      let arr = [];
      let total=0;
      let count=0;
      this.list.forEach((a) => {
        arr.push({value:a,hover:false});
        total+=a;
        if (this.type=='pie') {

        } else {
          total+=(this.gap*2);
        }
      })
      arr.forEach((a, i) => {

        if (this.type=='pie') {
          a.line=`M0,0`;
          a.line+=`L${this.getAngel(count,total).x*400},${this.getAngel(count,total).y*400}`;
          a.line+=`A400,400,0,${(a.value/total>0.5)?1:0},1,${this.getAngel(count+a.value,total).x*400},${this.getAngel(count+a.value,total).y*400}`;
          a.line+="Z";
          count+=a.value;
        } else {
          a.line=`M${this.getAngel(count+this.gap,total).x*300},${this.getAngel(count+this.gap,total).y*300}`;
          a.line+=`L${this.getAngel(count+this.gap,total).x*400},${this.getAngel(count+this.gap,total).y*400}`;
          a.line+=`A400,400,0,${(a.value/total>0.5)?1:0},1,${this.getAngel(count+a.value,total).x*400},${this.getAngel(count+a.value,total).y*400}`;
          a.line+=`L${this.getAngel(count+a.value,total).x*300},${this.getAngel(count+a.value,total).y*300}`;
          a.line+=`A300,300,0,${(a.value/total>0.5)?1:0},0,${this.getAngel(count+this.gap,total).x*300},${this.getAngel(count+this.gap,total).y*300}`;
          a.line+="Z";

          a.rx=this.getAngel(count+a.value/2+this.gap,total).x;
          a.ry=this.getAngel(count+a.value/2+this.gap,total).y;
          count+=a.value+this.gap*2;
        }




        let color=Math.floor((Math.random()*0xffffff)).toString(16);
        while(color.length<6)
        {
          color="0"+color;
        }
        a.color=color;
      });
      this.paths=arr;
    },
  },
  computed: {
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
svg {
  width: 100%;
  height: 100%;
}

.radar-line {
  cursor: pointer;
  transition: fill-opacity 0.5s,stroke-width 0.5s,transform 0.5s;
}

.radar-line:hover {
  fill-opacity: 0.8;
  stroke-width: 5;

}
</style>
