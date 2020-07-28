<template>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    background-color="#31404e"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <div class="loginImg">
      <i class="el-icon-s-fold" @click="flag = !flag"></i>
      <!-- <el-button icon="el-icon-s-fold"></el-button> -->

    </div>

    <div class="user-info">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <el-avatar size="small" class="user-avatar" :src="userData.avatar"></el-avatar>
          {{userData.username}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="dropdown-box">
          <el-dropdown-item command="msg">消息</el-dropdown-item>
          <el-dropdown-item command="setting">设置</el-dropdown-item>
          <el-dropdown-item command="exit">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { Account } from "@/api/index";
export default {
  data() {
    return {
      userData: [],
      flag: false,
    };
  },
  async created() {
    // 获取用户信息，显示在右上角上
    let { status, data } = await Account.info({ id: sessionStorage.id });
    this.userData = data;
  },
  methods: {
    handleCommand(command) {
      // 点击退出后，清空session，并跳转到登录页面
      if (command === "exit") {
        this.$router.replace("/login");

        sessionStorage.clear();
      }

      // this.$message("click on item " + command);
    },
  },
};
</script>

<style lang="less" scope>
header.el-header {
  padding: 0;
}

.el-menu-demo {
  display: flex;
  position: relative;
}

.loginImg {
  background: url(../assets/img/logo.png) center no-repeat;
  background-size: 90%;
  line-height: 60px;
  width: 200px;
}

.el-icon-s-fold {
  margin-left: 200px;
  color: white;
}

.user-info {
  position: absolute;
  right: 20px;
  line-height: 60px;
}

.el-dropdown-link {
  line-height: 60px !important;
  position: relative;
  color: white;

  .user-avatar {
    position: absolute;
    left: -40px;
    top: -5px !important;
  }
}

.el-dropdown-menu__item {
  width: 150px;
}
</style>