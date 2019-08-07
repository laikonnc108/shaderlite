import { bookshelf } from '../main'

export class TransTypeDAO {
 
  name 
  ar_name 
  shader_name
  sum
  in_deduct
  category
  map_cashflow

  static get INIT_DAO() {
    return { }
  }

  parseTypes() {
  }

  constructor (data) {
    Object.assign(this, data)
  }
}

export class TransTypesCtrl {
  /**@type {import('bookshelf').Model} */
  model

  constructor() {
    this.model = require('../models/TransTypesModel')(bookshelf)
  }

  /**@param {TransTypeDAO} data */
  async save(data) {
    data.parseTypes()
    let record = await this.model.forge(data).save()
    return record.id
  }

  async findAll(filter = {}) {
    let all = await this.model.where(filter).fetchAll({})
    return all.map( _=> new TransTypeDAO(_.attributes))
  }

  /**@returns {TransTypeDAO} */
  async findOne(filter = {}) {
    let transTypeInst = await this.model.where(filter).fetch()
    return new TransTypeDAO(transTypeInst.attributes)
  }

  async deleteById(id){
    
    let instance = await this.model.where('id',id).fetch()
    if(instance)
      return await instance.destroy()
    else
      return null
  }

}