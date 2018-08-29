<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" version="1.1" preserveAspectRatio="xMid yMid meet">
    <g transform="translate(500,500)">
      <path
      v-for="p in rings"

      class="ring"
      :class="{link:((hover_chord&&hover_chord.from_object==p)||(hover_chord&&hover_chord.to_object==p))}"
      :fill="`${p.color}`"



      :d="p.path"

      @mouseover="hover_ring=p"
      @mouseout="hover_ring=null"

      ></path>
    </g>

    <g transform="translate(500,500)">
      <path

      v-for="c in chords"
      class="chord"
      :class="{link:(hover_ring&&hover_ring.from_links.includes(c))||(hover_ring&&hover_ring.to_links.includes(c))}"

      :fill="c.color"
      :d="c.path"
      @mouseover="hover_chord=c"
      @mouseout="hover_chord=null"
      ></path>
    </g>

  </svg>

</template>

<script>
import color from '@/util/color'
export default {
  data(){
    return {
        rings:[],
        chords:[],

        hover_ring:null,
        hover_chord:null,

        list:[],
        gap:0,
    };
  },
  props: {
    // list: {
    //   type: Array,
    //   default(){
    //     return [
    //       {from:"中国",to:"亚洲",value:1418573},
    //       {from:"中国",to:"日本",value:3968373},
    //       {from:"中国",to:"北美",value:2389328},
    //       {from:"中国",to:"欧洲",value:2878778},
    //       {from:"中国",to:"中国",value:3698389},
    //
    //       {from:"亚洲",to:"亚洲",value:2587387},
    //       {from:"亚洲",to:"日本",value:3683968},
    //       {from:"亚洲",to:"北美",value:3256387},
    //       {from:"亚洲",to:"欧洲",value:2782872},
    //       {from:"亚洲",to:"中国",value:8936989},
    //
    //       {from:"日本",to:"亚洲",value:2543258},
    //       {from:"日本",to:"日本",value:3683872},
    //       {from:"日本",to:"北美",value:3697838},
    //       {from:"日本",to:"欧洲",value:6532878},
    //       {from:"日本",to:"中国",value:2712788},
    //
    //       {from:"北美",to:"亚洲",value:2152378},
    //       {from:"北美",to:"日本",value:3256438},
    //       {from:"北美",to:"北美",value:2578238},
    //       {from:"北美",to:"欧洲",value:6987388},
    //       {from:"北美",to:"中国",value:1287728},
    //
    //       {from:"欧洲",to:"亚洲",value:1256438},
    //       {from:"欧洲",to:"日本",value:7254387},
    //       {from:"欧洲",to:"北美",value:2873287},
    //       {from:"欧洲",to:"欧洲",value:2857785},
    //       {from:"欧洲",to:"中国",value:8768768},
    //     ]
    //     },
    // },
    gap_persent:{
      type:Number,
      default:0.2,
    },
  },
  mounted() {
    let count=15;
    for (var i = 0; i < count; i++) {
      for (var j = 0; j < count; j++) {
        this.list.push({from:`area${i+1}`,to:`area${j+1}`,value:Math.ceil(Math.random()*1000000)},);
      }
    }
    this.list.sort((a,b)=>{
      if (a.from==b.from) {
        return a.to>b.to?-1:1;
      } else {
        return a.from>b.from?1:-1;
      }

    });
    console.log(this.list);
    this.init();
  },
  methods:{
    init(){
      this.gap=this.list.reduce((sum,i)=>sum+i.value,0)*this.gap_persent/Array.from(new Set(this.list.map(l=>l.from))).length/2;

      console.log(this.gap);

      // this.gap=10000;
      this.rings=[];
      this.chords=[];
      let rings={};
      let chords={};
      this.list.forEach((l)=>{
        if (rings[l.from]) {
          rings[l.from]+=l.value;
        } else {
          rings[l.from]=l.value;
        }
        if (chords[`${l.to}-${l.from}`]) {
          chords[`${l.to}-${l.from}`]['to_from']=l.value;
        } else {
          chords[`${l.from}-${l.to}`]={
            from:l.from,
            to:l.to,
            from_to:l.value,
          }
        }

      });
      let total=0;
      let count=this.gap;
      for (var key in rings) {
        if (rings.hasOwnProperty(key)) {
          let o={
            name:key,
            value:rings[key],
            color:color.randomColor(),
          }
          total+=(rings[key]+this.gap*2);
          this.rings.push(o);
        }
      }
      console.log(chords);
      for (var key in chords) {
        if (chords.hasOwnProperty(key)) {
          this.chords.push(chords[key]);
        }
      }

      let toFix={};

      this.rings=this.rings.map((l,index)=>{
        let path=`M${this.getAngel(count,total).x*300},${this.getAngel(count,total).y*300}`;
            path+=`L${this.getAngel(count,total).x*400},${this.getAngel(count,total).y*400}`;
            path+=`A400,400,0,${(l.value/total>0.5)?1:0},1,${this.getAngel(count+l.value,total).x*400},${this.getAngel(count+l.value,total).y*400}`;
            path+=`L${this.getAngel(count+l.value,total).x*300},${this.getAngel(count+l.value,total).y*300}`;
            path+=`A300,300,0,${(l.value/total>0.5)?1:0},0,${this.getAngel(count,total).x*300},${this.getAngel(count,total).y*300}`;
            path+="Z";
        l.path=path;
        l.start=count;
        l.from_links=[];
        let countF=0;
        this.chords=this.chords.map((m)=>{
          if (m.from==l.name) {
            l.from_links.push(m);
            m.from_object=l;
            m.color=l.color;
            m.f_start=count+countF;
            m.f_end=count+countF+m.from_to;
            countF+=m.from_to;



          }
          return m;
        });
        l.to_links=[];
        let fixed=this.chords.filter(m=>m.from==l.name).reduce((sum,i)=>{return sum+i.from_to},0);
        // console.log(fixed);
        // fixed=0;
        let countT=0;
        this.chords=this.chords.map((m)=>{
          if (m.to==l.name) {
            m.to_object=l;
            l.to_links.push(m);
            m.t_start=count+countT+fixed;
            m.t_end=count+countT+fixed+m.to_from;
            // if (m.from==m.to) {
              countT+=m.to_from;
            // }
            // else
            // {
              // countT+=m.from_to;
            // }
          }
          return m;
        });
        count+=l.value+this.gap*2;
        return l;
      });
      this.chords=this.chords.map((l)=>{
        let path=`M${this.getAngel(l.f_start,total).x*300},${this.getAngel(l.f_start,total).y*300}`;
        if (l.from==l.to) {
          path+=`A300,300,0,${((l.f_end-l.f_start)/total>0.5)?1:0},1,${this.getAngel(l.f_end,total).x*300},${this.getAngel(l.f_end,total).y*300}
                 Q0,0,${this.getAngel(l.f_start,total).x*300},${this.getAngel(l.f_start,total).y*300}`;
        } else {
          let c=0;
          let d=0;
          c=Math.pow(((l.t_end+l.t_start)/2 - (l.f_end+l.f_start)/2)/total,3)*50000;

          if (((l.t_start-l.f_end)/total<0.5) && ((l.t_end-l.f_start)/total>0.5)) {
            d=9999999;
          }


          path+=`A300,300,0,${((l.f_end-l.f_start)/total>0.5)?1:0},1,${this.getAngel(l.f_end,total).x*300},${this.getAngel(l.f_end,total).y*300}
                 Q0,0,${this.getAngel(l.t_start,total).x*300},${this.getAngel(l.t_start,total).y*300}
                 A300,300,0,${((l.t_end-l.t_start)/total>0.5)?1:0},1,${this.getAngel(l.t_end,total).x*300},${this.getAngel(l.t_end,total).y*300}
                 Q0,0,${this.getAngel(l.f_start,total).x*300},${this.getAngel(l.f_start,total).y*300}`;
        }
        path+="Z";

        l.path=path;
        return l;
      });
      console.log(this.$data);
    },
    getAngel(value, total) {
      return {
        x: Math.sin(Math.PI * 2 * value / total),
        y: Math.cos(Math.PI * 2 * value / total) * -1,
      };
    },
  }
}
</script>

<style scoped>
svg{
  width: 100%;
  height: 100%;
}
.ring{
  stroke:#111111;
  fill-opacity:0.2;
  stroke-width:0.2;
    transition: fill-opacity 0.5s,stroke-width 0.5s;
}
.ring:hover{
  fill-opacity:0.8;
  stroke-width:2;
}
.ring.link{
  fill-opacity:0.8;
    stroke-width:2;
}
  .chord{
    stroke:#111111;
    fill-opacity:0.2;
    stroke-width:0.2;
    transition: fill-opacity 0.5s,stroke-width 0.5s;
  }
  .chord:hover{
    fill-opacity:0.8;
      stroke-width:2;
  }
  .chord.link{
    fill-opacity:0.8;
      stroke-width:2;
  }
</style>
