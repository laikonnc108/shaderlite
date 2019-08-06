import { bookshelf } from '../main'

export class OutgoingDAO {

  id
  day
  income_day    
  supplier_id
  product_id
  customer_id  
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
    this.value_calc = this.value_calc ? parseFloat(this.value_calc) : 0
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
    this.model = require('../models/IncomingsModel')(bookshelf)
  }

  /**@param {OutgoingDAO} data */
  async save(data) {
    data.parseTypes()
    let record = await this.model.forge(data).save()
    return record.id
  }


  async findAll(filter = {}) {
    /*
    let all = await this.model.where(filter).fetchAll({withRelated: ['supplier','product']})
    return all.map( _=> {
      let incDAO = new OutgoingDAO(_.attributes)
      incDAO.supplier_name = _.related('supplier').get('name')
      incDAO.product_name = _.related('product').get('name')
      return incDAO
    })
    */
  }

  async deleteById(id){
    let instance = await this.model.where('id',id).fetch()
    if(instance)
      return await instance.destroy()
    else
      return null
  }
}