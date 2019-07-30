import { bookshelf } from '../main'

export class CustomerDAO {

  id 
  name 
  debt 
  phone
  address
  notes
  is_self
  deleted_at
  active

  /*
  static get INIT_DAO() {
    return { }
  }
  */

  parseTypes() {
    this.debt = parseFloat(this.debt)
  }

  constructor (data) {
    Object.assign(this, data)
    if(! this.deleted_at)
      this.active = 1
  }
}

export class CustomersCtrl {
  /**@type {import('bookshelf').Model} */
  model

  constructor() {
    this.model = require('../models/CustomersModel')(bookshelf)
  }

  async findAll(filter = {}) {
    let all = await this.model.where(filter).fetchAll()
    return all.map( _=> new CustomerDAO(_.attributes))
  }

  async deleteById(id){
    
    let instance = await this.model.where('id',id).fetch()
    if(instance)
      return await instance.destroy()
    else
      return null
  }
}