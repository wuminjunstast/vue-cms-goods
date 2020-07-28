<template>
  <div class="role-box">
    <div class="left-box">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>角色列表</span>
          <el-button
            style="float: right;"
            icon="el-icon-circle-plus-outline"
            type="primary"
            plain
            @click="handleAdd"
          >添加角色</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="#" width="180"></el-table-column>
          <el-table-column label="角色">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag v-if="scope.row.id===1" size="medium" type="danger">{{ scope.row.name }}</el-tag>
                <el-tag v-else size="medium">{{ scope.row.name }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                plain
                :disabled="scope.row.id===1"
                @click="handleEdit(scope.$index, scope.row)"
              ></el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                plain
                :disabled="scope.row.id===1"
                @click="handleDelete(scope.$index, scope.row.id)"
              ></el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-setting"
                plain
                @click="handleSetting(scope.$index, scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <div class="right-box" v-show="isConfig">
      <el-card class="box-card" v-for="(item,index) in configData" :key="item.id">
        <div slot="header" class="clearfix">
          <span class="right-title">
            <i class="el-icon-collection-tag"></i>
            {{item.name}}
          </span>
          <el-switch style="float: right;" v-model="item.checked" @change="handlePanSwitch(item)"></el-switch>
        </div>
        <div class="card-item" v-for="option in configData[index].children" :key="option.id">
          {{option.name}}
          <el-switch
            style="float: right;"
            v-model="option.checked"
            @change="handleChildSwitch(item,option)"
          ></el-switch>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { Role } from "@/api/index";
export default {
  data() {
    return {
      tableData: [],
      isConfig: false,
      configData: [],
      newRoleId: "",
    };
  },
  async created() {
    // 获取列表的初始数据
    let { status, data } = await Role.list();
    if (!status) return false;
    this.tableData = data;
  },
  computed: {},
  methods: {
    handleAdd() {
      this.$prompt("请输入添加角色的名称", "添加角色", {
        inputPattern: /\S/,
        inputErrorMessage: "不能输入空白字符",
      })
        .then(async ({ value }) => {
          let { status, data } = await Role.add({ name: value });
          if (!status) return false;
          this.tableData.push({ name: value, ...data });
          this.$message.success("添加成功");
        })
        .catch(() => {
          this.$message.info("取消添加");
        });
    },
    handleEdit(index, row) {
      this.$prompt("请输入修改角色的名称", "修改角色", {
        inputPattern: /\S/,
        inputErrorMessage: "不能输入空白字符",
        inputValue: row.name,
      })
        .then(async ({ value }) => {
          let { status } = await Role.edit({ id: row.id, name: value });
          if (!status) return false;
          row.name = value;
          this.$set(this.tableData, index, row);
          this.$message.success("添加成功");
        })
        .catch(() => {
          this.$message.info("取消添加");
        });
    },
    handleDelete(index, id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "删除", {
        type: "warning",
      })
        .then(async () => {
          console.log(123);
          let { status } = await Role.remove({ id });
          if (!status) return false;
          this.tableData.splice(index, 1);
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    async handleSetting(index, id) {
      let { status, data } = await Role.config({ id });
      if (!status) return false;
      this.configData = data;
      this.isConfig = true;
      this.newRoleId = id;
    },
    // 点击父亲时，处理每一个卡片的全选和全不选
    async handlePanSwitch(item) {
      // 处理页面上的显示状态
      item.children.forEach((option) => {
        option.checked = item.checked;
      });
      // 处理ajax，判断点击后父亲是否全选，继而判断添加或删除的ajax
      if (item.checked) {
        // 增加父亲
          let { status } = await Role.addConfig({
            role_id: this.newRoleId,
            menu_id: item.id,
          });
          if (!status) return false;
        item.children.forEach(async (option) => {
          let { status } = await Role.addConfig({
            role_id: this.newRoleId,
            menu_id: option.id,
          });
          if (!status) return false;
        });
      } else {
        // 删除父亲
          let { status } = await Role.removeConfig({
            role_id: this.newRoleId,
            menu_id: item.id,
          });
          if (!status) return false;
        item.children.forEach(async (option) => {
          let { status } = await Role.removeConfig({
            role_id: this.newRoleId,
            menu_id: option.id,
          });
          if (!status) return false;
        });
      }
    },

    // 点击孩子时，处理每一个卡片的全选和全不选
    async handleChildSwitch(item, chileItem) {
      let flag = false;
      item.children.forEach((option) => {
        if (option.checked) {
          flag = true;
          return;
        }
      });
      item.checked = flag;

      // 处理ajax，判断点击后孩子的状态，继而判断添加或删除的ajax
      if (item.children.length === 1) {
        // 只有一个孩子时
        if (chileItem.checked) {
          // 增加父亲
          let { status } = await Role.addConfig({
            role_id: this.newRoleId,
            menu_id: item.id,
          });
          if (!status) return false;

          // 增加当前点击
          let childReturn = await Role.addConfig({
            role_id: this.newRoleId,
            menu_id: chileItem.id,
          });
          if (!childReturn.status) return false;
        } else {
          // 删除父亲
          let { status } = await Role.removeConfig({
            role_id: this.newRoleId,
            menu_id: item.id,
          });
          if (!status) return false;

          // 删除当前点击
          let childReturn = await Role.removeConfig({
            role_id: this.newRoleId,
            menu_id: chileItem.id,
          });
          if (!childReturn.status) return false;
        }
      } else {
        // 有多个孩子时
        if (chileItem.checked) {
          // 增加当前点击
          let childReturn = await Role.addConfig({
            role_id: this.newRoleId,
            menu_id: chileItem.id,
          });
          if (!childReturn.status) return false;

          // 判断父亲是否需要添加
          let addFlag = true;
          item.children.forEach((option) => {
            if (option.checked === false) {
              addFlag = false;
              return;
            }
          });
          if (addFlag) {
            // 增加父亲
            let { status } = await Role.addConfig({
              role_id: this.newRoleId,
              menu_id: item.id,
            });
            if (!status) return false;
          }
        } else {
          // 删除当前点击
          let childReturn = await Role.removeConfig({
            role_id: this.newRoleId,
            menu_id: chileItem.id,
          });
          if (!childReturn.status) return false;

          // 判断父亲是否需要删除
          let removeFlag = true;
          item.children.forEach((option) => {
            if (option.checked === true) {
              removeFlag = false;
              return;
            }
          });
          if (removeFlag) {
            console.log(123);
            // 删除父亲
            let { status } = await Role.removeConfig({
              role_id: this.newRoleId,
              menu_id: item.id,
            });
            if (!status) return false;
          }



        }
      }
    },
  },
};
</script>

<style lang="less" scope>
.role-box {
  display: flex;

  .left-box {
    width: 40%;
    padding-right: 20px;
  }

  .right-box {
    width: 60%;

    .box-card {
      margin-bottom: 10px;

      .right-title {
        color: #409eff;
        font-size: 15px;
      }

      .card-item {
        color: #aaa;
        font-size: 14px;
        margin: 10px 0;
      }
    }
  }
}

.el-tag--medium {
  width: 80px;
}
</style>