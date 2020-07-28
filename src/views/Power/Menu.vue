<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>菜单权限</span>
      </div>
      <el-alert
        title="Tips"
        type="warning"
        description="设置后台管理系统的左侧菜单，目前至多支持两层菜单，三层以上菜单将不会显示"
        show-icon
        :closable="false"
      ></el-alert>
      <el-tree :props="allData" :load="loadNode" lazy ref="tree" node-key="id">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span class="rightBtn">
            <el-popover placement="left-start" width="100" trigger="hover">
              <div>
                <i :class="'el-icon-' + data.icon"></i>
              </div>
              <el-button
                slot="reference"
                type="text"
                size="mini"
                :icon="'el-icon-' + data.icon"
                :disabled="node.level==1"
                @click="setIcon(node,data)"
              >图标</el-button>
            </el-popover>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click="() => edit(node,data)"
              :disabled="node.level==1"
            >编辑</el-button>
            <el-button type="text" size="mini" icon="el-icon-plus" @click="() => append(data)">添加</el-button>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              :disabled="node.level==1"
              @click="() => remove(node, data)"
            >删除</el-button>显示序号：
            <el-tag size="mini">{{data.order}}</el-tag>
          </span>
        </span>
      </el-tree>
    </el-card>

    <!-- 图标弹窗 -->
    <el-dialog title="选择图标" :visible.sync="iconModalShow">
      <ul class="iconlist">
        <li
          v-for="item in iconData"
          :key="item.id"
          @click="selectIcon(item)"
          :class="{'li_bg':selectIconData.id === item.id}"
        >
          <p>
            <i :class="'el-icon-' + item.name"></i>
          </p>
          <p class="icon_name">el-icon-{{item.name}}</p>
        </li>
      </ul>
      <div class="page">
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :total="total"
          :page-size="30"
        ></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="iconModalShow = false">取 消</el-button>
        <el-button type="primary" @click="handleSettingIcon">添 加</el-button>
      </div>
    </el-dialog>
    <!-- 添加弹窗 -->
    <el-dialog title="添加节点" :visible.sync="insertModalShow">
      <el-form
        :model="insertForm"
        label-width="120px"
        :rules="insertForm"
        ref="form"
        class="demo-ruleForm"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="insertForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" prop="path">
          <el-input v-model="insertForm.path" autocomplete="off" placeholder="指定此菜单的链接地址，选填"></el-input>
        </el-form-item>
        <el-form-item label="显示顺序" prop="order">
          <el-input v-model="insertForm.order" autocomplete="off" placeholder="显示顺序按照数字从小到大，如2001"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="insertModalShow = false">取 消</el-button>
        <el-button type="primary" @click="handleInsertNode('insertForm')">添 加</el-button>
      </div>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog title="编辑分类" :visible.sync="editModalShow">
      <el-form
        :model="editForm"
        label-width="120px"
        :rules="rules"
        ref="editForm"
        class="demo-ruleForm"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" prop="path">
          <el-input v-model="editForm.path" autocomplete="off" placeholder="指定此菜单的链接地址，选填"></el-input>
        </el-form-item>
        <el-form-item label="显示顺序" prop="order">
          <el-input v-model="editForm.order" autocomplete="off" placeholder="显示顺序按照数字从小到大，如2001"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editModalShow = false">取 消</el-button>
        <el-button type="primary" @click="handleEditNode('editForm')">添 加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Menu } from "@/api/index";
export default {
  data() {
    return {
      // 保存节点
      allData: {
        label: "name",
      },
      node: {},
      insertForm: {
        name: "",
        path: "",
        order: "",
      },
      editForm: {},
      insertModalShow: false,
      editModalShow: false,
      iconModalShow: false,
      // icon
      iconData: [],
      pageIndex: 0,
      total: 0,
      selectIconData: [],
      newSetIconId: 0,
      rules: {
        name: [
          { required: true, message: "请输入分类名称！", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur",
          },
        ],
        path: [
          { message: "请输入正确的路径！", trigger: "blur" },
          {
            min: 2,
            max: 30,
            message: "长度在 2 到 30 个字符",
            trigger: "blur",
          },
          {
            pattern: "/^[A-Za-z0-9_/]$/",
            message: "请输入相对路由的相对路径",
            trigger: "blur",
          },
        ],
        order: [
          { required: true, message: "请输入正确的顺序！", trigger: "blur" },
          {
            min: 1,
            max: 4,
            message: "长度在 1-4位数之间",
            trigger: "blur",
          },
          {
            validator(rule, value, callback) {
              var reg = /^\d{1,4}$/;
              if (reg.test(value)) {
                callback();
              } else {
                callback(new Error("请输入数字"));
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 懒加载获取初始数据
    async loadNode(node, resolve) {
      // level表示树形结构的深度
      if (node.level === 0) {
        return resolve([{ id: 1, name: "全部菜单" }]);
      }
      // node是tree返回的内容，其中data是点击的当前节点在数据库中保存的信息，所以结构出当前点击的id，用于获取下一级分类
      let { id } = node.data;
      // 获取子类
      let { status, data } = await Menu.getMenu({ pId: id });
      // resolve是tree定义好的插入节点函数，若是回来的状态是true，则执行插入节点函数
      if (status) {
        return resolve(data);
      }
    },
    // 设置图标
    async setIcon(node, data) {
      this.iconModalShow = true;
      this.newSetIconId = data;
      this.node = node;
      let { status, icons, total } = await Menu.iconList({ pageSize: 30 });
      if (!status) return false;
      this.iconData = icons;
      this.total = total;
      // console.log(data);
    },
    // 根据点击的页数重新发ajax获取图标数据
    async handleCurrentChange(val) {
      this.pageIndex = val;
      let { status, icons, total } = await Menu.iconList({
        pageSize: 30,
        pageIndex: this.pageIndex,
      });
      if (!status) return false;
      this.iconData = icons;
      this.total = total;
    },
    // 把选择好的图标信息保存
    selectIcon(data) {
      this.selectIconData = data;
    },
    // 发送ajax信息更新图标信息
    async handleSettingIcon() {
      // 先确定点的是哪个li
      let { status } = await Menu.setIcon({
        id: this.newSetIconId.id,
        icon: this.selectIconData.id,
      });
      if (!status) return false;
      this.iconModalShow = false;
      // 更新界面
      this.node.data.icon = this.selectIconData.name;
    },
    // 编辑节点的弹出框
    edit(node, data) {
      this.editForm = { ...data };
      this.editModalShow = true;
      this.node = node;
    },
    // 编辑一个节点
    handleEditNode(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return false;
        // 发送ajax
        let { status, msg, data } = await Menu.updataMenu({
          ...this.editForm,
        });
        if (status) {
          this.$message.success(msg);
          // tree中定义好的添加节点的方法
          this.node.data = this.editForm;
          this.editModalShow = false;
        }
      });
    },
    // 添加节点的弹出框
    append(data) {
      this.insertModalShow = true;
      this.node = data;
    },
    // 添加一个节点
    handleInsertNode(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return false;
        // 发送ajax保存
        let { status, msg, data } = await Menu.addMenu({
          ...this.insertForm,
          pId: this.node.id,
        });
        if (status) {
          this.$message.success(msg);
          // tree中定义好的添加节点的方法
          this.$refs.tree.append({ ...data, ...this.insertForm }, this.node);
          this.insertModalShow = false;
          // 清空模板
          this.insertForm = {
            name: "",
            path: "",
            order: "",
          };
        }
      });

      // 发送ajax
    },
    // 删除一个节点
    async remove(node, data) {
      this.$confirm("此操作将永久删除该菜单, 是否继续?", "删除", {
        type: "warning",
      })
        .then(async () => {
          let { status } = await Menu.removeMenu({ ...data });
          if (status) this.$refs.tree.remove(node);
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
  },
};
</script>

<style lang="less" scope>
.el-tree {
  font-size: 13px;
}
.el-alert {
  margin-bottom: 10px;
}

.custom-tree-node {
  position: relative;
  display: inline-block;
  width: 100%;
}
.rightBtn {
  position: absolute;
  top: 0;
  right: 0;
}
.el-tag {
  width: 50px;
}
.el-dialog {
  width: 1412px;
  .iconlist {
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    border: 1px solid #eee;

    li {
      list-style: none;
      width: 135px;
      height: 100px;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1px solid #eee;

      &.li_bg {
        background: rgba(149, 149, 253, 0.5);
      }

      &:hover {
        color: rgb(125, 125, 253);
      }

      p {
        font-size: 12px;
        margin: 5px;

        i {
          font-size: 26px;
        }
        &.icon_name {
          color: #aaa;
        }
      }
    }
  }
}

.page {
  position: relative;
  margin-top: 10px;
  height: 30px;
}

.el-pagination {
  position: absolute;
  right: 0;
}
</style>