<template>
  <el-container>
    <el-header>
        <NavBer/>
    </el-header>
    <el-container>
      <el-aside width="200px">
          <LeftMenu/>
      </el-aside>
      <el-main>
          <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import NavBer from '@/components/NavBar.vue'
import LeftMenu from '@/components/LeftMenu.vue'

export default {
    components:{
        NavBer,
        LeftMenu,
    }
}
</script>

<style lang="less" scope>
  header.el-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 1001;
  }

  .el-aside {
    position: fixed;
    top: 60px;
    left: 0;
  }

  .el-main {
    margin-left: 200px;
    margin-top: 60px;
  }
</style>