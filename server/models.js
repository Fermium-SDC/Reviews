const db = require('./db');

module.exports = {

  getReviews: (
    page = 1,
    count = 5,
    product_Id = 1,
    sort = 'newest',
    callback
  ) => {
    let sortQuery;
    switch (sort) {
      case 'helpful':
        sortQuery = 'helpfulness';
        break;
      case 'relevant':
        sortQuery = 'helpfulness, date';
        break;
      default:
        sortQuery = 'date';
        break;
    }
    
    const query = `SELECT
    "Reviews".id AS review_id,
   "Reviews".rating AS rating,
    "Reviews".summary AS summary,
    "Reviews".recommend AS recommend,
    "Reviews".response AS response,
    "Reviews".body AS body,
    "Reviews".date AS "date",
    "Reviews".name AS reviewer_name,
    "Reviews".helpfulness AS helpfulness,
    (SELECT COALESCE(json_agg(photoArray), '[]') FROM (SELECT "Photos".id, "Photos".url FROM "Photos" WHERE "Photos".review_id = "Reviews".id) AS photoArray) photos
 FROM "Reviews" WHERE "product_Id" = $1 AND reported = false ORDER BY ${sortQuery} DESC LIMIT $2 OFFSET $3;`;
    db.query(
      query,

      [product_Id, count, count * page - count],
      (err, res) => callback(err, res)
    );
  },

  getMetaQuery: (product_Id = 1) => {
    //Incorrect do next
    const queryStr = `SELECT json_build_object(
    'product_id', (SELECT "product_Id" FROM "Reviews" WHERE "product_Id" = $1 LIMIT 1),
      'ratings', json_build_object('1',(SELECT COUNT(*) FROM "Reviews" WHERE "product_Id" = $1 AND "rating" = 1),
                    '2',(SELECT COUNT(*) FROM "Reviews" WHERE "product_Id" = $1 AND "rating" = 2),
                    '3',(SELECT COUNT(*) FROM "Reviews" WHERE "product_Id" = $1 AND "rating" = 3),
                    '4',(SELECT COUNT(*) FROM "Reviews" WHERE "product_Id" = $1 AND "rating" = 4),
                    '5',(SELECT COUNT(*) FROM "Reviews" WHERE "product_Id" = $1 AND "rating" = 5)
                    ),
     'recommended', json_build_object(false , (SELECT COUNT(*) FROM "Reviews" WHERE "product_Id" = $1 AND "recommend" = false),
                     true, (SELECT COUNT(*) FROM "Reviews" WHERE "product_Id" = $1 AND "recommend" = true)
                     ),
     'charachteristics', (SELECT jsonb_object_agg("Name", json_build_object('id', characteristic_id,'value', value))
     FROM "Characteristics"
     JOIN "Characteristic Reviews"
     ON "Characteristics".id = "Characteristic Reviews".characteristic_id
     WHERE "Characteristics".product_id = 1000)
    );`;
    const queryArg = product_Id;
    return db.query(queryStr, [queryArg]);
  },

  post: (data) => {
    const keys = Object.keys(data.characteristics);
    const values = Object.values(data.characteristics);
    const queryStr = `WITH ins1 AS (
      INSERT INTO "Reviews"("product_Id", rating, date, summary, body, recommend, reported, name, email, response, helpfulness)
      VALUES ($1, $2, current_timestamp, $3, $4, $5,false, $6, $7, null, 0)
      RETURNING id AS current_review_id
      )
   , ins2 AS (
      INSERT INTO "Photos" (review_id, url)
      VALUES ((SELECT current_review_id FROM ins1), UNNEST($8::text[]))
      )
   INSERT INTO "Characteristic Reviews" (characteristic_id, review_id, "value")
   VALUES (UNNEST(ARRAY [${keys}]), (SELECT current_review_id FROM ins1),(UNNEST(ARRAY [${values}])))
   `;
    const queryArg = [
      data.product_id,
      data.rating,
      data.summary,
      data.body,
      data.recommend,
      data.name,
      data.email,
      data.photos,
    ];
    return db.query(queryStr, queryArg);
  },

  putHelp: (review_id) => {
    const query = `UPDATE "Reviews"
    SET helpfulness = helpfulness + 1
    WHERE "id" = $1`;
    const queryArg = [review_id];
    return db.query(query, queryArg);
  },

  putReport: (review_id) => {
    const query = `UPDATE "Reviews"
    SET reported = true
    WHERE "id" = $1`;
    const queryArg = [review_id];
    return db.query(query, queryArg);
  },
};
