
-- 1.42
INSERT INTO "shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") 
VALUES ('F_MMN1_PASS', '4242', '', 'mmn1', 'config');

CREATE TABLE "daily_close" (
	"day"	TEXT NOT NULL,
	"closed"	TEXT,
	"net_cash"	REAL,
	"json"	TEXT,
	PRIMARY KEY("day")
);

insert into daily_close ('day', 'closed') 
select DISTINCT(day), 'true' as true from cashflow where day < '2020-02-01';

-- 1.41
-- https://github.com/fireb1001/shaderlite/releases/

INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category") 
VALUES ('dealer_init', 'رصيد', 'default', '+', '', 'dealer_trans');

INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category", "map_cashflow") 
VALUES ('dealer_pay', 'دفع تعامل', 'default', '+', '', 'dealer_trans', 'dealer_pay');

INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category", "map_cashflow") 
VALUES ('dealer_pay', 'دفع تعامل', 'default', '-', '', 'cashflow', '');

INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category", "map_cashflow") 
VALUES ('dealer_collect', 'تحصيل تعامل', 'default', '-', '', 'dealer_trans', 'dealer_collect');

INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category", "map_cashflow") 
VALUES ('dealer_collect', 'تحصيل تعامل', 'default', '+', '', 'cashflow', '');

INSERT INTO "main"."shader_configs" 
("config_name", "config_value", "config_verify", "shader_name", "category") 
VALUES ('manage_dealers', 'ادارة المعاملات', '', 'default', 'label');


alter TABLE cashflow add dealer_id INTEGER;

CREATE TABLE dealers (
	id	INTEGER PRIMARY KEY AUTOINCREMENT,
	name	TEXT NOT NULL UNIQUE,
	phone	TEXT,
	deleted_at	INTEGER,
	balance REAL,
	notes	TEXT
);


CREATE TABLE dealer_trans (id INTEGER PRIMARY KEY AUTOINCREMENT,
day TEXT NOT NULL,
dealer_id INTEGER NOT NULL,
cashflow_id INTEGER,
amount REAL,
trans_type TEXT,
sum TEXT,
notes TEXT, FOREIGN KEY (dealer_id) REFERENCES dealers (id));


-- version 1.40
ALTER TABLE products add cust_mashal REAL;

-- version 1.38
INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") 
VALUES ('init_mashal', '.35', '', 'amn1', 'config');
ALTER TABLE suppliers add box_count INTEGER;


-- version 1.35 

INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category")
VALUES ('F_AARBON_OUT', 'true', '', 'mmn1', 'config');

INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category")
VALUES ('F_RECP_EXPENSES_INC', 'true', '', 'mmn1', 'config');

INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category")
VALUES ('F_REPAY_RAHN_KASHF', 'true', '', 'mmn1', 'config');

INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category")
VALUES ('F_AARBON_KASHF', 'true', '', 'mmn1', 'config');

INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category")
VALUES ('F_SHOW_DEBT_KASHF', 'true', '', 'mmn1', 'config');

INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") 
VALUES ('shader_name', 'nada', '', 'default', 'config');

-- version 1.33 -- 
ALTER TABLE receipts add cashflow_id INTEGER;
ALTER TABLE cashflow add income_day TEXT;
update cashflow set income_day = day where state = 'supp_recp_expenses';

-- Add Net Weight option
ALTER TABLE products add weight_deduct REAL;


--- ------------------------

INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category")
VALUES ('product_rahn_external', 'رهن', 'default', '+', '3', 'customer_trans');
-- config.json file
INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category", "map_cashflow")
VALUES ('aarbon', 'عربون', 'default', '-', '', 'customer_trans', 'aarbon');

INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category", "map_cashflow")
VALUES ('aarbon', 'عربون', 'default', '+', '', 'cashflow', '');

INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category", "map_cashflow")
VALUES ('repay_rahn_internal', 'عربون', 'default', '-', '', 'customer_trans', '');

INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category")
VALUES ('ex_comm', 'عمولة + بياعة', 'default', '-', '', 'cashflow');

INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category")
VALUES ('ex_mashal', 'اجمالي المشال', 'default', '-', '', 'cashflow');

INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category")
VALUES ('ex_momen', 'حساب شركاء - معلم مؤمن', 'default', '-', '', 'cashflow');

INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category")
VALUES ('ex_said', 'حساب شركاء - معلم السيد', 'default', '-', '', 'cashflow');

INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category")
VALUES ('ex_mohamed', 'مصروف كاتب استاذ محمد', 'default', '-', '1', 'cashflow');

INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category")
VALUES ('ex_hisham', 'مصروف كاتب استاذ هشام', 'default', '-', '1', 'cashflow');

INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") 
VALUES ('init_recp_given', '1', '', 'mmn1', 'config');


