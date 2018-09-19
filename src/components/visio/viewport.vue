<template>
<div class="viewport" @mousemove.stop="onMouseMove($event)" @mouseup="onMouseUp($event)">
  <div class="fixed">
    <svg xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10000 10000"
      version="1.1"
      preserveAspectRatio="xMid yMid meet"
      @mousemove="onAddMove($event)"
      @mousedown.stop="draging=true;"
      @wheel.stop="onWheel($event.deltaY)"
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


              <g v-for="d in edgelist" class="edge" :class="{'select':d==selectedge,'notouch':drawitem?true:false}" @click.stop="selectedge=d;selectitem=null;" >
                <path :d="util.getEdge(d.from.item,d.from.index,d.to.item,d.to.index)"></path>
                <polygon
                :transform="`translate(${d.to.item.x+d.to.item.width*d.to.item.anchors[d.to.index].x},
                                       ${d.to.item.y+d.to.item.height*d.to.item.anchors[d.to.index].y})`"
                :points="util.getArrow(d.to)"/>
              </g>
              <itemnode v-for="i in itemlist"
              :item='i'
              :selectitem='selectitem'
              @mousedown.stop.native="dragitem=i"
              @click.stop.native="selectitem=i;selectedge=null;"
              @DRAW_ANCHOR="(item,index)=>{drawitem=i;drawindex=index;}"
              @DRAW_ANCHOR_FINISH="(item,index)=>{drawFinish(item,index)}"
              :class="{'drawing':drawitem?true:false}"
              :drawindex="drawindex"
              :drawitem="drawitem"
              :scale="position.scale"
              ></itemnode>





              <path class="drawline" v-if="drawitem?true:false" :d="util.getEdge(drawitem,drawindex,drawPoint)"></path>
              <itemnode
              v-if="add_item"
              :item='add_item'
              style="cursor:copy!important;"

              ></itemnode>

            </g>
    </svg>
  </div>


</div>
</template>

<script>
import color from '@/util/color'
import util from './util'
import itemnode from './itemnode'
export default {
  name: 'viewport',
  components: {
    itemnode,
  },
  props:{
    add_item:{
      type:Object,
      default(){
        return {};
      },
    },
  },
  data() {
    return {
      draging: false,
      linking: false,
      prePoint: null,
      dragitem: null,
      drawitem: null,
      drawline: '',
      drawPoint: null,
      drawindex: 0,
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
      edgelist:[],
      selectedge:null,
      util: util,
      redolist:[],
      undolist:[],
    };
  },
  mounted() {
    this.doChange();
    this.changeState();
    this.$emit('POSITION',this.position);
    document.addEventListener('keyup', this.pressKey);
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.pressKey);
  },
  methods: {
    pressKey(e) {
      switch (e.key) {
        case 'Backspace':
          this.del();
          break;
        case 'Delete':
          this.del();
          break;
        default:

      }
    },
    commond(code) {
      switch (code) {
        case 'del':
          this.del();
          break;
        case 'zoomin':
          this.onWheel(1);
          break;
        case 'zoomout':
          this.onWheel(-1);
          break;
        case 'zoom1':
          this.scaleTo1();
          break;
        case 'center':
          this.moveToCenter();
          break;
          case 'redo':
            this.redo();
            break;
            case 'undo':
              this.undo();
              break;
        default:
      }
    },
    del() {
      if (this.selectitem) {
        this.itemlist = this.itemlist.filter((l) => {
          if (l == this.selectitem) {
            return false;
          }
          return true;
        });
        this.edgelist=this.edgelist.filter((l) => {
          if (l.from.item == this.selectitem||l.to.item == this.selectitem) {
            return false;
          }
          return true;
        });
        this.selectitem = null;
      }
      if (this.selectedge) {
        this.edgelist = this.edgelist.filter((l) => {
          if (l == this.selectedge) {
            return false;
          }
          return true;
        });
        this.selectedge = null;
      }
      this.doChange();
    },
    onAddMove(e){
    if (this.add_item) {
      let x=e.offsetX/this.position.scale*2-5000;
      let y=e.offsetY/this.position.scale*2-5000;

      this.add_item.x=x;
      this.add_item.y=y;
    }


    },
    onMouseMove(e) {

      if (this.draging && this.prePoint) {
        let tx= this.position.x +(e.clientX - this.prePoint.x);
        let ty= this.position.y +(e.clientY - this.prePoint.y);
        this.position.x=(tx<=0?Math.max(tx,-this.position.width*this.position.scale/2):Math.min(tx,this.position.width*this.position.scale/2));
        this.position.y=(ty<=0?Math.max(ty,-this.position.width*this.position.scale/2):Math.min(ty,this.position.width*this.position.scale/2));
        this.changeState();
      }
      if (this.dragitem && this.prePoint) {
        this.dragitem.x += (e.clientX - this.prePoint.x) * 10000 / this.position.scale / this.position.width;
        this.dragitem.y += (e.clientY - this.prePoint.y) * 10000 / this.position.scale / this.position.width;
      }
      if (this.drawitem && this.prePoint) {



        let xs = this.drawitem.x + this.drawitem.anchors[this.drawindex].x * this.drawitem.width;
        let ys = this.drawitem.y + this.drawitem.anchors[this.drawindex].y * this.drawitem.height;
        if (this.drawPoint) {
          this.drawPoint.x += (e.clientX - this.prePoint.x) * 10000 / this.position.scale / this.position.width;
          this.drawPoint.y += (e.clientY - this.prePoint.y) * 10000 / this.position.scale / this.position.width;
        } else {
          this.drawPoint = {
            x: xs,
            y: ys
          };
        }

        let arr = []
        if (this.drawitem.anchors[this.drawindex].x > 0) {
          arr.push(`${Math.max(xs+20,this.drawPoint.x)},${ys}`);
          if (this.drawPoint.x < (xs + 20)) {
            if (this.drawPoint.y < (this.drawitem.y + this.drawitem.height+20) && this.drawPoint.y > (this.drawitem.y - this.drawitem.height-20)) {

              arr.push(`${xs+20},${this.drawPoint.y}`);
              if (this.drawPoint.y > this.drawitem.y) {
                arr.push(`${xs+20},${this.drawitem.y+this.drawitem.height+20}`);
                arr.push(`${this.drawPoint.x},${this.drawitem.y+this.drawitem.height+20}`);
              } else {
                arr.push(`${xs+20},${this.drawitem.y-this.drawitem.height-20}`);
                arr.push(`${this.drawPoint.x},${this.drawitem.y-this.drawitem.height-20}`);
              }
            } else {
              arr.push(`${xs+20},${this.drawPoint.y}`);
            }
          }



        } else if (this.drawitem.anchors[this.drawindex].x < 0) {
          arr.push(`${Math.min(xs-20,this.drawPoint.x)},${ys}`);

          if (this.drawPoint.x > (xs - 20)) {
            if (this.drawPoint.y < (this.drawitem.y + this.drawitem.height+20) && this.drawPoint.y > (this.drawitem.y - this.drawitem.height-20)) {

              arr.push(`${xs-20},${this.drawPoint.y}`);
              if (this.drawPoint.y > this.drawitem.y) {
                arr.push(`${xs-20},${this.drawitem.y+this.drawitem.height+20}`);
                arr.push(`${this.drawPoint.x},${this.drawitem.y+this.drawitem.height+20}`);
              } else {
                arr.push(`${xs-20},${this.drawitem.y-this.drawitem.height-20}`);
                arr.push(`${this.drawPoint.x},${this.drawitem.y-this.drawitem.height-20}`);
              }
            } else {
              arr.push(`${xs-20},${this.drawPoint.y}`);
            }
          }



        } else {
          if (this.drawitem.anchors[this.drawindex].y > 0) {
            arr.push(`${xs},${Math.max(ys+20,this.drawPoint.y)}`);

            if (this.drawPoint.y < (ys + 20)) {
              if (this.drawPoint.x < (this.drawitem.x + this.drawitem.width+20) && this.drawPoint.x > (this.drawitem.x - this.drawitem.width-20)) {

                arr.push(`${this.drawPoint.x},${ys+20}`);
                if (this.drawPoint.x > this.drawitem.x) {
                  arr.push(`${this.drawitem.x+this.drawitem.width+20},${ys+20}`);
                  arr.push(`${this.drawitem.x+this.drawitem.width+20},${this.drawPoint.y}`);
                } else {
                  arr.push(`${this.drawitem.x-this.drawitem.width-20},${ys+20}`);
                  arr.push(`${this.drawitem.x-this.drawitem.width-20},${this.drawPoint.y}`);
                }
              } else {
                arr.push(`${this.drawPoint.x},${ys+20}`);
              }
            }

          } else if (this.drawitem.anchors[this.drawindex].y < 0) {
            arr.push(`${xs},${Math.min(ys-20,this.drawPoint.y)}`);
            if (this.drawPoint.y > (ys - 20)) {
              if (this.drawPoint.x < (this.drawitem.x + this.drawitem.width+20) && this.drawPoint.x > (this.drawitem.x - this.drawitem.width-20)) {
                arr.push(`${this.drawPoint.x},${ys-20}`);
                if (this.drawPoint.x > this.drawitem.x) {
                  arr.push(`${this.drawitem.x+this.drawitem.width+20},${ys-20}`);
                  arr.push(`${this.drawitem.x+this.drawitem.width+20},${this.drawPoint.y}`);
                } else {
                  arr.push(`${this.drawitem.x-this.drawitem.width-20},${ys-20}`);
                  arr.push(`${this.drawitem.x-this.drawitem.width-20},${this.drawPoint.y}`);
                }
              } else {
                arr.push(`${this.drawPoint.x},${ys-20}`);
              }
            }

          }
        }


        this.drawline = `M${xs},${ys} L${arr.join(' ')} ${this.drawPoint.x},${this.drawPoint.y}`;
      }
      this.prePoint = {
        x: e.clientX,
        y: e.clientY
      };
    },
    onMouseUp() {
      if (this.add_item) {
        this.addItem(this.add_item);
      }
      this.doChange();


      this.draging = false;
      this.dragitem = null;
      this.selectitem = null;
      this.prePoint = null;
      this.drawPoint = null;
      this.drawitem = null;
      this.drawindex = 0;
      this.drawline = '';
      this.selectedge=null;
    },
    drawFinish(item,index)
    {
        this.edgelist.push({from:{item:this.drawitem,index:this.drawindex},to:{item:item,index:index}});

        this.doChange();
    },
    onWheel(val) {
      this.position.scale += val > 0 ? 0.1 : -0.1;
      this.position.scale = Math.min(Math.max(0.5, this.position.scale), 2);
      this.changeState();
    },
    scaleTo1() {
      this.position.scale = 1;
      this.changeState();
    },
    moveToCenter() {
      this.position.x = 0;
      this.position.y = 0;
    },
    addItem(data) {
      this.itemlist.push(Object.assign({
        anchors: util.getAllAnchors(data),
      },data));
      this.doChange();
      this.changeState();
    },
    changeState() {
      this.$nextTick(() => {

        this.$emit('STATE_CHANGE', {
          delete: (this.selectitem||this.selectedge) ? true : false,
          zoomin: this.position.scale < 2,
          zoomout: this.position.scale > 0.5,
          zoom1: this.position.scale != 1,
          center: this.position.x != 0 || this.position.y != 0,
          redo:this.redolist.length>0,
          undo:this.undolist.length>1,
        }, this.$el.getElementsByTagName('svg')[0].innerHTML);


      })

    },
    doChange(){
      let obj={itemlist:this.itemlist,edgelist:this.edgelist};
      if (this.undolist.length>1&&JSON.stringify(this.undolist[this.undolist.length-1])==JSON.stringify(obj)) {
      } else {
        this.undolist.push(JSON.stringify(obj));
        this.redolist=[];
      }
    },
    redo(){
      if (this.redolist.length>0) {
        let p=this.redolist.pop();
        this.undolist.push(p);
        p=JSON.parse(p);
        this.itemlist=p.itemlist;
        this.edgelist=p.edgelist;
        this.changeState();
      }
    },
    undo(){

      if (this.undolist.length>1) {
        let p=this.undolist.pop();
        this.redolist.push(p);
        p=JSON.parse(this.undolist[this.undolist.length-1]);
        this.itemlist=p.itemlist;
        this.edgelist=p.edgelist;
        this.changeState();
      }
    },
  },
  watch: {
    selectitem: {
      handler() {
        this.doChange();
        this.changeState();
      },
      deep: true,
    },
    selectedge: {
      handler() {
        this.doChange();
        this.changeState();
      },
      deep: true,
    },

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
.add-cursor .item{
  cursor: copy!important;
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
  stroke: #444444;
  stroke-width: 1;
  fill: #ffffff;
  cursor: crosshair;
}

.item:hover .anchor,
.item.select .anchor {
  opacity: 1;
}

.drawline {
  stroke: #5992ff;
  stroke-width: 10;
  fill: none;
  pointer-events: none;
}

.edge path{
  stroke: #444444;
  stroke-width: 3;
  fill: none;
  transition: stroke-width 0.5s,stroke 0.5s,;
  cursor: pointer;
}
.edge polygon
{
  fill: #444444;
  transition: fill 0.5s;
  cursor: pointer;
}
.edge:hover path
{
  stroke: #5992ff;
}
.edge:hover polygon
{
  fill: #5992ff;
}
.edge.select path
{
  stroke: #5992ff;
  stroke-width:5;
}
.edge.select polygon
{
  fill: #5992ff;
}
.notouch{
  pointer-events: none;
}
</style>
