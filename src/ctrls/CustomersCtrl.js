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

  static get INIT_DAO() {
    return { }
  }

  parseTypes() {
    this.debt = this.debt ? parseFloat(this.debt) : 0 
  }

  constructor (data) {
    Object.assign(this, data)
  }
}

/**
 * CustomerTransDAO
 * 
*/
export class CustomerTransDAO {

  id
  day
  customer_id
  outgoing_id
  product_id
  product_name
  cashflow_id
  amount
  sum
  trans_type
  debt_after
  notes
  count
  weight
  kg_price
  actual_sale

  constructor(data = {}) {
    Object.assign(this, data)
  }

  static get INIT_DAO() {
    return { sum: '+' }
  }

  parseTypes () {
    this.amount = this.amount? parseFloat(this.amount): 0
    this.debt_after = this.debt_after? parseFloat(this.debt_after) : 0
    this.actual_sale = this.actual_sale? parseFloat(this.actual_sale) : 0
  }
}

export class CustomersCtrl {
  /**@type {import('bookshelf').Model} */
  model

  constructor() {
    this.model = require('../models/CustomersModel')(bookshelf)
  }

  /**@param {CustomerDAO} data */
  async save(data) {
    data.parseTypes()
    let record = await this.model.forge(data).save()
    return record.id
    // TODO Add Customer Trans
  }

  async findAll(filter = {}, options = {}) {

    let all = await this.model.where(filter).fetchAll(options)
    return all.map( _=> new CustomerDAO(_.attributes))
  }

  async getCustomerDetails(id){
    let one = await this.model.forge('id',id).fetch({withRelated:['trans']})
    let trans = one.related('trans').map( _=> new CustomerTransDAO(_.attributes))
    return {dao: new CustomerDAO(one.toJSON()), trans: trans}
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