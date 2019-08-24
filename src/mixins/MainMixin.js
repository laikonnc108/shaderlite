import { remote } from 'electron'
import { mapState } from 'vuex'
const { clipboard } = require('electron')

export const MainMixin = {
  data(){
    return {
      clipboard: clipboard,
    }
  },
  computed : {
    ...mapState([
      'day',
      'logged_in_user',
      'shader_configs'
    ])
  },
  methods: {
    print_co(){
      const contents = remote.getCurrentWebContents()
      contents.print({silent: true })
    },
  }
}