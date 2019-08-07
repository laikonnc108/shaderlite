import { bookshelf } from '../main'

export class CashflowDAO {

  id
  day
  state
  d_product
  sum
  amount
  notes
  outgoing_id
  incoming_id
  supplier_id
  supplier_name
  customer_id
  customer_name
    
  static get INIT_DAO() {
    return { }
  }

  /**@param {import('./TransTypesCtrl').TransTypeDAO} transDAO */
  set transType(transDAO) {
    this.state = transDAO.name
    this.sum = transDAO.sum
  }

  parseTypes () {
    this.amount = this.amount? Math.abs(parseFloat(this.amount).toFixed(2)) : 0
    delete this.customer_name
    delete this.supplier_name
  }

  constructor( data ){
    Object.assign(this, data)
  }
}

export class CashflowCtrl {
  /**@type {import('bookshelf').Model} */
  model

  constructor() {
    this.model = require('../models/CashflowModel')(bookshelf)
  }

  /**@param {CashflowDAO} data */
  async save(data) {
    data.parseTypes()
    let record = await this.model.forge(data).save()
    return record.id
  }


  async findAll(filter = {}) {
      // {withRelated: ['supplier','product','customer']}
    let all = await this.model.where(filter).fetchAll()
    return all.map( _=> {
      let outDAO = new CashflowDAO(_.attributes)

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