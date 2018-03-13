class TopicLinkManager {

  constructor (quill, dispatch) {
    // console.log('TopicLinkManager', dispatch)
    quill.getModule('toolbar').addHandler('topic-link', buttonHandler)
    buttonIcon()

    function buttonHandler (value) {
      // TODO: decouple from host application
      // Note: "this" refers to the Toolbar instance
      // console.log('buttonHandler', value)
      dispatch('openSearchWidget', {
        pos: {
          model:  {x: 100, y: 100},   // TODO
          render: {x: 100, y: 100}
        },
        options: {
          noSelect: true,
          auxAction: "createTopicLink"
        }
      })
    }

    function buttonIcon () {
      const button = document.querySelector('button.ql-topic-link')
      button.textContent = 'T'    // TODO: use real (SVG) icon
      button.setAttribute('title', 'Embed a topic link')
    }
  }

  static addLinkHandlers (html, linkClicked) {

    html.querySelectorAll('a.topic-link').forEach(link => {
      link.addEventListener('click', linkHandler)
    })

    function linkHandler (e) {
      e.preventDefault()    // suppress browser's default link click behavior
      e.stopPropagation()   // prevent activating inline edit
      const topicId = Number(e.target.dataset.topicId)
      console.log('in-app link clicked!', topicId)
      linkClicked(topicId)
    }
  }
}

export default TopicLinkManager
