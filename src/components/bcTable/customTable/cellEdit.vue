<script>
export default {
  name: 'cell-edit',
  props: {
    value: [String, Number],
    unit: String,
  },
  directives: {
    focus: {
      inserted: el => {
        el.querySelector('input').focus();
      }
    }
  },
  data() {
    return {
      editing: false,
      cell: '',
    }
  },
  methods: {
    save() {
      // this.toggleEdit();
      this.$refs.bcInput.blur();
      this.$emit('save', this.cell)
    },
    toggleEdit() {
      this.editing = !this.editing;
    }
  },
  render() {
    return this.editing
      ? <bc-input
        class="edit-input"
        ref="bcInput"
        v-focus
        value={this.cell}
        on-input={val => { this.cell = val }}
        on-focus={() => { this.cell = this.value }}
        on-blur={this.toggleEdit}
        nativeOn-keyup={(e) => { e.code === 'Enter' && this.save() }}
      >
        {!!this.unit && <div slot="suffix">{this.unit}</div>}
      </bc-input>
      : <div class="cell-edit" on-click={this.toggleEdit}>{this.value}</div>
  }
}
</script>

<style scoped>
.edit-input {
  font-size: 12px !important;
}
.edit-input /deep/ input {
  font-family: YaHei;
  height: 23px;
  line-height: 23px;
}
.cell-edit {
  padding: 0 15px;
  text-overflow: ellipsis;
  overflow: hidden;
}
.cell-edit:hover {
  padding: 0 14px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
}
</style>
