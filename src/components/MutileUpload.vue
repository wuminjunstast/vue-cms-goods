<template>
  <div>
    <el-upload
      action="/api/upload/slider"
      list-type="picture-card"
      :headers="headers"
      :on-success="handleAvatarSuccess"
      :file-list="fileList"
      :on-remove="handleRemove"
    >
      <i slot="default" class="el-icon-plus"></i>

      <div>
        <img class="el-upload-list__item-thumbnail" :src="img.url" alt />
        <span class="el-upload-list__item-actions">
          <!-- 放大按钮 -->
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <!-- 删除按钮 -->
          <span v-if="!disabled" class="el-upload-list__item-delete">
            <!-- @click="handleRemove(file,fileList)" -->
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    img: {
      type: String,
    },
  },
  data() {
    return {
      headers: {
        //   传递的对象中也可以先用let声明一个变量接收，在传递这个变量
        Authorization: `Bearer ${sessionStorage.token}`,
      },
      imgData: [],
      // 放大的图片的url
      dialogImageUrl: "",
      // 控制放大模板的开关
      dialogVisible: false,
      // 是否显示图片上的遮罩
      disabled: false,
    };
  },
  created() {
    // if(img === '') return false;
    // this.imgData = this.img.split(',');
    // console.log(this.imgData);
  },
  methods: {
    handleAvatarSuccess() {},
    handleRemove() {},
    // 点击预览的处理
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="less" scope>
</style>