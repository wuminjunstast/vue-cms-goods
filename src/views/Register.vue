<template>
  <div class="bgImg">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>注册</span>
      </div>

      <el-form :model="form" :rules="rules" ref="form" label-width="60px" class="demo-ruleForm">
        <el-form-item label="账户" prop="username">
          <el-input v-model="form.username" placeholder="账户名长度为3到15个字符！" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model.number="form.password"
            placeholder="密码至少3位数字！"
            prefix-icon="el-icon-key"
            show-password
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="fullname">
          <el-input v-model="form.fullname" placeholder="请填写真实姓名！" prefix-icon="el-icon-postcard"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机" prop="tel">
          <el-input
            v-model.number="form.tel"
            placeholder="请填写常用手机号码！"
            prefix-icon="el-icon-mobile-phone"
          ></el-input>
        </el-form-item>
        <el-form-item prop="checked">
          <el-checkbox v-model="form.checked" label="同意本站用户协议"></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="submitForm('form')">注册</el-button>
        </el-form-item>
      </el-form>
      <div class="bottom">
        <router-link to="/login">
          <el-button type="text">登录账户</el-button>
        </router-link>
        <el-button type="text">忘记密码？</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import {Account} from '@/api/index'
export default {
  data() {
    const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
    var phone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (phoneReg.test(value)) {
            callback();
          } else {
            callback(new Error("电话号码格式不正确"));
          }
        }
      }, 1000);
    };
    return {
      form: {
        username: "",
        password: "",
        fullname: "",
        sex: "男",
        tel: "",
        checked: "",
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
        fullname: [
          { required: true, message: "请输入姓名！", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur",
          },
        ],
        sel: [{ required: true, message: "请选择性别", trigger: "change" }],
        tel: [{ required: true, validator: phone, trigger: "blur" }],
        checked: [
          {
            required: true,
            message: "请勾选同意本站用户协议",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
					if (!valid) return false;
					let { status, msg,data } = await Account.register({ ...this.form });
					if (status) {
						sessionStorage.token = data.token;
						sessionStorage.id = data.id;
						sessionStorage.role = data.role;
						this.$message.success(msg);
            this.$router.replace('/goods/list');
            //能跳转到注册页面的不存在非法进入

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