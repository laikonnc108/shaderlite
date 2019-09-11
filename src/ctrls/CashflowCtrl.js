import { bookshelf, knex } from '../main'

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
  income_day
  kg_price
  count
  weight

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
    delete this.income_day
    delete this.count
    delete this.kg_price
    delete this.weight
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
    let all = await this.model.where(filter).fetchAll({withRelated: ['outgoing','customer','supplier']})
    return all.map( _=> {
      let cashDAO = new CashflowDAO(_.attributes)
      cashDAO.income_day = _.related('outgoing').get('income_day')
      cashDAO.count = _.related('outgoing').get('count')
      cashDAO.kg_price = _.related('outgoing').get('kg_price')
      cashDAO.weight = _.related('outgoing').get('weight')
      cashDAO.customer_name = _.related('customer').get('name')
      cashDAO.supplier_name = _.related('supplier').get('name')
      return cashDAO
    })
  }

  async getSupplierNolons(filter = {day: '' , supplier_id : 0 }){
    let query = `SELECT supplier_id, day, sum(amount) as total_nolon from cashflow WHERE 
    state= 'nolon' and supplier_id = '${filter.supplier_id}' and day = '${filter.day}'`
    let results = await knex.raw(query)
    let total_nolon = (results && results.length > 0) ? results[0].total_nolon : 0
    return total_nolon
  }

  async getSupplierRecpExpenses(filter = {day: '' , supplier_id : 0 }){
    let query = `SELECT supplier_id, day, amount as recp_expenses from cashflow WHERE 
    state= 'supp_recp_expenses' and supplier_id = '${filter.supplier_id}' and day = '${filter.day}'`
    let results = await knex.raw(query)
    let recp_expenses = (results && results.length > 0) ? results[0].recp_expenses : 0
    return recp_expenses
  }
  // async removeByOutgoingId(outgoing_id) { }

  async deleteById(id){
    let instance = await this.model.where('id',id).fetch()
    if(instance)
      return await instance.destroy()
    else
      return null
  }
}