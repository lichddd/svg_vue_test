<template>
  <div class="buttonbar">
    <button v-if="state.zoomin" type="button" name="button" @click="$emit('COMMOND','zoomin')">zoomin</button>
    <button v-if="state.zoomout" type="button" name="button" @click="$emit('COMMOND','zoomout')">zoomout</button>
    <button v-if="state.zoom1" type="button" name="button" @click="$emit('COMMOND','zoom1')">1:1</button>
    <button v-if="state.center" type="button" name="button" @click="$emit('COMMOND','center')">center</button>
    <button v-if="state.delete" type="button" name="button" @click="$emit('COMMOND','del')">del</button>
    <button v-if="state.undo" type="button" name="button" @click="$emit('COMMOND','undo')">undo</button>
    <button v-if="state.redo" type="button" name="button" @click="$emit('COMMOND','redo')">redo</button>
  </div>
</template>

<script>
import router from '@/router'
export default {
  name: 'App',
  data(){
    return {
      state:{},
    };
  },
  mounted()
  {
  },
  methods:{
    updateState(data)
    {
      this.$set(this,'state',data);
    },
  }
}
</script>

<style scoped="">
.buttonbar{
  width: 100%;
  height: 40px;
  border: 1px solid #E9E9E9;
    box-shadow: 0px 8px 12px 0px rgba(0, 52, 107, 0.04);
}
</style>
