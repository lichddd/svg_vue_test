<template>
  <div class="props">
    <div class="title">
      属性
    </div>
    <div class="continer">
      <template v-if="item">


          <template  v-for="(v,k) in item">
          {{k}}:　
          <p  v-if="!(k=='width'||k=='height'||k=='x'||k=='y'||k=='color'||k=='point_num')">{{k}}:　{{v}}</p>
          <input v-if="k=='width'||k=='height'||k=='x'||k=='y'||k=='color'||k=='point_num'" :type="k=='color'?'color':'text'" v-model="item[k]"></input>
      </template></template>


    </div>
  </div>
</template>

<script>
export default {
  name: 'props',
  data(){
    return {
      item:null,
    };
  },
  mounted()
  {
  },
  methods:{
    changeItem(data)
    {
      this.item=data;
    }
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
