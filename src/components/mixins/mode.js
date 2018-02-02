export default {

  inject: ['context'],

  computed: {
    mode () {
      return this.context.mode
    }
  }
}
