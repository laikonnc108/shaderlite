import { remote } from 'electron'
import { mapState } from 'vuex'
const { clipboard } = require('electron')

export const MainMixin = {
  data(){
    return {
      clipboard: clipboard,
      search_term: ''
    }
  },
  computed : {
    ...mapState([
      'day',
      'logged_in_user',
      'app_config',
      'shader_configs',
      'custom_labels',
      'products_arr'
    ])
  },
  methods: {
    async print_co(){
      const contents = remote.getCurrentWebContents()
      let silent = this.$store.state.shader_configs['silent_print'] ? this.$store.state.shader_configs['silent_print'] : false ; 
      // override silent
      silent = this.$store.state.app_config.env.NODE_ENV == 'development' ? false : silent ; 
      contents.print({silent: silent })
    },
  }
}