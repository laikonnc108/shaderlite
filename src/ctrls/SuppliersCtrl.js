import { bookshelf } from '../main'

export class SupplierDAO {

  id 
  name 
  balance 
  phone
  address
  notes
  is_self
  deleted_at

  static get INIT_DAO() {
    return { }
  }

  parseTypes() {
    this.balance = this.debt ? parseFloat(this.debt) : 0 
  }

  constructor (data) {
    Object.assign(this, data)
  }
}

export class SuppliersCtrl {
  /**@type {import('bookshelf').Model} */
  model

  constructor() {
    this.model = require('../models/SuppliersModel')(bookshelf)
  }

  /**@param {SupplierDAO} data */
  async create(data) {
    data.parseTypes()

    // It Creates And Saves !!!
    return await this.model.forge(data).save()
    // TODO Add Customer Trans
  }

  async findAll(filter = {}) {
    let all = await this.model.where(filter).fetchAll({softDelete: false})
    console.log(all.toJSON())
    return all.map( _=> new SupplierDAO(_.attributes))
  }

  async deleteById(id){
    
    let instance = await this.model.where('id',id).fetch()
    if(instance)
      return await instance.destroy()
    else
      return null
  }

  async resotreById(id) {
    /**@type import('bookshelf').ModelBase */
    let instance = await this.model.where('id',id).fetch({softDelete: false})
    instance.set('deleted_at',null)
    return await instance.save()
  }
}