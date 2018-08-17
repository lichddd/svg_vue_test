<template>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" version="1.1" preserveAspectRatio="xMid yMid meet">
  <g transform="translate(500,500)">
    <g stroke="#222222" stroke-width="2" fill="rgba(100,100,100,0.1)">
      <circle v-for="c in circle" :r="c"></circle>
      <text v-for="t in circle" x="5" :y="-t+20" fill="none" stroke="#ffffff" stroke-width="5">{{t}}</text>
      <text v-for="t in circle" x="5" :y="-t+20">{{t}}</text>
      <path v-for="l in lines" class="tick-line" fill="none" :d="`M0,0 L${l.ex},${l.ey}Z`" style="stroke: rgb(255, 255, 255); stroke-width: 2;"></path>
    </g>
<path v-for="p in paths" class="radar-line" :fill="`#${p.color}`" :stroke="`#${p.color}`" fill-opacity="0.2" :d="p.line" ></path>
  </g>
  </svg>
</template>
<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      list: [],
      tags: [{
          value: "a",
          label: "A",
        },
        {
          value: "b",
          label: "B",
        },
        {
          value: "c",
          label: "C",
        },
        {
          value: "d",
          label: "D",
        },
        {
          value: "e",
          label: "E",
        },
      ],
    }
  },
  mounted(){
    for (var i = 0; i < 8; i++) {
      this.list.push({a:Math.random()*500,b:Math.random()*500,c:Math.random()*500,d:Math.random()*500,e:Math.random()*500});
    }




  },
  methods: {
    getAngelByIndex(inx, tags) {
      return {
        x: Math.sin(Math.PI * 2 * inx / tags.length),
        y: Math.cos(Math.PI * 2 * inx / tags.length) * -1,
      };
    },
    getAngelByCode(code, tags) {
      let inx = tags.findIndex((value, index, arr) => {
        return value.value == code;
      });
      return {
        x: Math.sin(Math.PI * 2 * inx / tags.length),
        y: Math.cos(Math.PI * 2 * inx / tags.length) * -1,
      };
    },
  },
  computed: {
    circle() {
      return [50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
    },
    paths() {
      let arr = [];
      this.list.forEach((a) => {
        arr.push(Object.assign(a));
      })
      arr.forEach((a, i) => {
        let r = [];
        for (var v in a) {
          if (a.hasOwnProperty(v)) {
            r.push(`${this.getAngelByCode(v,this.tags).x*a[v]},${this.getAngelByCode(v,this.tags).y*a[v]}`);
          }
        }
        a.line = `M${r.join('L')}Z`;
        let color=Math.floor((Math.random()*0xffffff)).toString(16);
        while(color.length<6)
        {
          color="0"+color;
        }
        a.color=color;
      });
      return arr;
    },
    lines() {
      let arr = [];
      this.tags.forEach((t, i) => {
        arr.push({
          value: t.value,
          name: t.label,
          sx: 0,
          sy: 0,
          ex: this.getAngelByIndex(i, this.tags).x * 500,
          ey: this.getAngelByIndex(i, this.tags).y * 500,
        });
      })
      return arr;
    }
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
  transition: fill-opacity 0.5s,stroke-width 0.5s;
}

.radar-line:hover {
  fill-opacity: 0.8;
  stroke-width: 5;
  z-index: 1;
}
/* .radar-line:hover+.radar-line {
  fill-opacity: 0.1;
} */
</style>
