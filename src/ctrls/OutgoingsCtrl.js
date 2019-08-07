import { bookshelf } from '../main'

export class OutgoingDAO {

  id
  day
  income_day    
  supplier_id
  supplier_name
  product_id
  product_name
  customer_id  
  customer_name
  sell_comm
  sell_comm_value
  kg_price
  weight
  count
  value_calc
  collecting
  notes

  parseTypes () {
    this.count = parseInt(this.count)
    this.sell_comm = this.sell_comm ? parseFloat(this.sell_comm) : 0
    this.kg_price = this.kg_price ? parseFloat(this.kg_price) : 0
    this.weight = this.weight ? parseFloat(this.weight) : 0
    this.sell_comm_value = this.sell_comm_value ? parseFloat(this.sell_comm_value) : 0
    this.value_calc = this.value_calc ? parseFloat(this.value_calc).toFixed(2) : 0
    delete this.supplier_name
    delete this.product_name
    delete this.customer_name
  }

  // Constant member
  static get INIT_DAO() {
    return { sell_comm: 6 }
  }

  constructor (data) {
    Object.assign(this, data)
  }
}


export class OutgoingsCtrl {
  /**@type {import('bookshelf').Model} */
  model

  constructor() {
    this.model = require('../models/OutgoingsModel')(bookshelf)
  }

  /**@param {OutgoingDAO} data */
  async save(data) {
    data.parseTypes()
    let record = await this.model.forge(data).save()
    return record.id
  }

  async findAll(filter = {}) {
    let all = await this.model.where(filter).fetchAll({withRelated: ['supplier','product','customer']})
    return all.map( _=> {
      let outDAO = new OutgoingDAO(_.attributes)
      outDAO.supplier_name = _.related('supplier').get('name')
      outDAO.product_name = _.related('product').get('name')
      outDAO.customer_name = _.related('customer').get('name')
      return outDAO
    })
  }

  async findDailyCustomers(filter = {day:'',}) {
    let all = await this.model.query(q => {
      q.distinct('customer_id')
      q.whereNotNull('customer_id')
    }).where(filter).orderBy('customer_id','ASC').fetchAll({withRelated: ['customer']})

    return all.map( _=> {
      let outDAO = new OutgoingDAO(_.attributes)
      outDAO.customer_name = _.related('customer').get('name')
      return outDAO
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