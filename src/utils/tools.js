function updateData(params, prop, val, context) {
  if (context.updateData) {
    context.updateData(prop, val);
  } else {
    params[prop] = val;
  }
}
function handleSearch(context) {
  if (context.handleSearch) {
    context.handleSearch();
  }
}

export function generateInput(h, value, item, context) {
  const { catalog, prop, name, options, ...params } = item;
  if (catalog === 'input') {
    return <bc-input
      value={value[prop]}
      placeholder={name}
      on-input={(val) => updateData(value, prop, val, context)}
      nativeOn-keyup={(e) => e.code === 'Enter' && handleSearch(context)}
      {...{ attrs: params }}
    />
  } else if (catalog === 'select') {
    return <bc-select
      value={value[prop]}
      placeholder={name}
      on-input={(val) => updateData(value, prop, val, context)}
      on-change={() => handleSearch(context)}
      options={item.options}
      {...{ attrs: params }}
    />
  } else if (catalog === 'datepicker') {
    return <bc-date-picker
      value={value[prop]}
      placeholder={name}
      on-input={(val) => updateData(value, prop, val, context)}
      on-change={() => handleSearch(context)}
      {...{
        attrs: {
          // valueFormat: 'yyyy-MM-dd',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          rangeSeparator: '至',
          ...params,
        }
      }}
    />
  } else if (catalog === 'projectBiz') {
    return (<search-project-bizUse
      value={value}
      // on-input={(val) => this.$emit('update:params', val)}
      on-input={(val) => context.$emit('input', val)}
      on-input={() => handleSearch(context)}
      {...{ attrs: params }}
    />);
  } else if (catalog === 'ip') {
    return (<server-select
      value={value[prop]}
      placeholder={name}
      on-input={(val) => updateData(value, prop, val, context)}
    />)
  } else {
    return context.$slots[item.prop] || context.$parent.$scopedSlots[item.property]();
  }
};
