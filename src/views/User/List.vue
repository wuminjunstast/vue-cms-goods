<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户列表</span>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="#"></el-table-column>
        <el-table-column label="头像" sortable>
          <template slot-scope="scope">
            <el-avatar size="medium" :src="scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="账号" user></el-table-column>
        <el-table-column prop="fullname" label="姓名" sortable></el-table-column>
        <el-table-column prop="sex" label="性别" sortable></el-table-column>
        <el-table-column prop="tel" label="手机" sortable></el-table-column>
        <el-table-column label="角色" sortable>
          <template slot-scope="scope">
            <div slot="refe rence" class="name-wrapper">
              <el-tag v-if="scope.row.id===1" size="medium" type="danger">{{ scope.row.role_name }}</el-tag>
              <el-tag v-else size="medium">{{ scope.row.role_name }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="login_time" label="上次登录" sortable></el-table-column>
        <el-table-column prop="login_count" label="登录次数" sortable></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              plain
              @click="handleEdit(scope.$index,scope.row)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              plain
              :disabled="scope.row.id===1"
              @click="handleDelete(scope.$index, scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑模板 -->
    <el-dialog title="修改信息" :visible.sync="dialogFormVisible">
      <el-form
        :model="editData"
        :rules="rules"
        ref="editData"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名" prop="fullname">
          <el-input v-model="editData.fullname" placeholder="请填写真实姓名！"></el-input>
        </el-form-item>
        <el-form-item label="性别" required>
          <el-radio-group v-model="editData.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机" prop="tel">
          <el-input v-model.number="editData.tel" placeholder="请填写常用手机号码！"></el-input>
        </el-form-item>
        <el-form-item label="权限" required>
          <el-select v-model="editData.role" placeholder="请选择权限" prop="role_name">
            <el-option
              v-for="option in roleList"
              :key="option.id"
              :label="option.name"
              :value="option.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="头像" required>
          <upload :img="[editData.avatar,'/api/upload/avatar','src']" @onhandleImg="handleImg"></upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit('editData')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { User, Role, Account } from "@/api/index";
import upload from "@/components/Upload";
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
      // 列表数据
      tableData: [],
      // 保存权限角色的数组
      roleList: [],
      // 保存编辑model的数据
      editData: [],
      // 控制编辑模板的开启
      dialogFormVisible: false,
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
    let { status, data } = await User.list();
    if (!status) return false;
    this.tableData = data;
  },
  methods: {
    async handleEdit(index, row) {
      // 获取权限角色
      let { status, data } = await Role.list();
      if (!status) return false;
      this.roleList = data;
      // 打开模板，绑定数据
      this.dialogFormVisible = true;
      this.editData = row;
      // 把index保存进数组中，方便后边保存model使用
      this.editData.index = index;
    },
    // 删除管理员信息
    async handleDelete(index, id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "删除", {
        type: "warning",
      })
        .then(async () => {
          let { status, msg } = await User.remove({ id });
          if (!status) return false;
          this.tableData.splice(index, 1);
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    // 子传父，通知更改图片路径
    handleImg(value) {
      this.editData.avatar = value;
    },
    // 保存编辑表单
    submitEdit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return false;
        // 若是删除图片后不上传，则提醒用户保存时附默认图片
        if (this.editData.avatar === ""){
          this.$alert("您没有上传头像，系统已自动设置为默认图片?", "提示", {
            confirmButtonText: "确定",
          });
          // 赋值为默认图片
          this.editData.avatar = "../images/avatar/default.jpg";
        }
          // 发送ajax保存
          // let trunData = this.tableData.role.toString();
          let trunData = String(this.editData.role);
          // console.log(trunData);
          // console.log(this.editData.role);
          let { status, msg } = await Account.edit({ ...this.editData,role:trunData });
          if (!status) {
            this.$message.error(msg);
            return false;
          }
          this.$message.success(msg);
          this.dialogFormVisible = false;
          // 找到index，然后修改list的数据
          this.$set(this.tableData, this.editData.index, this.editData);
        // }
      });
    },
  },
};
</script>

<style lang="less" scope>
.box-card {
  width: 100%;
}

.el-table .cell {
  display: flex;
  align-items: center;

  .space {
    margin-left: 10px;
  }
}
</style>