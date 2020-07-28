<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    router
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-submenu v-for="(item,num) in treeData" :key="item.id" index="num">
      <template slot="title">
        <i :class="'el-icon-' + item.icon"></i>
        <span>{{item.name}}</span>
      </template>
     <el-menu-item v-for="option in item.children" :key="option.id" :index="option.path" :icon="'el-icon-' + option.icon">{{option.name}}</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import {Menu} from '@/api/index'
export default {
  data() {
    return {
      treeData:[]
    };
  },
  async created(){
    // 获取树形菜单信息
    let {status,data} = await Menu.list({id:sessionStorage.id});
    if(!status) return false;
    this.treeData = data;
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style lang="less" scope>
.el-menu-vertical-demo {
  height: calc(100vh - 60px);
  position: fixed;
  top: 0px;
  left: 0;
}
</style>