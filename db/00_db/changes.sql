CREATE TABLE "customers_daily" (
	"day"	TEXT NOT NULL,
	"customer_id"	INTEGER NOT NULL,
	"printed"	INTEGER,
	PRIMARY KEY("day","customer_id")
)