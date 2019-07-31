import { bookshelf } from '../main'

export class ShaderConfigsCtrl {
  /**@type {import('bookshelf').Model} */
  model

  constructor() {
    this.model = require('../models/ShaderConfigsModel')(bookshelf)
  }
  
  async godada(){
    /**@type {import('bookshelf').ModelBase} */
    let tata = await this.model.forge({
        config_name: 'hamoda'
    }).save()

    console.log(tata.toJSON())
    console.log(tata.id)
  }

  findAll(filter = {}) {
    
    /*
    let all = await this.model.findAll()
    // OR
    let all = await this.model.collection().query(function(qb) {
      qb.where('shader_name', '=', 'nada')
    }).fetch()
    */
    return this.model.where(filter).fetchAll()
  }

  async getAppLabels(){

    let all_labels = await this.findAll({shader_name: 'default',category:'label'})
    let labels_arr = []
    // Can do map 
    all_labels.forEach( element => {
      element.get('config_name')
      labels_arr[element.get('config_name')] = element.get('config_value')
    });
    // Override with custom labels
    let custom_labels = await this.findAll({shader_name: 'magdy',category:'label'})
    custom_labels.forEach( element => {
      element.get('config_name')
      labels_arr[element.get('config_name')] = element.get('config_value')
    });
    return labels_arr
  }
}