CREATE TABLE "Reviews"(
    "id" INTEGER NOT NULL,
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
ALTER TABLE
    "Reviews" ADD PRIMARY KEY("id");
CREATE TABLE "Characteristics"(
    "id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "Name" TEXT NOT NULL
);
ALTER TABLE
    "Characteristics" ADD PRIMARY KEY("id");
CREATE TABLE "Photos"(
    "id" INTEGER NOT NULL,
    "review_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL
);
ALTER TABLE
    "Photos" ADD PRIMARY KEY("id");
CREATE TABLE "Characteristic Reviews"(
    "id" INTEGER NOT NULL,
    "characteristic_id" INTEGER NOT NULL,
    "review_id" INTEGER NOT NULL,
    "value" INTEGER NOT NULL
);
ALTER TABLE
    "Characteristic Reviews" ADD PRIMARY KEY("id");
ALTER TABLE
    "Photos" ADD CONSTRAINT "photos_review_id_foreign" FOREIGN KEY("review_id") REFERENCES "Reviews"("id");
ALTER TABLE
    "Characteristic Reviews" ADD CONSTRAINT "characteristic reviews_characteristic_id_foreign" FOREIGN KEY("characteristic_id") REFERENCES "Characteristics"("id");
ALTER TABLE
    "Characteristic Reviews" ADD CONSTRAINT "characteristic reviews_review_id_foreign" FOREIGN KEY("review_id") REFERENCES "Reviews"("id");