export default {
  getAngel(value, total) {
    return {
      x: Math.sin(Math.PI * 2 * value / total),
      y: Math.cos(Math.PI * 2 * value / total) * -1,
    };
  },
  getPoints(width,height,point_num){
    let points="";
    for (var i = 0; i < point_num; i++) {
      points+=this.getAngel(i,point_num).x*width/2;
      points+=',';
      points+=this.getAngel(i,point_num).y*height/2;
      points+=" ";
    }
    return points;
  },
  getD(width,height,d){
    d=d.split("@");
    for (var i = 0; i < d.length; i++) {
      if (d[i].indexOf('width')>-1||d[i].indexOf('height')>-1) {
        let t=d[i].replace(/width/ig,width).replace(/height/ig,height);
        d[i]=eval(t);
      }
    }
    return d.join("");
  },
  getAllAnchors(data){
    switch (data.shape) {
      case 'rect':
        return [{x:-1/2,y:0},{x:1/2,y:0},{x:0,y:-1/2},{x:0,y:1/2},]
        break;
      case 'ellipse':
        return [{x:-1/2,y:0},{x:1/2,y:0},{x:0,y:-1/2},{x:0,y:1/2},]
        break;
      case 'polygon':
        let arr=[];
        let count=data.point_num%4==0?4:3;
        for (var i = 0; i < count; i++) {
          let ang=i*data.point_num/count;
          ang=(ang%1>0.5)?Math.ceil(ang):Math.floor(ang);
          arr.push({x:Number(this.getAngel(ang,data.point_num).x.toFixed(2))/2,y:Number(this.getAngel(ang,data.point_num).y.toFixed(2))/2});
        }
        return arr;
        break;
      default:
        return []
    }
  },
  getEdge(startitem,startindex,enditem,endindex){

      let xs = startitem.x + startitem.anchors[startindex].x * startitem.width;
      let ys = startitem.y + startitem.anchors[startindex].y * startitem.height;

      let origin_end_item=enditem;
      if (endindex!=null) {
        enditem={
          px:origin_end_item.x+origin_end_item.width*enditem.anchors[endindex].x,
          py:origin_end_item.y+origin_end_item.height*enditem.anchors[endindex].y,
          x:origin_end_item.x+origin_end_item.width*enditem.anchors[endindex].x+20*enditem.anchors[endindex].x/(Math.abs(enditem.anchors[endindex].x)||1),
          y:origin_end_item.y+origin_end_item.height*enditem.anchors[endindex].y+20*enditem.anchors[endindex].y/(Math.abs(enditem.anchors[endindex].y)||1),
        };

      }
      enditem=enditem||{x:xs,y:ys};

      let arr = []
      if (startitem.anchors[startindex].x > 0) {
        arr.push(`${Math.max(xs+20,enditem.x)},${ys}`);
        if (enditem.x < (xs + 20)) {
          if (enditem.y < (startitem.y + startitem.height/2+20) && enditem.y > (startitem.y - startitem.height/2-20)) {

            arr.push(`${xs+20},${enditem.y}`);
            if (enditem.y > startitem.y) {
              arr.push(`${xs+20},${startitem.y+startitem.height/2+20}`);
              arr.push(`${enditem.x},${startitem.y+startitem.height/2+20}`);
            } else {
              arr.push(`${xs+20},${startitem.y-startitem.height/2-20}`);
              arr.push(`${enditem.x},${startitem.y-startitem.height/2-20}`);
            }
          } else {
            arr.push(`${xs+20},${enditem.y}`);
          }
        }



      } else if (startitem.anchors[startindex].x < 0) {
        arr.push(`${Math.min(xs-20,enditem.x)},${ys}`);

        if (enditem.x > (xs - 20)) {
          if (enditem.y < (startitem.y + startitem.height/2+20) && enditem.y > (startitem.y - startitem.height/2-20)) {

            arr.push(`${xs-20},${enditem.y}`);
            if (enditem.y > startitem.y) {
              arr.push(`${xs-20},${startitem.y+startitem.height/2+20}`);
              arr.push(`${enditem.x},${startitem.y+startitem.height/2+20}`);
            } else {
              arr.push(`${xs-20},${startitem.y-startitem.height/2-20}`);
              arr.push(`${enditem.x},${startitem.y-startitem.height/2-20}`);
            }
          } else {
            arr.push(`${xs-20},${enditem.y}`);
          }
        }



      } else {
        if (startitem.anchors[startindex].y > 0) {
          arr.push(`${xs},${Math.max(ys+20,enditem.y)}`);

          if (enditem.y < (ys + 20)) {
            if (enditem.x < (startitem.x + startitem.width/2+20) && enditem.x > (startitem.x - startitem.width/2-20)) {

              arr.push(`${enditem.x},${ys+20}`);
              if (enditem.x > startitem.x) {
                arr.push(`${startitem.x+startitem.width/2+20},${ys+20}`);
                arr.push(`${startitem.x+startitem.width/2+20},${enditem.y}`);
              } else {
                arr.push(`${startitem.x-startitem.width/2-20},${ys+20}`);
                arr.push(`${startitem.x-startitem.width/2-20},${enditem.y}`);
              }
            } else {
              arr.push(`${enditem.x},${ys+20}`);
            }
          }

        } else if (startitem.anchors[startindex].y < 0) {
          arr.push(`${xs},${Math.min(ys-20,enditem.y)}`);
          if (enditem.y > (ys - 20)) {
            if (enditem.x < (startitem.x + startitem.width/2+20) && enditem.x > (startitem.x - startitem.width/2-20)) {
              arr.push(`${enditem.x},${ys-20}`);
              if (enditem.x > startitem.x) {
                arr.push(`${startitem.x+startitem.width/2+20},${ys-20}`);
                arr.push(`${startitem.x+startitem.width/2+20},${enditem.y}`);
              } else {
                arr.push(`${startitem.x-startitem.width/2-20},${ys-20}`);
                arr.push(`${startitem.x-startitem.width/2-20},${enditem.y}`);
              }
            } else {
              arr.push(`${enditem.x},${ys-20}`);
            }
          }

        }
      }
      let endpoint=``;
      if (endindex!=null) {
        endpoint=`${enditem.px},${enditem.py}`;
      }
    return `M${xs},${ys} L${arr.join(' ')} ${enditem.x},${enditem.y} ${endpoint}`;
  }
  ,

  getArrow(to){
    let tx=to.item.anchors[to.index].x/(Math.abs(to.item.anchors[to.index].x)||1);
    let ty=to.item.anchors[to.index].y/(Math.abs(to.item.anchors[to.index].y)||1);
    let pi=Math.atan2(ty,tx)+Math.PI/2;
    let p=`${0},${0} ${20*this.getAngel(pi-Math.PI/6,Math.PI*2).x+','+20*this.getAngel(pi-Math.PI/6,Math.PI*2).y},${20*this.getAngel(pi+Math.PI/6,Math.PI*2).x+','+20*this.getAngel(pi+Math.PI/6,Math.PI*2).y}`;
    return p;
  }

}
