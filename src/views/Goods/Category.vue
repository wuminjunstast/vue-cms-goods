<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <span>商品分类</span>
      </div>
      <el-tree :props="allData" :load="loadNode" lazy ref="tree" node-key="id">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              :disabled="node.level==1"
              @click="() => edit(node,data)"
            >编辑</el-button>
            <el-button type="text" size="mini" icon="el-icon-plus" @click="() => append(data)">添加</el-button>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              :disabled="node.level==1"
              @click="() => remove(node, data)"
            >删除</el-button>
          </span>
        </span>
      </el-tree>
    </el-card>

    <!-- 添加弹窗 -->
    <el-dialog title="添加分类" :visible.sync="insertModalShow">
      <el-form
        :model="insertForm"
        :rules="rules"
        label-width="120px"
        ref="insertForm"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="insertForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类图片" required>
          <upload :img="[insertForm.img,'/api/upload/common','img']" @onhandleImg="handleImg"></upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="insertModalShow = false">取 消</el-button>
        <el-button type="primary" @click="handleInsertNode('insertForm')">添 加</el-button>
      </div>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog title="添加分类" :visible.sync="editModalShow">
      <el-form
        :model="editForm"
        :rules="rules"
        label-width="120px"
        ref="editForm"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类图片" required>
          <upload :img="[editForm.img,'/api/upload/common','img']" @onhandleImg="handleEditImg"></upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editModalShow = false">取 消</el-button>
        <el-button type="primary" @click="handleEditNode('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Goods } from "@/api/index";
import upload from "@/components/Upload";
import { config } from "process";
export default {
  components: {
    upload,
  },
  data() {
    return {
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
      },
      allData: {
        label: "name",
      },
      // 保存节点
      node: {},
      insertForm: {
        name: "",
        img: "",
      },
      editForm: {},
      insertModalShow: false,
      editModalShow: false,
    };
  },
  methods: {
    async loadNode(node, resolve) {
      // level表示树形结构的深度
      if (node.level === 0) {
        return resolve([{ id: 1, name: "全部分类" }]);
      }
      // node是tree返回的内容，其中data是点击的当前节点在数据库中保存的信息，所以结构出当前点击的id，用于获取下一级分类
      let { id } = node.data;
      // 获取子类
      let { status, data } = await Goods.getCategory({ pId: id });
      // resolve是tree定义好的插入节点函数，若是回来的状态是true，则执行插入节点函数
      if (status) {
        return resolve(data);
      }
    },
    // 编辑的子传父，更改图片
    handleImg(value) {
      this.insertForm.img = value;
    },
    // 添加的子传父，更改图片
    handleEditImg(value) {
      this.editForm.img = value;
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
        let { status, msg, data } = await Goods.updataCategory({
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
        // console.log(this.node);
        // 发送ajax
        let { status, msg, data } = await Goods.addCategory({
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
            img: "",
          };
        }
      });
    },

    remove(node, data) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "删除", {
        type: "warning",
      })
        .then(async () => {
          let { status } = await Goods.removeCategory({ ...data });
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
.box-card {
  width: 100%;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>