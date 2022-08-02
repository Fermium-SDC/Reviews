CREATE TABLE "Reviews"(
    "id" SERIAL PRIMARY KEY,
    "product_Id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "recommend" BOOLEAN NOT NULL,
    "reported" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "response" TEXT NULL,
    "helpfulness" INTEGER NOT NULL
);
CREATE INDEX "reviews_product_id_index" ON
    "Reviews"("product_Id");

CREATE TABLE "Characteristics"(
    "id" SERIAL PRIMARY KEY,
    "product_id" INTEGER NOT NULL,
    "Name" TEXT NOT NULL
);

CREATE TABLE "Photos"(
    "id" SERIAL PRIMARY KEY,
    "review_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL
);

CREATE TABLE "Characteristic Reviews"(
    "id" SERIAL PRIMARY KEY,
    "characteristic_id" INTEGER NOT NULL,
    "review_id" INTEGER NOT NULL,
    "value" INTEGER NOT NULL
);

ALTER TABLE
    "Photos" ADD CONSTRAINT "photos_review_id_foreign" FOREIGN KEY("review_id") REFERENCES "Reviews"("id");
ALTER TABLE
    "Characteristic Reviews" ADD CONSTRAINT "characteristic reviews_characteristic_id_foreign" FOREIGN KEY("characteristic_id") REFERENCES "Characteristics"("id");
ALTER TABLE
    "Characteristic Reviews" ADD CONSTRAINT "characteristic reviews_review_id_foreign" FOREIGN KEY("review_id") REFERENCES "Reviews"("id");