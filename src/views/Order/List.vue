<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>订单列表</span>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="#" width="50"></el-table-column>
      <el-table-column width="600">
        <template slot-scope="scope">
          <el-table :data="scope.row.goodsList">
            <el-table-column label="商品">
              <template slot-scope="scope">
                <el-image style="width: 80px; height: 80px" :src="scope.row.img_md" fit="cover"></el-image>
                <div class="space">
                  <p v-text="scope.row.name"></p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="goods_price" label="单价" width="100"></el-table-column>
            <el-table-column prop="goods_num" label="数量" width="100"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="payment" label="付款总额"></el-table-column>
      <el-table-column prop="create_time" label="下单时间" sortable></el-table-column>
      <el-table-column prop="status" label="状态" sortable></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            plain
            @click="handleEdit(scope.$index, scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { Order } from "@/api/index";
export default {
  data() {
    return {
      tableData: [],
    };
  },
  async created() {
    // 获取列表
    // 0代付款  3待发货   4待收货  5待评价  all 所有状态
    let { status, data } = await Order.list({ status: "all" });
    if (!status) return false;
    // 把世界时间转化为中国时间
    data.forEach((item) => {
      item.create_time = this._formatUTC(item.create_time);
    });
    this.tableData = data;
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    // 转化时区
    _formatUTC(utc_datetime) {
      // 转为正常的时间格式 年-月-日 时:分:秒
      var T_pos = utc_datetime.indexOf("T");
      var Z_pos = utc_datetime.indexOf("Z");
      var year_month_day = utc_datetime.substr(0, T_pos);
      var hour_minute_second = utc_datetime.substr(
        T_pos + 1,
        Z_pos - T_pos - 1
      );
      var new_datetime = year_month_day + " " + hour_minute_second;

      // 处理成为时间戳
      timestamp = new Date(Date.parse(new_datetime));
      timestamp = timestamp.getTime();
      timestamp = timestamp / 1000;

      // 增加8个小时，北京时间比utc时间多八个时区
      var timestamp = timestamp + 8 * 60 * 60;

      // 时间戳转为时间
      var beijing_datetime = new Date(parseInt(timestamp) * 1000)
        .toLocaleString()
        .replace(/年|月/g, "-")
        .replace(/日/g, " ");
      return beijing_datetime;
    }
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
</style>