<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>商品列表</span>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="商品名称" width="600">
        <template slot-scope="scope">
          <el-image style="width: 80px; height: 80px" :src="scope.row.img_md" fit="cover"></el-image>
          <div class="space">
            <p v-text="scope.row.name"></p>商品货号：
            <span v-text="scope.row.articleNo"></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" sortable></el-table-column>
      <el-table-column prop="inventory" label="库存" sortable></el-table-column>
      <el-table-column prop="create_time" label="发布时间" sortable></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link :href="`#/goods/edit/${scope.row.id}`" target="_blank" class="btn-space">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            plain
            @click="handleEdit(scope.$index, scope.row)"
          ></el-button>
          </el-link>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            plain
            @click="handleDelete(scope.$index, scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        background
        layout="prev, pager, next, sizes, total"
        :total="total"
        :page-sizes="[4, 8, 16,32]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </el-card>
</template>

<script>
import { Goods } from "@/api/index";
export default {
  data() {
    return {
      tableData: [],
      // 保存商品的总数
      total: 0,
      // 保存当前的每页长度和页数
      pageSize: 4,
      pageIndex: 1,
    };
  },
  // 获取初始数据
  created() {
    this._saveData({});
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    // 删除商品信息
    handleDelete(index, id) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "删除", {
        type: "warning",
      })
        .then(async () => {
          let { status, data } = await Goods.remove({ id });
          if (!status) return false;
          this.tableData.splice(index, 1);
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    // 改变每页数据量时重新获取数据
    handleSizeChange(val) {
      this.pageSize = val;
      this._saveData({
        pageSize: val,
        pageIndex: this.pageIndex,
      });
    },
    // 点击页数时重新获取list
    handleCurrentChange(val) {
      this.pageIndex = val;
      this._saveData({
        pageSize: this.pageSize,
        pageIndex: val,
      });
    },
    //把ajax后的数据保存进data里
   async _saveData(data) {
      let { status, goods, total } = await Goods.list(data);
      if (!status) return false;
      this.tableData = goods;
      this.total = total;
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

.page {
  position: relative;
  margin-top: 10px;
  height: 30px;
}

.el-pagination {
  position: absolute;
  right: 0;
}

.btn-space {
		margin-right: 10px;
	}
</style>