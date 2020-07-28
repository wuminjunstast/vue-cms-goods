<template>
  <div>
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
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="imgData" alt />
    </el-dialog>
  </div>
</template>
<script>
import { User } from "@/api/index";
export default {
  data() {
    return {
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      headers: {
        //   传递的对象中也可以先用let声明一个变量接收，在传递这个变量
        Authorization: `Bearer ${sessionStorage.token}`,
      },
    };
  },
  methods: {
    handleRemove(file, fileList) {
      this.model.packageImg = "";
      this.$message({
        type: "info",
        message: "已删除原有图片",
        duration: 6000,
      });
      console.log(file, fileList);
      this.imgData = [];
      if (fileList.length > 0) {
        console.log(fileList.length);
        console.log(fileList);
        for (let key = 0; key < fileList.length; key++) {
          this.imgData.push({
            picAddress: fileList[key].ame,
            picName: fileList[key].url,
          });
        }
      }
      console.log("数组对象", this.imgData);
    },
    handlePreview(response, file, fileList) {
      console.log(file);
      console.log(this.fileList.length);
      console.log(fileList);
      let obj = {};
      for (let key = this.fileList.length; key < fileList.length; key++) {
        obj.picAddress = fileList[key].response.data.path;
        obj.picName = fileList[key].name;
      }
      this.imgData.push(obj);
      console.log("数组对象", this.imgData);
      this.$message({
        type: "success",
        message: "文件上传成功",
        duration: 6000,
      });
      this.showFont = false;
    },
  },
};
</script>

<style scoped>
</style>