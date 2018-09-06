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
      points+=this.getAngel(i,point_num).x*width;
      points+=',';
      points+=this.getAngel(i,point_num).y*height;
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
  getPointsAnchor(item){
    let arr=[];
    let count=item.point_num%4==0?4:3;
    for (var i = 0; i < count; i++) {
      let ang=i*item.point_num/count;
      ang=(ang%1>0.5)?Math.ceil(ang):Math.floor(ang);
      arr.push({x:this.getAngel(ang,item.point_num).x*item.width,y:this.getAngel(ang,item.point_num).y*item.height});
    }
    return arr;
  },
  getPathAnchor(item){
    let arr=[];
    item.anchors.forEach((i)=>{
      let x=i.x;
      let y=i.y;
      if (x.indexOf('width')>-1) {
        x=x.replace(/width/ig,item.width);
        x=eval(x);
      }
      if (y.indexOf('height')>-1) {
        y=y.replace(/height/ig,item.height);
        y=eval(y);
      }
      arr.push({x:x,y:y});
    });
    return arr;
  }


}
