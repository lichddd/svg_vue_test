<template>
  <div class="props">
    <div class="title">
      属性
    </div>
    <div class="continer">
      <template v-if="item">


          <template  v-for="(v,k) in item" v-if="(k=='width'||k=='height'||k=='x'||k=='y'||k=='color'||k=='name')">
          {{k}}:　
          <p  v-if="!(k=='width'||k=='height'||k=='x'||k=='y'||k=='color'||k=='name')">{{v}}</p>
          <input v-if="k=='width'||k=='height'||k=='x'||k=='y'" type="number" v-model.number="item[k]"></input>
          <input v-if="k=='color'" type="color" v-model="item[k]"></input>
          <input v-if="k=='name'" type="text" v-model="item[k]"></input>
      </template></template>
      <template v-if="edge">

        {{edge.from&&edge.from.item.name}}->{{edge.to&&edge.to.item.name}}

      </template>

    </div>
  </div>
</template>

<script>
export default {
  name: 'props',
  props:{
    item:{
      type:Object,
      default(){
        return null;
      },
    },
    edge:{
      type:Object,
      default(){
        return null;
      },
    },
  },
  data(){
    return {
    };
  },
  mounted()
  {
  },
  methods:{

  }
}
</script>

<style scoped="">
.props{
  width: 100%;
  height: 100%;
  background: #F7F9FB;
  border-right: 1px solid #E6E9ED;
}
.title
{
  width: 100%;
  height: 30px;
  border-bottom: 1px solid #DCE3E8;
background: #EBEEF2;
padding: 5px;
}
.continer{
  height: calc(100% - 30px);
  overflow-y: auto;
}
</style>
