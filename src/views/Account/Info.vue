<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>账户信息</span>
    </div>

    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
      <el-form-item label="账户" class="text-left">
        <el-input v-model="form.username" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="fullname">
        <el-input v-model="form.fullname" placeholder="请填写真实姓名！"></el-input>
      </el-form-item>
      <el-form-item label="性别" required>
        <el-radio-group v-model="form.sex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机" prop="tel">
        <el-input v-model.number="form.tel" placeholder="请填写常用手机号码！"></el-input>
      </el-form-item>
      <el-form-item label="权限" required>
        <el-select v-model="form.role" placeholder="请选择权限" prop="role_name">
          <el-option
            v-for="option in roleList"
            :key="option.id"
            :label="option.name"
            :value="option.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="头像" required>
        <upload :img="[form.avatar,'/api/upload/avatar','src']" @onhandleImg="handleImg"></upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="medium" @click="submitForm('form')">修改</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import upload from "@/components/Upload";
import { Account, Role } from "@/api/index";
export default {
  components: {
    upload,
  },
  data() {
    const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
    var phone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      }
      setTimeout(() => {
        if (phoneReg.test(value)) {
          callback();
        } else {
          callback(new Error("电话号码格式不正确"));
        }
      }, 1000);
    };
    return {
      form: {},
      // 保存权限角色胡数组
      roleList: [],
      rules: {
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
        role_name: [
          { required: true, message: "请选择权限", trigger: "change" },
        ],
      },
    };
  },
  async created() {
    // 没有接收修改权限角色的API

    // 获取所有权限角色
    let { status, data } = await Role.list();
    if (!status) return false;
    this.roleList = data;
    // 获取当前账户胡详细信息
    // 这一步若是放在mounted里边同样可以使用，但mounted已经渲染好了界面，会出现闪屏，若是这一步放在created中，解构的时候使用的status和data就和上边冲突了
    let id = sessionStorage.id;
    let detail = await Account.info({ id });
    if (!detail.status) return false;
    this.form = detail.data;
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return false;
        // 若是删除图片后不上传，则保存时附默认图片
        if (this.form.avatar === ""){
          this.$alert("您没有上传头像，系统已自动设置为默认图片?", "提示", {
            confirmButtonText: "确定",
          });
          this.form.avatar = "../images/avatar/default.jpg";
        }
        // 发送ajax保存
        let { status, msg } = await Account.edit({ ...this.form });
        if (!status) return false;
        this.$message.success(msg);
      });
    },
    // 子传父，通知更改图片路径
    handleImg(value) {
      this.form.avatar = value;
    },
  },
};
</script>

<style lang="less" scoped>
.demo-ruleForm {
  margin: 0 300px;
}

.el-form-item .el-form-item__label {
  text-align: left;
}
</style>