Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    name: String,
    color: String,
    size: String,
    rpxSize: String,
    classPrefix: {
      type: String,
      value: 'remix',
    },
  },
})
