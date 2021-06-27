<template>
  <bc-dialog width="480px" :visible.sync="dialogVisible" title="文件导入" append-to-body noFooter>
    <section v-loading="uploading">
      <el-alert title="" type="warning" :closable="false">
        <template slot="">
          <div class="text-center">
            <span>您是否有标准的Excel模版，需要依照模版导入，否则会失败。</span><br>
            <a class="text-info cur-point" @click="handleDownloadTemplate">还没有Excel模版?请下载模版</a>
          </div>
        </template>
      </el-alert>
      <el-upload
        style="text-align: center; margin-top: 20px"
        action=""
        ref="upload"
        :show-file-list="false"
        with-credentials
        :httpRequest="uploadFile"
        accept=".xlsx,.xls"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <!-- <div class="el-upload__tip" slot="tip">只能上传excel文件</div> -->
      </el-upload>
    </section>
  </bc-dialog>
</template>

<script>
export default {
  name: 'bc-upload',
  props: {
    visible: Boolean,
    templateApi: Function,
    uploadApi: Function,
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        return this.$emit('update:visible', val);
      }
    }
  },
  data() {
    return {
      uploading: false,
    }
  },
  methods: {
    uploadFile() {
      this.uploading = true;
      const upload = this.$refs.upload;
      const blobList = upload.uploadFiles;
      const form = new FormData();
      blobList.forEach(item => {
        form.append('file', item.raw);
      })
      this.uploadApi(form).then(() => {
        this.uploading = false;
        upload.clearFiles();
        this.$emit('success');
        this.$emit('update:visible', false);
      }).catch(() => {
        this.uploading = false;
        upload.clearFiles();
        this.$emit('error');
      })
    },
    handleDownloadTemplate() {
      this.templateApi();
    }
  }
}
</script>
