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
  details = []
  serial

  static get INIT_DAO() {
    return { 
      recp_paid: 0
    }
  }

  constructor( data= {} ){
    Object.assign(this, data)
  }
  
  parseTypes() { 
    this.details= this.details? JSON.stringify(this.details) : null
  }
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

  /**@returns {Array} */
  async findAll(filter = {}) {
    let all = await this.model.where(filter).fetchAll({withRelated: ['supplier']})
    return all.map( _=> {
      let dao = new ReceiptDAO(_.attributes)
      dao.supplier_name = _.related('supplier').get('name')
      return dao
    })
  }

  async deleteById(id){
    let instance = await this.model.where('id',id).fetch()
    if(instance)
      return await instance.destroy()
    else
      return null
  }

}