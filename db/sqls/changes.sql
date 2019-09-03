-- 1 / 9 --
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
-- rename trans_types.in_deduct to optional
UPDATE customer_trans set debt_after = NULL;
-- rename customer_trans.debt_after to debt_was

INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") VALUES ('outgoing_notes', 'ملاحظات', '', 'default', 'label');
INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") VALUES ('outgoing_notes', 'عربون', '', 'magdy', 'label');
INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") VALUES ('given', 'دخان', '', 'magdy', 'label');
INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") VALUES ('printed', 'تم الطباعة', '', 'default', 'label');

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