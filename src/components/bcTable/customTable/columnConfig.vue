<template>
  <bc-dialog
    title="展示配置"
    :visible.sync="dialogVisible"
    class="column-config-container"
    :close-on-click-modal="false"
    @open="handleOpen"
  >
    <main>
      <el-input
        class="filter-input"
        v-model="filter"
        @input="handleFilter"
        placeholder="过滤字段"
        clearable
      />
      <draggable
        v-model="origin"
        v-bind="dragOptions"
        :group="{ name: 'description' }"
        :disabled="disabled"
        @start="disabled = true;"
        @end="disabled = false"
        class="wrapper origin"
      >
        <el-tag class="column" v-for="item in origin" :key="item.prop">{{item.label}}</el-tag>
      </draggable>
      <el-input
        class="filter-input"
        v-model="filterColumn"
        @input="handleFilterColumn"
        placeholder="过滤字段"
        clearable
      />
      <draggable
        v-model="columns"
        v-bind="dragOptions"
        group="description"
        class="wrapper target"
      >
        <el-tag
          class="column"
          v-for="item in columns"
          :key="item.prop"
          :closable="!item.type"
          @close="handleRemove(item.prop)"
        >{{item.label || '多选框'}}</el-tag>
      </draggable>
    </main>
    <footer slot="footer">
      <el-button type="primary" @click="handleSubmit">确定</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </footer>
  </bc-dialog>
</template>

<script>
import draggable from 'vuedraggable'
import tools from '@/utils/tools';
import { setLocalItem } from '@/utils/localStorage';
export default {
  name: 'column-config',
  components: {
    draggable,
  },
  props: {
    visible: Boolean,
    config: Array,
    display: Array,
    tableName: {
      type: String,
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        ghostClass: 'ghost'
      };
    },
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(bool) {
        this.$emit('update:visible', bool);
      }
    },
    currentOptions() {
      const displayProp = this.columns.map(item => item.prop);
      return [...this.config.filter(item => !displayProp.includes(item.prop))];
    },
    currentOptionsColumn() {
      const unselectProp = this.origin.map(item => item.prop);
      return [...this.config.filter(item => !unselectProp.includes(item.prop))];
    }
  },
  data() {
    return {
      filter: '',
      filterColumn: '',
      disabled: false,
      origin: [],
      columns: [],
      handleFilter: null,
      handleFilterColumn: null,
    }
  },
  mounted() {
    this.handleFilter = tools.debounce(this.onfilter, 500);
    this.handleFilterColumn = tools.debounce(this.onfilterColumn, 500);
  },
  methods: {
    onfilter(val) {
      this.origin = this.currentOptions.filter(item => item.label.includes(val));
    },
    onfilterColumn(val) {
      this.columns = this.currentOptionsColumn.filter(item => item.label.includes(val));
    },
    handleRemove(prop) {
      const index = this.columns.findIndex(item => item.prop === prop);
      this.origin.push(this.columns[index]);
      this.columns.splice(index, 1);
    },
    handleOpen() {
      const displayProp = this.display.map(item => item.prop);
      this.origin = [...this.config.filter(item => !displayProp.includes(item.prop))];
      this.columns = [...this.display];
      this.filter = '';
      this.filterColumn = '';
    },
    handleSubmit() {
      this.tableName && setLocalItem(this.tableName, this.columns);
      this.$emit('submit', this.columns);
    }
  }
}
</script>

<style scoped>
.wrapper {
  min-height: 50px;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 10px 10px;
  margin-bottom: 20px;
}
.wrapper .column {
  margin-right: 10px;
}
.filter-input {
  margin-bottom: 20px;
  width: 200px;
}
</style>
