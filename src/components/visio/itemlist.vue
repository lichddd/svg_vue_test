<template>
  <div class="itemlist" :class="{'add-cursor':add_item}">
    <svg
    v-for="item in item_list"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="`0 0 ${width} ${width}`"
    version="1.1"
    preserveAspectRatio="xMid yMid meet"
    @mousedown.stop="add(item)"
    >
      <g :transform="`translate(${width/2},${width/2})`">



        <ellipse v-if="item.shape=='ellipse'"

        cx="0"

        cy="0"

        :rx="800/2*item.width/(Math.max(item.width,item.height))"

        :ry="800/2*item.height/(Math.max(item.width,item.height))"
        :fill="item.color"
        ></ellipse>
        <rect v-if="item.shape=='rect'"

        :x="-(800/2*item.width/(Math.max(item.width,item.height)))"

        :y="-(800/2*item.height/(Math.max(item.width,item.height)))"

        :rx="800*item.radius/(Math.max(item.width,item.height))"

        :ry="800*item.radius/(Math.max(item.width,item.height))"

        :width="800*item.width/(Math.max(item.width,item.height))"

        :height="800*item.height/(Math.max(item.width,item.height))"
        :fill="item.color"
        ></rect>
        <!-- <polygon v-if="item.shape=='polygon'" points="0,-300 400,0 0,300 -400,0"/> -->
        <polygon v-if="item.shape=='polygon'" :fill="item.color" :points="getPoints(item.width,item.height,item.point_num)"/>
        <path v-if="item.shape=='path'" :fill="item.color" :d="getD(item.width,item.height,item.d)"/>

      </g>
      </svg>
  </div>
</template>

<script>
import color from '@/util/color'
export default {
  name: 'itemlist',
  props:{
    show_default_items:{
      type:Boolean,
      default:true,
    },
    custom_items:{
      type:Array,
      default(){
        return [
      {name:"分叉节点",shape:"polygon",width:80,height:50,point_num:5,color:color.randomColor()},
      {name:"分叉节点",shape:"polygon",width:80,height:80,point_num:6,color:color.randomColor()},
      {name:"分叉节点",shape:"polygon",width:80,height:50,point_num:7,color:color.randomColor()},
      // {name:"分叉节点",shape:"polygon",width:"80",height:"50",point_num:5},
      //         {name:"分叉节点",shape:"polygon",width:"80",height:"80",point_num:6},
      //                 {name:"分叉节点",shape:"polygon",width:"80",height:"50",point_num:7},
      //                 {name:"分叉节点",shape:"polygon",width:"80",height:"50",point_num:5},
      //                         {name:"分叉节点",shape:"polygon",width:"80",height:"80",point_num:6},
      //                                 {name:"分叉节点",shape:"polygon",width:"80",height:"50",point_num:7},
        ];
      },

    },

  },
  data(){
    return {
      width:1000,
      gap:100,
      default_items:[
        {name:"常规节点",shape:"rect",width:80,height:60,radius:10,color:"#321455"},
        //ellipse形状如要正圆肯定是长宽相等
        {name:"起止节点",shape:"ellipse",width:80,height:60,color:"#3ff455"},
        //polygon多边形形状会按照长宽和节点数生成节点以中心平均分布在360°上
        {name:"分叉节点",shape:"polygon",width:80,height:50,point_num:4,color:"#321ff5"},
        //path形状的d属性为一个路径里面需要有长宽属性作为变量 写作 @width/2@ @height*2@ 用@与普通文本分隔开
        {name:"模型节点",shape:"path",width:80,height:40,color:"#3ffff5",
        d:"M-@width/4@,-@height/2@ H@width/4@ A@width/4@,@height/2@,0,0,1,@width/4@,@height/2@  H-@width/4@ A@width/4@,@height/2@,0,0,1,-@width/4@,-@height/2@",
        anchors:[ {x:-1/2,y:0},
                  {x:0,y:-1/2},
                  {x:1/2,y:0},
                  {x:0,y:1/2},
                ]},
      ],
      add_item:null,
    };
  },
  mounted()
  {
    document.addEventListener('mouseup', this.removeAdd);
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.removeAdd);
  },
  computed:{
    item_list(){
      if (this.show_default_items) {
        return [...this.default_items,...this.custom_items];
      } else {
        return [...this.custom_items];
      }


    }
  },
  methods:{
    getAngel(value, total) {
      return {
        x: Math.sin(Math.PI * 2 * value / total),
        y: Math.cos(Math.PI * 2 * value / total) * -1,
      };
    },
    getPoints(width,height,point_num){
      let points="";
      for (var i = 0; i < point_num; i++) {
        points+=(this.width/2-this.gap)*this.getAngel(i,point_num).x*width/(Math.max(width,height));
        points+=',';
        points+=(this.width/2-this.gap)*this.getAngel(i,point_num).y*height/(Math.max(width,height));
        points+=" ";
      }
      return points;
    },
    getD(width,height,d){
      d=d.split("@");
      for (var i = 0; i < d.length; i++) {
        if (d[i].indexOf('width')>-1||d[i].indexOf('height')>-1) {
          let t=d[i].replace(/width/ig,(this.width-this.gap*2)*width/(Math.max(width,height))).replace(/height/ig,(this.width-this.gap*2)*height/(Math.max(width,height)));
          d[i]=eval(t);
        }
      }
      return d.join("");
    },


    add(item){
      this.add_item=Object.assign({
              x: -9999,
              y: -9999,
              }, item);
      this.$emit('ADD',this.add_item);
    },
    removeAdd(){
      this.add_item=null;
      this.$emit('REMOVE_ADD');
    }
  }
}
</script>

<style scoped="">
.itemlist{
  width: 100%;
  height: 100%;
  background: #F7F9FB;
  border-right: 1px solid #E6E9ED;
  overflow-y: auto;
}
.itemlist svg{
  cursor: pointer;
}
.add-cursor.itemlist svg{
  cursor: copy!important;
}
svg{
  width: 50%;
}

</style>
