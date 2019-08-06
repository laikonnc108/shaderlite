import { bookshelf } from '../main'

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

  constructor() {
    this.model = require('../models/IncomingsModel')(bookshelf)
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
    let saved_ids = []
    data.products_arr.forEach( async product => {
      console.log ("product", product)
      console.log (data.day, data.supplier_id)
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