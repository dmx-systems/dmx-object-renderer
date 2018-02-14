export default {
  props: {
    mode: {
      type: String,
      required: false,
      default: 'info',
      validator: mode => ['info', 'form'].includes(mode)
    }
  }
}
