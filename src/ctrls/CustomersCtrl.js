import { bookshelf, knex } from '../main'

export class CustomerDAO {

  id 
  name 
  debt 
  phone
  address
  nat_id
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
  notes
  count
  weight
  kg_price
  actual_sale

  constructor(data = {}) {
    Object.assign(this, data)
  }

  static get INIT_DAO() {
    return { }
  }

  /**@param {import('./TransTypesCtrl').TransTypeDAO} transDAO */
  set transType(transDAO) {
    this.trans_type = transDAO.name
    this.sum = transDAO.sum
  }

  parseTypes () {
    this.amount = this.amount? parseFloat(this.amount): 0
    this.actual_sale = this.actual_sale? parseFloat(this.actual_sale) : 0
    delete this.weight
    delete this.kg_price
  }
}

export class CustomersCtrl {
  /**@type {import('bookshelf').Model} */
  model

  /**@type {import('bookshelf').Model} */
  customerTransModel

  constructor() {
    this.model = require('../models/CustomersModel')(bookshelf)
    this.customerTransModel = require('../models/CustomerTransModel')(bookshelf)
  }

  /**@param {CustomerDAO} data */
  async save(data) {
    data.parseTypes()
    let record = await this.model.forge(data).save()
    return record.id
    // TODO Add Customer Trans with debt
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

  async findOne(id) {
    let one = await this.model.forge('id',id).fetch()
    return new CustomerDAO(one.toJSON())
  }

  async getDailyOutTrans(filter= {id:null , day: ''}) {
    let daily_out_trans = await this.customerTransModel
    .where({customer_id: filter.id, day:filter.day, trans_type: 'outgoing' }).fetchAll({withRelated:['outgoing','product']})

    return daily_out_trans.map( _=> {
      let transDAO = new CustomerTransDAO(_.attributes)
      if(_.related('outgoing')){
        transDAO.kg_price = _.related('outgoing').get('kg_price')
        transDAO.weight = _.related('outgoing').get('weight')
        transDAO.count = _.related('outgoing').get('count')
        transDAO.product_name = _.related('product').get('name')
      }
      return transDAO
    })
  }

  async getCustomerTrans(filter= {id:null , day: ''}) {

    let results = await knex.raw(`
select null as id,day,sum(amount) as amount, 'sum_outgoing' as trans_type  from customer_trans 
where customer_id = ${filter.id} and trans_type ='outgoing' GROUP BY day
UNION
select id, day , amount , trans_type  from customer_trans 
where customer_id = ${filter.id} and trans_type <> 'outgoing'
    `)
    return results.map(_ => new CustomerTransDAO(_))
  }

  /**@param {CustomerTransDAO} transDAO */
  async updateDebtByTrans(transDAO) {
    /**@type {import('bookshelf').ModelBase} */
    let instance = await this.model.forge('id',transDAO.customer_id).fetch()
    let debt = parseFloat(instance.get('debt')) ? parseFloat(instance.get('debt')) : 0
    if(transDAO.sum === '+') {
      debt += parseFloat(transDAO.amount)
    } else if(transDAO.sum === '-'){
      debt -= parseFloat(transDAO.amount)
    }
    await instance.save({debt: debt})
    return await this.createCustomerTrans(transDAO)
  }

  /**@param {CustomerTransDAO} transDAO */
  async createCustomerTrans(transDAO) {
    transDAO.parseTypes()
    let trans_record = await this.customerTransModel.forge(transDAO).save()
    return trans_record.id
  }

  /**@param {CustomerTransDAO} transDAO */
  async removeCustomerTrans(transDAO) {

    /**@type {import('bookshelf').ModelBase} */
    let customerInstance = await this.model.forge('id',transDAO.customer_id).fetch()
    let debt = customerInstance.get('debt')
    let amount = parseFloat(transDAO.amount)
    // TODO more organized !
    if(transDAO.sum == '+') {
      debt = parseFloat(debt) - amount
    } else {
      debt = parseFloat(debt) + amount
    }

    await customerInstance.save({debt: debt})
    let transInstance = await this.customerTransModel.where('id', transDAO.id).fetch()
    await transInstance.destroy()
    return true 
  }

  async removeTransByOutgoingId(outgoing_id) {
    /**@type {import('bookshelf').ModelBase} */
    let customerInstance = await this.customerTransModel.where('outgoing_id', outgoing_id).fetch()
    if(customerInstance){
      let transDAO = new CustomerTransDAO(customerInstance.toJSON())
      await this.removeCustomerTrans(transDAO)
    }
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