const state = {

  object: undefined,        // The displayed Topic/Assoc/TopicType/AssocType.
                            // If undefined nothing is displayed.

  writable: undefined,      // True if the current user has WRITE permission for the displayed object.

  mode: undefined,          // 'info' or 'form'

  inlineCompId: undefined,  // ID of the dm5-object component that is in inline edit mode

  objectRenderers: {},      // Registered page renderers:
                            //   {
                            //     typeUri: component
                            //   }

  quill: undefined          // The Quill instance deployed in form mode.
                            // FIXME: support more than one Quill instance per form.
}

const actions = {

  displayObject (_, object) {
    // console.log('displayObject')
    state.object = object.isType() ? object.asType() : object
    _initWritable()
    cancelEdit()    // Note: inline state is still set when inline editing was left without saving
  },

  emptyDisplay () {
    // console.log('emptyDisplay')
    state.object = undefined
  },

  edit () {
    console.log('edit', state.object)
    state.object.fillChilds()
    state.mode = 'form'
  },

  editInline (_, compId) {
    state.inlineCompId = compId
  },

  // TODO: move to webclient.js?
  submit ({dispatch}) {
    state.object.update().then(object => {
      dispatch('_processDirectives', object.directives)
    })
    cancelEdit()
  },

  registerObjectRenderer (_, {typeUri, component}) {
    state.objectRenderers[typeUri] = component
  },

  setQuill (_, quill) {
    state.quill = quill
  },

  createTopicLink (_, topic) {
    console.log('createTopicLink', topic)
    state.quill.format('topic-link', {
      topicId: topic.id,
      linkId: undefined   // TODO
    })
  },

  //

  loggedIn () {
    initWritable()
  },

  loggedOut () {
    initWritable()
    cancelEdit()
  }
}

function initWritable() {
   state.object && _initWritable()
 }

function _initWritable() {
  state.object.isWritable().then(writable => {
    state.writable = writable
  })
}

function cancelEdit () {
  state.mode = 'info'               // cancel form edit
  state.inlineCompId = undefined    // cancel inline edit
}

export default {
  state,
  actions
}
