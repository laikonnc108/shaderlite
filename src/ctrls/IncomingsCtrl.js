import { bookshelf } from '../main'

export class IncomingDAO {

  id
  day
  supplier_id 
  supplier_name
  product_id 
  count
  nolon
  given
  notes

  // Constant member
  static get INIT_DAO() {
    return {
      //date_created: Date.now() ,
      //nolon: 0,given: 0,
    }
  }

  constructor (data) {
    Object.assign(this, data)
  }

  parseTypes() {
    this.count = parseInt(this.count)
    this.nolon = this.nolon? parseFloat(this.nolon): 0
    this.given = this.given? parseFloat(this.given): 0
  }

  /*
  selectFromObjects() {
    this.supplier_id = this.supplier_select.id
    this.supplier_name = this.supplier_select.name
    this.product_id = this.product_select.id
    this.product_name = this.product_select.name
    
    delete this.supplier_select
    delete this.product_select
  }
  */
}

export class IncomingsCtrl {
  /**@type {import('bookshelf').Model} */
  model

  constructor() {
    this.model = require('../models/IncomingsModel')(bookshelf)
  }

  /**@param {IncomingDAO} data */
  async save(data) {
    data.parseTypes()
    let record = await this.model.forge(data).save()
    return record.id
    // TODO Add Customer Trans
  }

  async findAll(filter = {}, options = {}) {
    
    let all = await this.model.where(filter).fetchAll(options)
    console.log(filter, all)
    return all.map( _=> new IncomingDAO(_.attributes))
  }

  async deleteById(id){
    let instance = await this.model.where('id',id).fetch()
    if(instance)
      return await instance.destroy()
    else
      return null
  }
}