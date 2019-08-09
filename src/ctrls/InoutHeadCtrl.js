import {knex} from '../main'

export class InoutHeadCtrl {

  async findAll(options = { day: '' , diff : ''}){
    let results = []
    if (options.diff == '> 0' && options.day) {
      results = await knex('v_inout_heads').where('diff', '>' , 0).andWhere('day', '<=', options.day)
    }
    else if (options.day) {
      results = await knex('v_inout_heads').where('day', options.day)
    }
    return results
  }

  async findOne(options = { day: '' , supplier_id : 0, product_id: 0}) {
    let results = {}
    results = await knex('v_inout_heads').where('day', options.day)
    .andWhere('supplier_id', options.supplier_id)
    .andWhere('product_id',  options.product_id)
    .first()
    return results
  }

  async findDailySuppliers(options = { day: ''}) {
    console.log(options)
    let query = `
SELECT 
  inoutv.day as day,
  inoutv.supplier_id as supplier_id,
  inoutv.supplier_name as supplier_name,
  inoutv.sum_diff as sum_diff,
  inoutv.sum_inc as sum_inc,
  inoutv.products_concat as products_concat,
  receipts.total_count as recp_total_count,
  receipts.recp_paid as recp_paid
From
  (SELECT v_inout_heads.day, v_inout_heads.supplier_id, v_inout_heads.supplier_name, sum(inc_count) as sum_inc, sum(v_inout_heads.diff) as sum_diff, group_concat(v_inout_heads.product_name) as products_concat from v_inout_heads GROUP BY day,supplier_id) inoutv
LEFT JOIN 
  receipts on inoutv.day = receipts.day and inoutv.supplier_id = receipts.supplier_id
WHERE
  inoutv.day = '${options.day}'`

    return await knex.raw(query)
  }
}