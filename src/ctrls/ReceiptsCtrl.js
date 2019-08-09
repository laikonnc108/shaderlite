import { bookshelf } from '../main'

export class ReceiptDAO {
  
  id
  day
  supplier_id
  supplier_name
  total_nolon 
  recp_given
  comm_rate
  sale_value
  net_value
  recp_paid
  total_current_rest
  total_count
  total_sell_comm
  recp_comm
  out_sale_value
  recp_expenses

  static get INIT_DAO() {
    return { }
  }

  constructor( data= {} ){
    Object.assign(this, data)
  }
  
  parseTypes() {  }
}

export class ReceiptsCtrl {
  /**@type {import('bookshelf').Model} */
  model

  constructor() {
    this.model = require('../models/ReceiptsModel')(bookshelf)
  }

  /**@param {ReceiptDAO} data */
  async save(data) {
    data.parseTypes()
    let record = await this.model.forge(data).save()
    return record.id
  }

  async findAll(filter = {}, options = {}) {
    let all = await this.model.where(filter).fetchAll(options)
    return all.map( _=> new ReceiptDAO(_.attributes))
  }

  async deleteById(id){
    let instance = await this.model.where('id',id).fetch()
    if(instance)
      return await instance.destroy()
    else
      return null
  }

}