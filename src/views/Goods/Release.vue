<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>发布新商品</span>
    </div>
    <el-form ref="form" :model="form" label-width="130px" :rules="rules">
      <el-form-item label="商品分类" required>
        <el-select v-model="form.cate_1st" placeholder="请选择一级分类" prop="cate_1st">
          <el-option
            v-for="option in cate_1stData"
            :key="option.id"
            :label="option.name"
            :value="option.id"
          ></el-option>
        </el-select>
        <el-select v-model="form.cate_2nd" placeholder="请选择二级分类" prop="cate_2nd">
          <el-option
            v-for="option in cate_2ndData"
            :key="option.id"
            :label="option.name"
            :value="option.id"
          ></el-option>
        </el-select>
        <el-select v-model="form.cate_3rd" placeholder="请选择三级分类" prop="cate_3rd">
          <el-option
            v-for="option in cate_3rdData"
            :key="option.id"
            :label="option.name"
            :value="option.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品名称" prop="name">
        <el-input v-model="form.name" class="input-size"></el-input>
        <p class="tips">商品标题名称长度至少3个字符，最长200个汉字</p>
      </el-form-item>

      <el-form-item label="商品卖点" prop="hotPoint">
        <el-input type="textarea" v-model="form.hotPoint" class="input-size"></el-input>
        <p class="tips">商品卖点不能超过140个汉字</p>
      </el-form-item>

      <el-form-item label="商品价格" prop="price" required>
        <el-input v-model.number="form.price" class="complex-size" type="number">
          <template slot="append">元</template>
        </el-input>
        <p class="tips">价格必须是0-999999之间的数字，且不能高于市场价</p>
        <p class="tips">此价格为商品实际销售价格，如果商品存在规格，改价格显示最低价格</p>
      </el-form-item>

      <el-form-item label="市场价" prop="marketPrice" required>
        <el-input v-model.number="form.marketPrice" class="complex-size" type="number">
          <template slot="append">元</template>
        </el-input>
        <p class="tips">价格必须是0-999999之间的数字，此价格仅为市场参考价，请根据实际情况认真填写</p>
      </el-form-item>

      <el-form-item label="成本价" prop="cost" required>
        <el-input v-model.number="form.cost" class="complex-size" type="number">
          <template slot="append">元</template>
        </el-input>
        <p class="tips">价格必须是0-999999之间的数字，此价格为商户对所销售的商品的实际成本价进行备注记录，非必填选项，不会再前台销售页面中显示</p>
      </el-form-item>

      <el-form-item label="折扣">
        <el-input v-model="rebate" class="complex-size" type="number">
          <template slot="append">折</template>
        </el-input>
        <p class="tips">根据销售价与市场价比例自动生成不需要编辑</p>
      </el-form-item>

      <el-form-item label="商品库存" prop="inventory">
        <el-input v-model.number="form.inventory" class="complex-size">
          <template slot="append">件</template>
        </el-input>
        <p class="tips">价格必须是0-999999之间的整数</p>
        <p class="tips">若启动了库存配置，则系统自动计算商品的总数，此处无需卖家填写</p>
      </el-form-item>

      <el-form-item label="商品货号" prop="articleNo">
        <el-input v-model.number="form.articleNo" class="input-size" type="number"></el-input>
        <p class="tips">商品货号是商家管理商品的编号，买家不可见</p>
        <p class="tips">最多输入20个数字</p>
      </el-form-item>

      <el-form-item label="商品主图" required>
        <upload :img="[form.img_md,'/api/upload/goods','lgImg']" @onhandleImg="handleImg"></upload>
        <p
          class="tips"
        >上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、gif、png格式上传或从图片空间选中，建议使用尺寸800*800像素以上，大小不超过1M的正方形图片，上传后的图片将自动保存在图片空间的默认分类中</p>
      </el-form-item>

      <el-form-item label="商品轮播图" required>
        <!-- <mutileUpload :img="form.slider"></mutileUpload> -->

        <el-upload
          ref="upload"
          action="/api/upload/slider"
          :headers="headers"
          :file-list="fileList"
          list-type="picture-card"
          :on-success="handlePreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
          
        </el-upload>

        <p
          class="tips"
        >上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、gif、png格式上传或从图片空间选中，建议使用尺寸800*800像素以上，大小不超过1M的正方形图片，上传后的图片将自动保存在图片空间的默认分类中</p>
      </el-form-item>

      <div class="space">商品详情描述</div>

      <el-form-item label="商品品牌" prop="brand">
        <el-input v-model="form.brand" class="input-size"></el-input>
      </el-form-item>

      <el-form-item label="商品描述" prop="detail">
        <div ref="editor"></div>
      </el-form-item>

      <div class="space">商品物流信息</div>

      <el-form-item label="所在地" required>
        <el-select v-model="form.province" placeholder="请选择省份">
          <el-option
            v-for="option in provinceData"
            :key="option.province_id"
            :label="option.name"
            :value="option.province_id"
          ></el-option>
        </el-select>
        <el-select v-model="form.city" placeholder="请选择级市">
          <el-option
            v-for="option in cityData"
            :key="option.city_id"
            :label="option.name"
            :value="option.city_id"
          ></el-option>
        </el-select>
        <el-select v-model="form.county" placeholder="请选择区域">
          <el-option
            v-for="option in countyData"
            :key="option.county_id"
            :label="option.name"
            :value="option.county_id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="运费" prop="freight">
        <el-input v-model.number="form.freight" class="complex-size" type="number">
          <template slot="append">元</template>
        </el-input>
        <p class="tips">运费设为0，前台商品将显示免运费</p>
      </el-form-item>

      <el-form-item>
        <el-button type="success" @click="onSubmit('form')">提交</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import upload from "@/components/Upload";
import E from "wangeditor";
import { Goods } from "@/api/index";
import { constants } from "fs";
import { config } from "process";
export default {
  components: {
    upload,
  },
  data() {
    return {
      form: {
        cate_1st: 0,
        cate_2nd: 0,
        cate_3rd: 0,
        name: "",
        hotPoint: "",
        price: 0,
        marketPrice: 0,
        cost: 0,
        discount: 0,
        inventory: 0,
        articleNo: 0,
        img_lg: "",
        img_md: "",
        slider: "",
        brand: "",
        detail: "",
        freight: 0,
        province: "370000000000",
        city: "370200000000",
        county: "370214000000",
      },
      // 保存分类的数组
      cate_1stData: [],
      cate_2ndData: [],
      cate_3rdData: [],
      // 保存省市三级联动的数组
      provinceData: [],
      cityData: [],
      countyData: [],

      // 多张图片的数据源
      // 放大的图片的url
      dialogImageUrl: "",
      // 控制放大模板的开关
      dialogVisible: false,
      // 是否显示图片上的遮罩
      disabled: false,
      // 图片列表
      imgList: [],
      fileList: [],
      imgData:[],
      model:{
        packageImg:''
      },

      headers: {
        //   传递的对象中也可以先用let声明一个变量接收，在传递这个变量
        Authorization: `Bearer ${sessionStorage.token}`,
      },

      rules: {
        cate_1st: [
          { required: true, message: "请选择一级分类", trigger: "change" },
        ],
        cate_2nd: [{ message: "请选择二级分类", trigger: "change" }],
        cate_3rd: [{ message: "请选择二级分类", trigger: "change" }],
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 3, max: 200, message: "长度在3-200个字符！", trigger: "blur" },
        ],
        hotPoint: [
          { message: "请输入商品卖点", trigger: "blur" },
          {
            min: 0,
            max: 140,
            message: "长度不能超过140个字符！",
            trigger: "blur",
          },
        ],
        price: [
          { required: true, message: "请输入商品价格！", trigger: "blur" },
          {
            validator(rule, value, callback) {
              if (!value) callback(new Error("请输入商品价格"));
              // var reg = /^-?\d{1,6}(?:\.\d{1,2})?$/;
              var reg = /^\d{1,6}(\.\d{1,2})?$/;
              if (reg.test(value)) {
                callback();
              } else {
                callback(new Error("请输入价格区间内的数字"));
              }
            },
            trigger: "blur",
          },
        ],
        marketPrice: [
          // { message: "请输入市场价！", trigger: "blur" },
          {
            validator(rule, value, callback) {
              if (!value) callback(new Error("请输入市场价格"));
              // var reg = /^-?\d{1,6}(?:\.\d{1,2})?$/;
              var reg = /^\d{1,6}(\.\d{1,2})?$/;
              if (reg.test(value)) {
                callback();
              } else {
                callback(new Error("请输入价格区间内的数字"));
              }
            },
            trigger: "blur",
          },
        ],
        cost: [
          // { message: "请输入成本价！", trigger: "blur" },
          {
            validator(rule, value, callback) {
              if (!value) callback(new Error("请输入成本价"));
              // var reg = /^-?\d{1,6}(?:\.\d{1,2})?$/;
              var reg = /^\d{1,6}(\.\d{1,2})?$/;
              if (reg.test(value)) {
                callback();
              } else {
                callback(new Error("请输入价格区间内的数字"));
              }
            },
            trigger: "blur",
          },
        ],
        inventory: [
          // { message: "请输入商品库存", trigger: "blur" },
          {
            validator(rule, value, callback) {
              if (
                Number.isInteger(Number(value)) &&
                Number(value) >= 0 &&
                Number(value) < 999999
              ) {
                callback();
              } else {
                callback(new Error("请输入正确的库存量"));
              }
            },
            trigger: "blur",
          },
        ],
        articleNo: [
          { required: true, message: "请输入商品货号", trigger: "blur" },
          // 字符串才能用下边那一行来验证，数字类型就行
          // { min: 0, max: 20, message: "最长20个字符！", trigger: "blur" },
          {
            validator(rule, value, callback) {
              // var reg = /^[\.\u4e00-\u9fa5_\/a-zA-Z0-9-]+$/;
              var reg = /^[0-9]+$/;
              if (reg.test(value)) {
                callback();
              } else {
                callback(new Error("请输入正确的商品货号"));
              }
            },
            trigger: "blur",
          },
        ],
        brand: [
          { message: "请输入商品品牌", trigger: "blur" },
          { min: 1, max: 20, message: "请输入1-20个字符！", trigger: "blur" },
        ],
        detail: [
          { required: true, message: "请输入商品详情", trigger: "blur" },
        ],
        freight: [
          { required: true, message: "请输入运费！", trigger: "blur" },
          {
            validator(rule, value, callback) {
              var reg = /^\d{1,3}(\.\d{1,2})?$/;
              if (reg.test(value)) {
                callback();
              } else {
                callback(new Error("请输入0-999内的数字"));
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  // 获取商品分类的初始数据，并附初始值
  async created() {
    // 获取一级分类
    let { status, data } = await Goods.getCategory({ pId: 1 });
    this.cate_1stData = data;
    this.form.cate_1st = data[0].id;

    // 获取省市三级联动的数据
    let getProvinceData = await Goods.province();
    this.provinceData = getProvinceData.data;
    let getCityData = await Goods.city({ id: this.form.province });
    this.cityData = getCityData.data;
    let getCountyData = await Goods.county({ id: this.form.city });
    this.countyData = getCountyData.data;

    // await Goods.release({});
  },
  watch: {
    // 监听一级分类，若是出现改变则获取二级分类
    "form.cate_1st": async function (val) {
      let { status, data } = await Goods.getCategory({ pId: val });
      // 没有二级分类的情况
      if (data.length === 0) {
        this.cate_2ndData = "";
        this.form.cate_2nd = "";
        return false;
      }
      this.cate_2ndData = data;
      this.form.cate_2nd = data[0].id;
    },
    // 监听二级分类，若是出现改变则获取三级分类
    "form.cate_2nd": async function (val) {
      // 排除二级分类为空的情况
      if (val === "") {
        this._rester_3rd();
      }
      let { status, data } = await Goods.getCategory({ pId: val });
      // 没有三级分类的情况
      if (data.length === 0) {
        this._rester_3rd();
      }
      this.cate_3rdData = data;
      this.form.cate_3rd = data[0].id;
    },
    // 监听省份的变化，获取地级市
    "form.province": async function (val) {
      let { status, data } = await Goods.city({ id: val });
      this.cityData = data;
      this.form.city = data[0].city_id;
    },
    // 监听地级市的变化，获取县级
    "form.city": async function (val) {
      let { status, data } = await Goods.county({ id: val });
      this.countyData = data;
      this.form.county = data[0].county_id;
    },
  },
  // 创建富文本编辑器
  mounted() {
    var editor = new E(this.$refs.editor);
    editor.customConfig.onchange = (html) => {
      this.form.detail = html;
    };

    // 图片上传到服务器的API
    editor.customConfig.uploadImgServer = "/api/upload/editor";
    // 配置上传图片的字段名
    editor.customConfig.uploadFileName = "file";
    // 将图片大小限制为 2M
    editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024;
    // 配置ajax的header
    editor.customConfig.uploadImgHeaders = {
      Authorization: `Bearer ${sessionStorage.token}`,
    };
    editor.create();
  },
  computed: {
    rebate() {
      this.form.discount = (this.form.price / this.form.marketPrice).toFixed(2);
      return this.form.discount;
    },
  },
  methods: {
    onSubmit(formName) {
      // console.log("submit!");
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return false;
        // 若是删除图片后不上传，则保存时附默认图片
        // if (this.form.avatar === "")
        //   this.form.avatar = "../images/avatar/default.jpg";

        // 发送ajax保存
        // console.log(this.form);
        let { status, data, msg } = await Goods.newGoods({ ...this.form });
        if (!status) return false;
        this.$message.success(msg);
        this.$router.replace("/goods/list");
      });
    },
    handleRemove(file, fileList) {
      this.model.packageImg = "";
      this.$message({
        type: "info",
        message: "已删除原有图片",
        duration: 6000,
      });
      // 已经从保存的图片队列里删除图片
      console.log(fileList);
      // 重置，然后重新把页面上的图片进行保存
      this.imgData = [];
      if (fileList.length > 0) {
        console.log(fileList.length);
        console.log(fileList);
        for (let key = 0; key < fileList.length; key++) {
          this.imgData.push({
            src:fileList[key].response.src
            // picAddress: fileList[key].name,
            // picName: fileList[key].url,
          });
        }
      }
      console.log("数组对象", this.imgData);
    },
    handlePreview(response, file, fileList) {
      // 浏览器返回的响应
      // console.log(response);
      // 当前上传的文件
      // console.log(file);
      // 为0
      // console.log(this.fileList.length);
      // 一个数组，里边放了file这个对象，而file这个对象里边有包含了response对象
      // 已上传的文件列表
      console.log(fileList);
      // 循环渲染图片
      let obj = {};
      for (let key = this.fileList.length; key < fileList.length; key++) {
        obj.src = fileList[key].response.src;
        // obj.picName = fileList[key].name;
      }
      // imgData所有上传的路径都保存在这个数组里边，这里应该对应的就是form里边的silde字段
      this.imgData.push(obj);
      console.log("数组对象", this.imgData);
      this.$message({
        type: "success",
        message: "文件上传成功",
        duration: 6000,
      });
      // this.showFont = false;
    },
    // 点击预览的处理
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    //子传父，通知父更改模板数据
    handleImg(value) {
      this.form.img_md = value;
    },

    // 把三级分类置为空
    _rester_3rd() {
      this.cate_3rdData = "";
      this.form.cate_3rd = "";
      return false;
    },
  },
};
</script>

<style lang="less" scope>
.box-card {
  width: 100%;
}

.el-form-item__label {
  text-align: left;
}

.w-e-text-container {
  height: 800px !important;
  z-index: 1000 !important;
}

.w-e-menu {
  z-index: 1000 !important;
}

.tips {
  color: #ccc;
  font-size: 13px;
}

.input-size {
  width: 800px;
}

.el-input-group {
  width: 200px;
}

.space {
  background-color: #f5f5f5;
  line-height: 40px;
  padding: 0 10px;
  margin-bottom: 10px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
</style>