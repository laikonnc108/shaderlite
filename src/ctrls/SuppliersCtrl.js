import { bookshelf, knex } from '../main'

export class SupplierDAO {

  id 
  name 
  balance 
  sum_debt
  phone
  address
  notes
  //is_self
  deleted_at

  static get INIT_DAO() {
    return { name: '' }
  }

  parseTypes() {
    this.balance = this.debt ? parseFloat(this.debt) : 0 
    delete this.sum_debt
  }

  constructor (data) {
    Object.assign(this, data)
    
  }
}

export class SupplierTransDAO {

  id
  supplier_id
  day
  cashflow_id
  amount
  trans_type
  sum
  balance_after
  receipt_id
  notes

  static get INIT_DAO() {
    return { }
  }

  parseTypes () {
    this.amount = this.amount? parseFloat(this.amount) : 0
    delete this.products
    delete this.count

  }

  /**@param {import('./TransTypesCtrl').TransTypeDAO} transDAO */
  set transType(transDAO) {
    this.trans_type = transDAO.name
    this.sum = transDAO.sum
  }

  constructor (data) {
    Object.assign(this, data)
  }
}

export class SuppliersCtrl {
  /**@type {import('bookshelf').Model} */
  model

  /**@type {import('bookshelf').Model} */
  supplierTransModel

  constructor() {
    this.model = require('../models/SuppliersModel')(bookshelf)
    this.supplierTransModel = require('../models/SupplierTransModel')(bookshelf)
  }

  /**@param {SupplierDAO} data */
  async save(data) {
    data.parseTypes()
    let record = await this.model.forge(data).save()
    return record.id
  }

  /**@param {SupplierTransDAO} transDAO */
  async updateBalanceByTrans(transDAO) {
    /**@type {import('bookshelf').ModelBase} */
    let instance = await this.model.forge('id',transDAO.supplier_id).fetch()
    let balance = parseFloat(instance.get('balance')) ? parseFloat(instance.get('balance')) : 0
    /*
    if(transDAO.sum === '+') {
      balance += parseFloat(transDAO.amount)
    } else if(transDAO.sum === '-'){
      balance -= parseFloat(transDAO.amount)
    }
    await instance.save({balance: balance})
    transDAO.balance_after = balance
    return await this.createSupplierTrans(transDAO)
    */

    if(transDAO.sum == '-')
      transDAO.amount = - parseFloat(transDAO.amount)
    await this.createSupplierTrans(transDAO)
    
    balance += parseFloat(transDAO.amount)

    return await instance.save({balance: balance})
  }

  /**@param {SupplierTransDAO} transDAO */
  async createSupplierTrans(transDAO) {
    transDAO.parseTypes()

    if(transDAO.trans_type == 'supp_pre_payment') {
      transDAO.trans_type = 'supp_payment'
    }

    let trans_record = await this.supplierTransModel.forge(transDAO).save()
    return trans_record.id
  }

  /**@param {SupplierTransDAO} transDAO */
  async saveSupplierTrans(transDAO) {
    transDAO.parseTypes()
    let trans_record
    if(transDAO.trans_type == 'supp_pre_payment') {
      transDAO.trans_type = 'supp_payment'
    }
    if(transDAO.receipt_id) {
      let foundTrans = await this.supplierTransModel.where('receipt_id',transDAO.receipt_id).fetch()
      if(foundTrans) {
        trans_record = await foundTrans.save({amount: transDAO.amount})
      } else {
        trans_record = await this.supplierTransModel.forge(transDAO).save()
      }

    } else {
      trans_record = await this.supplierTransModel.forge(transDAO).save()
    }

    return trans_record.id
  }

  async findAll(filter = {}, options = {}) {
    /*
    let all = await this.model.where(filter).fetchAll(options)
    return all.map( _=> new SupplierDAO(_.attributes))
    */
   let results = await knex.raw(`
   select * from (select * from suppliers ) suppliers_g
   LEFT JOIN ( select supplier_id, sum(amount) as sum_debt from supplier_trans group by supplier_id ) supplier_trans_g
   ON suppliers_g.id = supplier_trans_g.supplier_id
   `)

   return results.map( _=> new SupplierDAO(_))
  }

  
  async findById(id) {
    let instance = await this.model.where('id',id).fetch({withRelated:[
    {'trans': function(qb){
      qb.orderBy('day','desc')
    }}
    ],softDelete: false})
    return new SupplierDAO(instance.attributes)
  }

  async sumDebt(){
    let result = await knex.raw(`select sum(balance) as sum_debt from suppliers where deleted_at is null`)
    return result.length > 0 ? result[0] : null
  }

  async getSupplierDetails(id){
    let one = await this.model.forge('id',id).fetch({withRelated:[
      {'trans': function(qb){
        qb.orderBy('day')
      }}
      ],softDelete: false})
    let trans = one.related('trans').map( _=> new SupplierTransDAO(_.attributes))
    return {dao: new SupplierDAO(one.toJSON()), trans: trans}
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