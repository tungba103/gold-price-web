-- CreateTable
CREATE TABLE "gold_prices" (
    "id" SERIAL NOT NULL,
    "company" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "buy_price" DOUBLE PRECISION NOT NULL,
    "sell_price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "gold_prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gold_prices_company_date_key" ON "gold_prices"("company", "date");
