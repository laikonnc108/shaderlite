-- version 1.33 -- 
ALTER TABLE receipts add cashflow_id INTEGER;

INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") 
VALUES ('shader_name', 'mmn1', '', 'default', 'config');
---

INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category") VALUES ('product_rahn_external', 'رهن', 'default', '+', '3', 'customer_trans');
-- config.json file
INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category", "map_cashflow") VALUES ('aarbon', 'عربون', 'default', '-', '', 'customer_trans', 'aarbon');
INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category", "map_cashflow") VALUES ('aarbon', 'عربون', 'default', '+', '', 'cashflow', '');
INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category", "map_cashflow") VALUES ('repay_rahn_internal', 'عربون', 'default', '-', '', 'customer_trans', '');
INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category") VALUES ('ex_comm', 'عمولة + بياعة', 'default', '-', '', 'cashflow');
INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category") VALUES ('ex_mashal', 'اجمالي المشال', 'default', '-', '', 'cashflow');

update cashflow set income_day = day where state = 'supp_recp_expenses';
ALTER TABLE cashflow add income_day TEXT;

----
INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category") VALUES ('ex_momen', 'حساب شركاء - معلم مؤمن', 'default', '-', '', 'cashflow');
INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category") VALUES ('ex_said', 'حساب شركاء - معلم السيد', 'default', '-', '', 'cashflow');
INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category") VALUES ('ex_mohamed', 'مصروف كاتب استاذ محمد', 'default', '-', '1', 'cashflow');
INSERT INTO "main"."trans_types" ("name", "ar_name", "shader_name", "sum", "optional", "category") VALUES ('ex_hisham', 'مصروف كاتب استاذ هشام', 'default', '-', '1', 'cashflow');
INSERT INTO "main"."shader_configs" ("config_name", "config_value", "config_verify", "shader_name", "category") VALUES ('init_recp_given', '1', '', 'mmn1', 'config');

-- Add Net Weight option
ALTER TABLE products add weight_deduct REAL;
--  alter v_inout_heads VIEW

