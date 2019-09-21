-- 0.1.11 -- 
products add product_rahn , change product_sell_comm to real
outgoings add product_rahn 

INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") VALUES ('product_rahn', '10', '', 'magdy', 'config');
INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") VALUES ('product_sell_comm', '6', '', 'default', 'config');
INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") VALUES ('product_sell_comm', '3', '', 'magdy', 'config');

INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category") VALUES ('supp_init_payment', 'رصيد اول المدة', 'default', '', '', 'supplier_trans');
INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category") VALUES ('product_rahn', 'رهن طرود', 'default', '+', '', 'customer_trans');

rewrite trans_types

CREATE VIEW v_daily_sums AS 
SELECT days.day as day,
recp_sum_net,
recp_sum_given,
recp_sum_rasd_net,
recp_sum_comm,
recp_sum_deducts,
out_sell_comm,
sum_deducts,
sum_given,
sum_nolon,
sum_supp_payment,
sum_product_rahn,
sum_repay_rahn
FROM
	( select DISTINCT day from outgoings UNION select DISTINCT day from incomings UNION select DISTINCT day from cashflow ) days
LEFT JOIN 
	(select day,
	round(sum(recp_given),2) recp_sum_given,
	round(sum(recp_comm),2) recp_sum_comm,
	round(sum(net_value),2) recp_sum_net,
	sum(recp_deducts) recp_sum_deducts,
	round(sum(CASE  WHEN recp_paid = 1 THEN net_value ELSE 0 END),2) recp_sum_rasd_net
	FROM receipts GROUP By day ) recp_day_g
	ON days.day = recp_day_g.day
LEFT JOIN 
	(select day,
	sum(case when state = 'given' then amount else null end) as sum_given,
	sum(case when state = 'nolon' then amount else null end) as sum_nolon,
	sum(case when state = 'supp_payment' then amount else null end) as sum_supp_payment,
	sum(case when state in (select name FROM trans_types where category = 'cashflow' and optional = 1) then amount else null end) sum_deducts
	from cashflow  GROUP by day ) cash_deducts
	ON  days.day = cash_deducts.day
LEFT JOIN 
	(select day,
	sum(case when trans_type = 'product_rahn' then amount else null end) as sum_product_rahn,
	abs(sum(case when trans_type = 'repay_cust_rahn' then amount else null end)) as sum_repay_rahn
	from customer_trans group by day ) cust_rahn_g
	ON  days.day = cust_rahn_g.day
LEFT JOIN
	(select day, sum(sell_comm * count) out_sell_comm FROM outgoings GROUP By day) outgoings_day_g
	ON days.day = outgoings_day_g.day;
----
CREATE VIEW v_inout_heads AS
SELECT 
v_inc.day as day,
v_inc.supplier_id as supplier_id,
v_inc.product_id as product_id,
v_inc.inc_count as inc_count,
v_out.sold_count as sold_count,
(v_inc.inc_count - IFNULL(v_out.sold_count, 0)) as diff,
suppliers.name as supplier_name,
products.name as product_name,
products.product_sell_comm as product_sell_comm,
products.product_rahn as product_rahn
FROM
	(SELECT day, supplier_id, product_id, sum(count) as 'inc_count' FROM incomings group by day,supplier_id , product_id) v_inc
LEFT JOIN
	(SELECT income_day, supplier_id, product_id, sum(count) as 'sold_count' from outgoings  group by income_day,supplier_id , product_id) v_out
ON 
	v_inc.day = v_out.income_day and v_inc.supplier_id = v_out.supplier_id and v_inc.product_id = v_out.product_id
LEFT JOIN 
	suppliers ON v_inc.supplier_id = suppliers.id
LEFT JOIN 
	products ON v_inc.product_id = products.id;
---
CREATE VIEW v_out_sums AS
SELECT
income_day,
supplier_id,
product_id,
products.name as product_name,
kg_price,
sell_comm,
sum_weight,
sum_count
FROM
	(SELECT income_day,	supplier_id, product_id, kg_price, sell_comm, sum(weight) as sum_weight, sum(count) as sum_count
	FROM outgoings
	GROUP BY income_day, kg_price , product_id, supplier_id, sell_comm ) out_sums
LEFT JOIN products ON out_sums.product_id = products.id;
---
CREATE VIEW v_recp_sums AS SELECT 
day,
recp_gsums.supplier_id as supplier_id,
suppliers.name as supplier_name,
sum_recp_comm,
sum_sale_value,
sum_net_value,
sum_total_nolon,
sum_recp_expenses,
sum_recp_given,
sum_recp_deducts,
sum_total_count,
concat_recp_paid,
sum_out_value,
sum_sell_comm,
products_concat,
sum_rasd_net
FROM 
    (SELECT 
    day as day,
    supplier_id as supplier_id,
    sum(recp_comm) as sum_recp_comm,
    sum(sale_value) as sum_sale_value,
    sum(net_value) as sum_net_value,
    sum(total_nolon) as sum_total_nolon ,
    sum(total_count) as sum_total_count ,
    sum(recp_given) as sum_recp_given ,
    sum(recp_expenses) as sum_recp_expenses,
	sum(recp_deducts) as sum_recp_deducts,
    group_concat(recp_paid) as concat_recp_paid,
	sum(CASE  
		WHEN recp_paid = 1 THEN net_value 
			ELSE 0 
        END) as sum_rasd_net
    from receipts 
    GROUP by supplier_id, day) recp_gsums
  JOIN 
    (SELECT income_day,	
    supplier_id,
    sum(kg_price *weight) as sum_out_value ,
    sum(sell_comm * count) as sum_sell_comm ,
    group_concat(DISTINCT(product_id)) as products_concat
    FROM outgoings
    GROUP BY income_day, supplier_id ) out_gsums
  ON  
    recp_gsums.day = out_gsums.income_day and recp_gsums.supplier_id = out_gsums.supplier_id
  JOIN
    suppliers on recp_gsums.supplier_id = suppliers.id;

-- 0.1.11 -- 
UPDATE customer_trans set amount = - (amount) where sum = '-' and amount > 0;
UPDATE supplier_trans set amount = - (amount) where sum = '-' and amount > 0;

CREATE VIEW v_daily_sums AS 
SELECT days.day as day,
recp_sum_net,
recp_sum_given,
recp_sum_rasd_net,
recp_sum_comm,
recp_sum_deducts,
out_sell_comm,
sum_deducts,
sum_given,
sum_nolon
FROM
	( select DISTINCT day from outgoings UNION select DISTINCT day from incomings UNION select DISTINCT day from cashflow ) days
LEFT JOIN 
	(select day,
	round(sum(recp_given),2) recp_sum_given,
	round(sum(recp_comm),2) recp_sum_comm,
	round(sum(net_value),2) recp_sum_net,
	sum(recp_deducts) recp_sum_deducts,
	round(sum(CASE  WHEN recp_paid = 1 THEN net_value ELSE 0 END),2) recp_sum_rasd_net
	FROM receipts GROUP By day ) recp_day_g
	ON days.day = recp_day_g.day
LEFT JOIN 
	(select day,
	sum(case when state = 'given' then amount else null end) as sum_given,
	sum(case when state = 'nolon' then amount else null end) as sum_nolon,
	sum(case when state in (select name FROM trans_types where category = 'cashflow' and optional = 1) then amount else null end) sum_deducts
	from cashflow  GROUP by day ) cash_deducts
	ON  days.day = cash_deducts.day
LEFT JOIN
	(select day, sum(sell_comm * count) out_sell_comm FROM outgoings GROUP By day) outgoings_day_g
	ON days.day = outgoings_day_g.day
-- 0.1.10 --

CREATE VIEW v_daily_sums AS 
SELECT days.day as day,
recp_sum_net,
recp_sum_given,
recp_sum_rasd_net,
recp_sum_comm,
out_sell_comm,
sum_deducts
FROM
	( select DISTINCT day from outgoings UNION select DISTINCT day from incomings UNION select DISTINCT day from cashflow ) days
LEFT JOIN 
	(select day, round(sum(recp_given),2) recp_sum_given , round(sum(recp_comm),2) recp_sum_comm, round(sum(net_value),2) recp_sum_net , 
	round(sum(CASE  
		WHEN recp_paid = 1 THEN net_value 
			ELSE 0 
		END)
	,2) recp_sum_rasd_net from receipts GROUP By day ) recp_day_g
	ON days.day = recp_day_g.day
LEFT JOIN 
	(select day, sum(amount) as sum_deducts from cashflow  where state in (select name FROM trans_types where category = 'cashflow' and optional = 1)  group by day) cash_deducts
	ON  days.day = cash_deducts.day
LEFT JOIN
	(select day, sum(sell_comm * count) out_sell_comm FROM outgoings GROUP By day) outgoings_day_g
	ON days.day = outgoings_day_g.day

-- 0.1.9 --
add receipt_id to supplier_trans
INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category") VALUES ('recp_deducts', 'خصم الفلاح', 'default', '-', '', 'supplier_trans');
-- 0.1.8
CREATE VIEW v_recp_sums AS SELECT 
day,
recp_gsums.supplier_id as supplier_id,
suppliers.name as supplier_name,
sum_recp_comm,
sum_sale_value,
sum_net_value,
sum_total_nolon,
sum_recp_expenses,
sum_recp_given,
sum_recp_deducts,
sum_total_count,
concat_recp_paid,
sum_out_value,
sum_sell_comm,
products_concat,
sum_rasd_net
FROM 
    (SELECT 
    day as day,
    supplier_id as supplier_id,
    sum(recp_comm) as sum_recp_comm,
    sum(sale_value) as sum_sale_value,
    sum(net_value) as sum_net_value,
    sum(total_nolon) as sum_total_nolon ,
    sum(total_count) as sum_total_count ,
    sum(recp_given) as sum_recp_given ,
    sum(recp_expenses) as sum_recp_expenses,
	sum(recp_deducts) as sum_recp_deducts,
    group_concat(recp_paid) as concat_recp_paid,
	sum(CASE  
		WHEN recp_paid = 1 THEN net_value 
			ELSE 0 
        END) as sum_rasd_net
    from receipts 
    GROUP by supplier_id, day) recp_gsums
  JOIN 
    (SELECT income_day,	
    supplier_id,
    sum(kg_price *weight) as sum_out_value ,
    sum(sell_comm * count) as sum_sell_comm ,
    group_concat(DISTINCT(product_id)) as products_concat
    FROM outgoings
    GROUP BY income_day, supplier_id ) out_gsums
  ON  
    recp_gsums.day = out_gsums.income_day and recp_gsums.supplier_id = out_gsums.supplier_id
  JOIN
    suppliers on recp_gsums.supplier_id = suppliers.id
--
CREATE VIEW v_daily_sums AS SELECT days.day as day,
recp_sum_net,
recp_sum_given,
recp_sum_rasd_net,
sum_deducts
FROM
	( select DISTINCT day from outgoings UNION select DISTINCT day from incomings UNION select DISTINCT day from cashflow ) days
LEFT JOIN 
	(select day, round(sum(recp_given),2) recp_sum_given , round(sum(net_value),2) recp_sum_net , 
	round(sum(CASE  
		WHEN recp_paid = 1 THEN net_value 
			ELSE 0 
		END)
	,2) recp_sum_rasd_net from receipts GROUP By day ) recp_day_g
	ON days.day = recp_day_g.day
LEFT JOIN 
	(select day, sum(amount) as sum_deducts from cashflow  where state in (select name FROM trans_types where category = 'cashflow' and optional = 1)  group by day) cash_deducts
	ON  days.day = cash_deducts.day
-- 11/9 --
--change supp_recp_expensess to supp_recp_expenses
-- تعديل اسم supp_recp_expensess لمجدي
-- https://transfer.sh/kiduO/shaderlite.db

--==============================================================--

-- 1 / 9 --
-- rename trans_types.in_deduct to optional
CREATE VIEW v_daily_sums AS
SELECT days.day as day,
recp_sum_net,
recp_sum_given,
recp_sum_rasd_net,
sum_deducts
FROM
	( select DISTINCT day from outgoings UNION select DISTINCT day from incomings UNION select DISTINCT day from cashflow ) days
LEFT JOIN 
	(select day, round(sum(recp_given),2) recp_sum_given , round(sum(net_value),2) recp_sum_net , 
	round(sum(CASE  
		WHEN recp_paid = 1 THEN net_value 
			ELSE 0 
		END)
	,2) recp_sum_rasd_net from receipts GROUP By day ) recp_day_g
	ON days.day = recp_day_g.day
LEFT JOIN 
	(select day, sum(amount) as sum_deducts from cashflow  where state in (select name FROM trans_types where category = 'cashflow' and optional = 1)  group by day) cash_deducts
	ON  days.day = cash_deducts.day;

-- Add ShaderName as primary key to trans_types

UPDATE customer_trans set debt_after = NULL;
-- rename customer_trans.debt_after to debt_was
-- remove developer mode in shader_configs

INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") VALUES ('outgoing_notes', 'ملاحظات', '', 'default', 'label');
INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") VALUES ('outgoing_notes', 'عربون', '', 'magdy', 'label');
INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") VALUES ('given', 'دخان', '', 'magdy', 'label');
INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") VALUES ('printed', 'تم الطباعة', '', 'default', 'label');

INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") VALUES ('pay_arboon', 'true', '', 'magdy', 'config');

INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category", "map_cashflow") VALUES ('repay_cust_trust', 'رد امانة', 'default', '+', '3', 'customer_trans', 'repay_cust_trust');
INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category", "map_cashflow") VALUES ('repay_cust_trust', 'رد امانة', 'default', '-', '', 'cashflow', '');
INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category", "map_cashflow") VALUES ('cust_rahn', 'رهن', 'default', '-', '3', 'customer_trans', 'cust_rahn');
INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category", "map_cashflow") VALUES ('cust_rahn', 'رهن', 'default', '+', '2', 'cashflow', '');
INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category", "map_cashflow") VALUES ('repay_cust_rahn', 'رد الرهن', 'default', '+', '3', 'customer_trans', 'repay_cust_rahn');
INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category", "map_cashflow") VALUES ('repay_cust_rahn', 'رد الرهن', 'default', '-', '1', 'cashflow', '');

ALTER TABLE receipts add printed INTEGER

-- 25 / 8  --
CREATE TABLE "customers_daily" (
	"day"	TEXT NOT NULL,
	"customer_id"	INTEGER NOT NULL,
	"printed"	INTEGER,
	PRIMARY KEY("day","customer_id")
);

ALTER TABLE incomings add group_id INTEGER;
ALTER TABLE customers add nat_id TEXT;

INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") VALUES ('search_incomings', 'بحث في الوارد', '', 'default', 'label');
INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") VALUES ('search_receipts', 'بحث في الفواتير', '', 'default', 'label');
INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") VALUES ('new_day_opens', '16', '', 'magdy', 'config');
INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") VALUES ('search_outgoings', 'بحث في المبيعات', '', 'default', 'label');

INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "in_deduct", "category", "map_cashflow") VALUES ('sum_outgoing', 'كشف مبيعات تاجر', 'default', '+', '', 'customer_trans', '');