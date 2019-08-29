import { bookshelf, knex } from '../main'
import { CustomersCtrl, CustomerTransDAO } from './CustomersCtrl'
import { TransTypesCtrl } from './TransTypesCtrl';
import { CashflowCtrl, CashflowDAO} from './CashflowCtrl'

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
  sum_count
  sum_weight

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
    delete this.sum_count
    delete this.sum_weight
  }

  // Constant member
  static get INIT_DAO() {
    return { }
  }

  constructor (data) {
    Object.assign(this, data)
  }
}

export class OutgoingsCtrl {
  /**@type {import('bookshelf').Model} */
  model
  /**@type {TransTypesCtrl} */
  transTypesCtrl

  constructor() {
    this.model = require('../models/OutgoingsModel')(bookshelf)
    this.transTypesCtrl = new TransTypesCtrl()
  }

  /**@param {OutgoingDAO} data */
  async save(data) {
    data.parseTypes()
    let record = await this.model.forge(data).save()
    return record.id
  }

  /**@param {OutgoingDAO} data */
  async saveOutgoingData(data) {
    let out_id = await this.save(data)
    // console.log(data)
    if(data.customer_id){
      let outgoingTrans = await this.transTypesCtrl.findOne({name: 'outgoing', category: 'customer_trans'})
      
      let customerTrans = new CustomerTransDAO()
      customerTrans.transType = outgoingTrans
      customerTrans.day = data.day
      customerTrans.amount = parseFloat(data.value_calc)
      customerTrans.customer_id = data.customer_id
      customerTrans.outgoing_id = out_id
      customerTrans.product_id = data.product_id

      let customersCtrl = new CustomersCtrl()
      await customersCtrl.updateDebtByTrans(customerTrans)
    } else {
      // Create cashflow with outgoing
      let cashflowTrans =  await this.transTypesCtrl.findOne({name: 'outgoing_cash', category: 'cashflow'})
      let cashDAO = new CashflowDAO({
        day: data.day,
        d_product: data.product_id
      })
      cashDAO.transType = cashflowTrans
      cashDAO.outgoing_id = out_id
      cashDAO.amount = parseFloat(data.value_calc)

      let cashflowCtrl = new CashflowCtrl()
      await cashflowCtrl.save(cashDAO)
    }

    return out_id
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

  async getLastKgPrice(product_id) {
    let last_kg_price = await knex.raw(`SELECT kg_price from outgoings where product_id = ${product_id} ORDER BY id DESC LIMIT 1`)
    last_kg_price = last_kg_price[0] ? parseFloat(last_kg_price[0].kg_price) : null
    return last_kg_price
  }

  async findDailyCustomers(filter = {day:'',}) {
    let all = await this.model.query(q => {
      q.distinct('customer_id')
      q.whereNotNull('customer_id')
    }).where(filter).orderBy('customer_id','ASC').fetchAll({withRelated: ['customer','customers_daily']})

    return all.map( _=> {
      let outDAO = new OutgoingDAO(_.attributes)
      outDAO.customer_name = _.related('customer').get('name')
      outDAO.printed =  _.related('customers_daily').get('printed')
      return outDAO
    })
  }

  async findSuppDaySums(filter = {supplier_id: null, day: null}){
    let results = await knex('v_out_sums').where('income_day', filter.day)
    .andWhere('supplier_id', filter.supplier_id).orderBy('kg_price', 'desc')

    return results.map(item => new OutgoingDAO(item))
  }

  async deleteById(id){
    let instance = await this.model.where('id',id).fetch()
    if(instance)
      return await instance.destroy()
    else
      return null
  }
}