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
    // this.details= this.details? JSON.stringify(this.details) : null
    delete this.details
  }
}

export class ReceiptDetailDAO {

  id
  receipt_id
  day
  supplier_id
  kg_price
  product_id
  weight
  count

  constructor( data= {} ){
    Object.assign(this, data)
  }
  
  parseTypes() { 
  }
}

export class ReceiptsCtrl {
  /**@type {import('bookshelf').Model} */
  model
  /**@type {import('bookshelf').Collection} */
  detailsColl

  constructor() {
    this.model = require('../models/ReceiptsModel')(bookshelf).model
    this.detailsColl = require('../models/ReceiptsModel')(bookshelf).detailsColl
  }

  /**@param {ReceiptDAO} data */
  async save(data) {
    let details_arr = data.details
    data.parseTypes()
    if(data.id) {
      await this.deleteDetailsById(data.id)
    }
    let record = await this.model.forge(data).save()

    details_arr.forEach(item => {
      item.receipt_id = record.id
    })

    let recp_details = this.detailsColl.forge(details_arr)
    await recp_details.invokeThen('save')

    return record.id
  }

  /**@returns {Array} */
  async findAll(filter = {}) {
    let all = await this.model.where(filter).fetchAll({withRelated: ['supplier','details']})
    return all.map( _=> {
      let dao = new ReceiptDAO(_.attributes)
      dao.supplier_name = _.related('supplier').get('name')
      /**@type {Array} */
      let details = _.related('details').toJSON()
      details.forEach(record => {
        dao.details.push(new ReceiptDetailDAO(record))
      })
      return dao
    })
  }

  async deleteById(id){
    let instance = await this.model.where('id',id).fetch()
    if(instance) {
      await instance.details().invokeThen('destroy')
      return await instance.destroy()
    }
    else
      return null
  }

  async deleteDetailsById(id) {
    let instance = await this.model.where('id',id).fetch()
    return await instance.details().invokeThen('destroy')
  }

}