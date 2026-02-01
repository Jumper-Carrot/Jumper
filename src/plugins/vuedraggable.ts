// vuedraggable global registration for GalleryPage.vue
import { App } from 'vue'
import draggable from 'vuedraggable'

export default {
  install(app: App) {
    app.component('draggable', draggable)
  }
}
