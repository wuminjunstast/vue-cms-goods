<template>
  <div class="bgImg">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>欢迎登录</span>
      </div>

      <el-form :model="form" :rules="rules" ref="form" label-width="60px" class="demo-ruleForm">
        <el-form-item label="账户" prop="username">
          <el-input v-model="form.username" placeholder="请输入账户名！" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model.number="form.password"
            placeholder="请输入密码！"
            required
            prefix-icon="el-icon-key"
            show-password
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="submitForm('form')">登录</el-button>
        </el-form-item>
      </el-form>
      <div class="bottom">
        <router-link to="/register">
          <el-button type="text">注册账户</el-button>
        </router-link>
        <el-button type="text">忘记密码？</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { Account } from "@/api/index";
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入账户名！", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码！", trigger: "blur" },
          {
            pattern: /^\d{3,}$/,
            message: "长度最少为3个数字",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return false;
        let { status, msg, data } = await Account.login({ ...this.form });
        if (status) {
          // console.log(data);
          // 存储token，userid，role
          sessionStorage.token = data.token;
          sessionStorage.id = data.id;
          sessionStorage.role = data.role;
          this.$message.success(msg);
          // 是否有redirect参数？非法进入子页面时携带的路径
          let { redirect } = this.$route.query;
          if (redirect) {
            this.$router.replace(redirect);
          } else {
            // 默认跳转路由
            this.$router.replace("/goods/list");
          }
        } else {
          this.$message.error(msg);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.bgImg {
  background: url(../assets/img/login-bg.jpg) top center no-repeat;
  height: 100vh;
  background-size: cover;
  position: relative;
}

.box-card {
  width: 360px;
  position: absolute;
  right: 7%;
  top: 50%;
  transform: translateY(-50%);
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;

  .el-button--text {
    color: #666;
    font-size: 14px;
  }
}
</style>