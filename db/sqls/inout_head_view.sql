CREATE VIEW inout_head
AS
SELECT 
v_inc.day as day,
v_inc.supplier_id as supplier_id,
v_inc.product_id as product_id,
v_inc.inc_count as inc_count,
v_out.sold_count as sold_count,
(v_inc.inc_count - IFNULL(v_out.sold_count, 0)) as diff
FROM
	(SELECT day, supplier_id, product_id, sum(count) as 'inc_count' FROM incomings group by day,supplier_id , product_id) v_inc
LEFT JOIN
	(SELECT income_day, supplier_id, product_id, sum(count) as 'sold_count' from outgoings  group by income_day,supplier_id , product_id) v_out
ON 
	v_inc.day = v_out.income_day and v_inc.supplier_id = v_out.supplier_id and v_inc.product_id = v_out.product_id