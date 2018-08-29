<template>
<svg xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 1000 1000"
version="1.1"
preserveAspectRatio="xMid yMid meet"
>
<g>
  <path class="line" v-for="(l,index) in lines" :class="{hide:ishide(l)}"
  :d="getLine(l,index)" :fill="l.color"/>
</g>
  <g transform="translate(100,0)">
    <g
    v-for="(l,index) in left"
    :transform="`translate(0,${getYLeft(l,index)})`"
    @mouseover="resetMove(false);hoverLeft=l;movement=1-movement;"
    @mouseout="hoverLeft=null;movement=1-movement;"
    >
    <rect
    class="rect"
    :width="100"
    :height="getHeightLeft(l)"
    :x="0"
    :y="0"

    style=""/>
    <text :x="-20" :y="getHeightLeft(l)/2"  text-anchor="end">{{l.name}}</text>
  </g>
  </g>

  <g transform="translate(800,0)">
    <g
    v-for="(l,index) in right"
    :transform="`translate(0,${getYRight(l,index)})`"
    @mouseover="resetMove(true);hoverRight=l;movement=1-movement;"
    @mouseout="hoverRight=null;movement=1-movement;"
    >
    <rect
    class="rect"
    :width="100"
    :height="getHeightRight(l)"
    :x="0"
    :y="0"
    style=""/>
<text :x="120" :y="getHeightRight(l)/2">{{l.name}}</text>
  </g>
  </g>
  </svg>
</template>
<script>
import color from '@/util/color'
export default {
  name: 'HelloWorld',
  data() {
    return {
      left:[],
      right:[],
      lines:[],
      leftTotal:0,
      rightTotal:0,

      hoverRight:null,
      hoverLeft:null,

      movement:0,

      list:[],
    }
  },
  props: {
    // list: {
    //   type: Array,
    //   default(){
    //     return [
    //       {machina:"PS4",area:"亚洲",value:32564387},
    //       {machina:"PS4",area:"中国",value:100000},
    //       {machina:"PS4",area:"北美",value:12564387},
    //       {machina:"XboxOne",area:"亚洲",value:587287},
    //       {machina:"XboxOne",area:"中国",value:60000},
    //       {machina:"XboxOne",area:"北美",value:487287},
    //       {machina:"Switch",area:"亚洲",value:3983783},
    //       {machina:"Switch",area:"中国",value:30000},
    //       {machina:"Switch",area:"北美",value:2983783},
    //     ]
    //     },
    // },
    gap:{
      type:Number,
      default:10,
    },
  },
  computed:{

  },
  watch:{
    list(){
      this.init();
    },
  },
  mounted() {
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 15; j++) {
        this.list.push({machina:`item${i}`,area:`area${j}`,value:Math.ceil(Math.pow(Math.random()*100,Math.random()*4))});
      }
    }
    this.init();
    setTimeout(this.move,50);
  },
  beforeDestroy(){
  },
  methods: {
    move(){
      if (this.movement>0) {
        this.movement-=0.1;
        this.movement=Math.max(this.movement,0);
      }
      setTimeout(this.move,50);
    },
    resetMove(right){
      if (right) {
        this.right.forEach((i)=>{i.movement_y=i.y;i.movement_height=i.height;});
        this.lines.forEach((l)=>{l.movement_rheight=l.rightHeight;l.movement_ry=l.rightY;});
      }
      else
      {
        this.left.forEach((i)=>{i.movement_y=i.y;i.movement_height=i.height});
        this.lines.forEach((l)=>{l.movement_lheight=l.leftHeight;l.movement_ly=l.leftY;});
      }

    },
    ishide(l){
      if(this.hoverLeft&&l.left.name!=this.hoverLeft.name)
      {
        return true;
      }
      if(this.hoverRight&&l.right.name!=this.hoverRight.name)
      {
        return true;
      }

      return false;
    },






    getYLeft(l,index)
    {
      if (this.hoverRight) {
        let o={};
        let total=0;
        let value=0;
        let arr=this.lines.filter(l=>l.area==this.hoverRight.name);
        arr.forEach((n)=>{
          o[n.machina]=n.value;
          total+=n.value;
        })
        for (var i = 0; i < index; i++) {
          value+=o[this.left[i].name];
        }
        let n= this.gap*index+value/total *(1000-this.gap*(this.left.length-1));
        l.movement_y=n;
        return n-this.movement*(n-l.y);
      } else {
        return l.y+this.movement*(l.movement_y-l.y);
      }
    },
    getHeightLeft(l)
    {
      if (this.hoverRight) {
        let o={};
        let total=0;
        let arr=this.lines.filter(l=>l.area==this.hoverRight.name);
        arr.forEach((n)=>{
          o[n.machina]=n.value;
          total+=n.value;
        })
        let n=o[l.name]/total *(1000-this.gap*(arr.length-1));
        l.movement_height=n;
        return n-this.movement*(n-l.height);
      } else {
        return l.height+this.movement*(l.movement_height-l.height);
      }
    },
    getYRight(l,index)
    {
      if (this.hoverLeft) {
        let o={};
        let total=0;
        let value=0;
        let arr=this.lines.filter(l=>l.machina==this.hoverLeft.name);
        arr.forEach((n)=>{
          o[n.area]=n.value;
          total+=n.value;
        })
        for (var i = 0; i < index; i++) {
          value+=o[this.right[i].name];
        }
        let n= this.gap*index+value/total *(1000-this.gap*(this.right.length-1));
        l.movement_y=n;
        return n-this.movement*(n-l.y);
      } else {
        return l.y+this.movement*(l.movement_y-l.y);
      }

    },
    getHeightRight(l)
    {
      if (this.hoverLeft) {
        let o={};
        let total=0;
        let arr=this.lines.filter(l=>l.machina==this.hoverLeft.name);
        arr.forEach((n)=>{
          o[n.area]=n.value;
          total+=n.value;
        })
        let n=o[l.name]/total *(1000-this.gap*(arr.length-1));
        l.movement_height=n;
        return n-this.movement*(n-l.height);
      } else {
        return l.height+this.movement*(l.movement_height-l.height);
      }

    },


    getHeight(value,total,list){
      return value/total *(1000-this.gap*(list.length-1));
    },
    getY(index,total,list){
      let value=0;
      for (var i = 0; i < index; i++) {
        value+=list[i].value;
      }
      return this.gap*index+value/total *(1000-this.gap*(list.length-1));
    },
    getHeightLine(value,total,list)
    {
      return value/total *(1000-this.gap*(list.length-1));
    },
    getYLine(index,list,p){
      let value=0;
      let total=0;
      for (var i = 0; i < list.length; i++) {
        if (i<index-1) {
          value+=list[i].value;
        }
        total+=list[i].value;
      }
      return value/total*p.height + p.y;
    },
    lineChangeLHeight(new_value,origin,l)
    {
        if (this.hoverRight) {
          if(l.right.name!=this.hoverRight.name)
          {
            new_value=0;
          }
          l.movement_lheight=new_value;
          // return new_value;
          return new_value-this.movement*(new_value-origin);
        }
        return origin+this.movement*(l.movement_lheight-origin);
    },
    lineChangeRHeight(new_value,origin,l)
    {
      if (this.hoverLeft) {
        if(l.left.name!=this.hoverLeft.name)
        {
          new_value=0;
        }
        l.movement_rheight=new_value;
        // return new_value;
        return new_value-this.movement*(new_value-origin);
      }
      return origin+this.movement*(l.movement_rheight-origin);;
    },

    lineChangeLY(new_value,origin,l)
    {
        if (this.hoverRight) {
          // if(l.right.name!=this.hoverRight.name)
          // {
          //   new_value=origin;
          //   // let inx=0;
          //   // try {
          //   //   inx=this.lines.filter((i)=>{return i.right.name==this.hoverRight.name&&i.left.name==l.left.name})[0].index;
          //   // } catch (e) {
          //   //   console.error(e);
          //   // }
          //   // if (l.leftindex>inx) {
          //   //   new_value=l.left.height;
          //   // }
          //   // else
          //   // {
          //   //
          //   //   new_value=l.left.y;
          //   // }
          // }
          l.movement_ly=new_value;
          // return new_value;
          return new_value-this.movement*(new_value-origin);
        }
        return origin+this.movement*(l.movement_ly-origin);
    },
    lineChangeRY(new_value,origin,l)
    {
      if (this.hoverLeft) {
        // if(l.left.name!=this.hoverLeft.name)
        // {
        //   new_value=origin;
        //   // let inx=0;
        //   // try {
        //   //   inx=this.lines.filter((i)=>{return i.left.name==this.hoverLeft.name&&i.right.name==l.right.name})[0].index;
        //   // } catch (e) {
        //   //   console.error(e);
        //   // }
        //   // if (l.rightindex>inx) {
        //   //
        //   //               new_value=l.right.height;
        //   // }
        //   // else
        //   // {
        //   //
        //   //   new_value=l.right.y;
        //   // }
        // }
        l.movement_ry=new_value;
        // return new_value;
        return new_value-this.movement*(new_value-origin);
      }
      return origin+this.movement*(l.movement_ry-origin);;
    },


    getLine(l,index){
      return `M100,${this.lineChangeLY(this.getYLeft(l.left,l.left.index),l.leftY,l)}
              L200,${this.lineChangeLY(this.getYLeft(l.left,l.left.index),l.leftY,l)}
              C 500,${this.lineChangeLY(this.getYLeft(l.left,l.left.index),l.leftY,l)}
              500,${this.lineChangeRY(this.getYRight(l.right,l.right.index),l.rightY,l)}
              800,${this.lineChangeRY(this.getYRight(l.right,l.right.index),l.rightY,l)}
              L900,${this.lineChangeRY(this.getYRight(l.right,l.right.index),l.rightY,l)}
              900,${this.lineChangeRY(this.getYRight(l.right,l.right.index),l.rightY,l)+this.lineChangeRHeight(this.getHeightRight(l.right),l.rightHeight,l)}
              800,${this.lineChangeRY(this.getYRight(l.right,l.right.index),l.rightY,l)+this.lineChangeRHeight(this.getHeightRight(l.right),l.rightHeight,l)}
              C 500,${this.lineChangeRY(this.getYRight(l.right,l.right.index),l.rightY,l)+this.lineChangeRHeight(this.getHeightRight(l.right),l.rightHeight,l)}
              500,${this.lineChangeLY(this.getYLeft(l.left,l.left.index),l.leftY,l)+this.lineChangeLHeight(this.getHeightLeft(l.left),l.leftHeight,l)}
              200,${this.lineChangeLY(this.getYLeft(l.left,l.left.index),l.leftY,l)+this.lineChangeLHeight(this.getHeightLeft(l.left),l.leftHeight,l)}
              L100,${this.lineChangeLY(this.getYLeft(l.left,l.left.index),l.leftY,l)+this.lineChangeLHeight(this.getHeightLeft(l.left),l.leftHeight,l)}`;


      // if (this.hoverLeft) {
      //   return `M100,${l.leftY}
      //           L200,${l.leftY}
      //           C 500,${l.leftY} 500,${this.getYRight(l.right,l.right.index)} 800,${this.getYRight(l.right,l.right.index)}
      //           L900,${this.getYRight(l.right,l.right.index)} 900,${this.getYRight(l.right,l.right.index)+this.getHeightRight(l.right)} 800,${this.getYRight(l.right,l.right.index)+this.getHeightRight(l.right)}
      //           C 500,${this.getYRight(l.right,l.right.index)+this.getHeightRight(l.right)} 500,${l.leftY+l.leftHeight} 200,${l.leftY+l.leftHeight}
      //           L100,${l.leftY+l.leftHeight}`;
      // }
      // if (this.hoverRight) {
      //   return `M100,${this.getYLeft(l.left,l.left.index)}
      //           L200,${this.getYLeft(l.left,l.left.index)}
      //           C 500,${this.getYLeft(l.left,l.left.index)} 500,${this.getYRight(l.right,l.right.index)} 800,${this.getYRight(l.right,l.right.index)}
      //           L900,${this.getYRight(l.right,l.right.index)} 900,${this.getYRight(l.right,l.right.index)+this.getHeightRight(l.right)} 800,${this.getYRight(l.right,l.right.index)+this.getHeightRight(l.right)}
      //           C 500,${this.getYRight(l.right,l.right.index)+this.getHeightRight(l.right)} 500,${this.getYLeft(l.left,l.left.index)+this.getHeightLeft(l.left)} 200,${this.getYLeft(l.left,l.left.index)+this.getHeightLeft(l.left)}
      //           L100,${this.getYLeft(l.left,l.left.index)+this.getHeightLeft(l.left)}`;
      // }
      // return `M100,${l.leftY}
      //         L200,${l.leftY}
      //         C 500,${l.leftY} 500,${l.rightY} 800,${l.rightY}
      //         L900,${l.rightY} 900,${l.rightY+l.rightHeight} 800,${l.rightY+l.rightHeight}
      //         C 500,${l.rightY+l.rightHeight} 500,${l.leftY+l.leftHeight} 200,${l.leftY+l.leftHeight}
      //         L100,${l.leftY+l.leftHeight}`;
    },
    init() {
      this.left=[];
      this.right=[];
      this.lines=[];
      this.leftTotal=0;
      this.rightTotal=0;

      let left={};
      let right={};
      let colorlist={};


      let leftindex={};
      let rightindex={};
      this.list.forEach((n)=>{

        if(left[n.machina])
        {
          left[n.machina]+=n.value;
        }
        else
        {
          left[n.machina]=n.value;
        }

        if(colorlist[n.machina])
        {
        }
        else
        {
          colorlist[n.machina]=color.randomColor();
        }

        if(right[n.area])
        {
          right[n.area]+=n.value;
        }
        else
        {
          right[n.area]=n.value;
        }

        if(leftindex[n.machina])
        {
          leftindex[n.machina]+=1;
        }
        else
        {
          leftindex[n.machina]=1;
        }
        if(rightindex[n.area])
        {
          rightindex[n.area]+=1;
        }
        else
        {
          rightindex[n.area]=1;
        }

        let l={};
        let r={};
        this.lines.push(Object.assign({color:colorlist[n.machina],
                                      leftindex:leftindex[n.machina],
                                      rightindex:rightindex[n.area]
                                      },n));
      });
      let lineleft={};
      let lineright={};
      for (var key in left) {
        if (left.hasOwnProperty(key)) {
          this.left.push({name:key,value:left[key]});
          this.leftTotal+=left[key];

        }
      }
      this.left=this.left.map((n,index,arr)=>{
        n.height=this.getHeight(n.value,this.leftTotal,arr);
        n.y=this.getY(index,this.leftTotal,arr);
        n.movement_height=n.height;
        n.movement_y=n.y;
        n.index=index;
        lineleft[n.name]=n;
        return n;
      })
      for (var key in right) {
        if (right.hasOwnProperty(key)) {
          this.right.push({name:key,value:right[key]});
          this.rightTotal+=right[key];
        }
      }
      this.right=this.right.map((n,index,arr)=>{
        n.height=this.getHeight(n.value,this.rightTotal,arr);
        n.y=this.getY(index,this.rightTotal,arr);
        n.movement_height=n.height;
        n.movement_y=n.y;
        n.index=index;
        lineright[n.name]=n;
        return n;
      })
      this.lines=this.lines.map((m)=>{
        m.left=lineleft[m.machina];
        m.right=lineright[m.area];

        m.leftY=this.getYLine(m.leftindex,this.lines.filter(i=>i.machina==m.machina),m.left);
        m.rightY=this.getYLine(m.rightindex,this.lines.filter(i=>i.area==m.area),m.right);
        m.leftHeight=this.getHeightLine(m.value,this.leftTotal,this.left);
        m.rightHeight=this.getHeightLine(m.value,this.rightTotal,this.right);


        m.movement_lheight=m.leftHeight;
        m.movement_ly=m.leftY;

        m.movement_rheight=m.rightHeight;
        m.movement_ry=m.rightY;

        return m;
      });
      console.log(this.$data);
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
rect{
  fill:rgba(0,0,0,0.05)
}
.line{
  fill-opacity: 0.4;
  transition: fill-opacity 1s;
}
.hide{
  fill-opacity: 0;

}
</style>
