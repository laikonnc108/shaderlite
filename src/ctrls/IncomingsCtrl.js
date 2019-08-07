import { bookshelf } from '../main'
import { CashflowDAO , CashflowCtrl} from './CashflowCtrl';
import { TransTypesCtrl } from './TransTypesCtrl';

export class IncomingDAO {

  id
  day
  supplier_id
  supplier_name
  product_id 
  product_name
  count

  // Constant member
  static get INIT_DAO() {
    return { }
  }

  constructor (data) {
    Object.assign(this, data)
  }

  parseTypes() {
    this.count = parseInt(this.count)
    this.product_id = parseInt(this.product_id)
    delete this.supplier_name
    delete this.product_name
  }
}

export class IncomingsData {
  day
  supplier_id
  products_arr = []
  nolon
  given

  static get INIT_DAO() {
    return { }
  }

  constructor (data) {
    Object.assign(this, data)
  }

  parseTypes() {
    this.nolon = this.nolon ? parseFloat(this.nolon): 0
    this.given = this.given ? parseFloat(this.given): 0
  }
}

export class IncomingsCtrl {
  /**@type {import('bookshelf').Model} */
  model
  /**@type {TransTypesCtrl} */
  transTypesCtrl
  /**@type {CashflowCtrl} */
  cashflowCtrl

  constructor() {
    this.model = require('../models/IncomingsModel')(bookshelf)
    this.transTypesCtrl = new TransTypesCtrl()
    this.cashflowCtrl = new CashflowCtrl()
  }

  /**@param {IncomingDAO} data */
  async save(data) {
    data.parseTypes()
    let record = await this.model.forge(data).save()
    return record.id
    // TODO Add Customer Trans
  }

  /**@param {IncomingsData} data */
  async saveIncomingsData(data) {
    
    data.parseTypes()
    let saved_ids = [] , products_ids = []
    data.products_arr.forEach( async product => {
      products_ids.push(product.id)
      let incDAO = new IncomingDAO({day: data.day,
        supplier_id: data.supplier_id,
        product_id: product.id,
        count: product.count
      })
      incDAO.parseTypes()
      let record = await this.model.forge(incDAO).save()
      saved_ids.push(record.id)
    })
    // then add nolon and given cashflows
    if(data.nolon) {
      let nolonTrans = await this.transTypesCtrl.findOne({name: 'nolon', category: 'cashflow'})
      let cashDAO = new CashflowDAO({
        amount: data.nolon,
        supplier_id: data.supplier_id,
        day: data.day,
        d_product: products_ids.join()
      })
      cashDAO.transType = nolonTrans
      this.cashflowCtrl.save(cashDAO)
    }
    return saved_ids
  }

  async findAll(filter = {}) {
    let all = await this.model.where(filter).fetchAll({withRelated: ['supplier','product']})
    return all.map( _=> {
      let incDAO = new IncomingDAO(_.attributes)
      incDAO.supplier_name = _.related('supplier').get('name')
      incDAO.product_name = _.related('product').get('name')
      return incDAO
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