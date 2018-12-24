export default {
  randomColor()
  {
    let color=Math.floor((Math.random()*0xffffff)).toString(16);
    while(color.length<6)
    {
      color="0"+color;
    }
    return `#${color}`;
  }
}
