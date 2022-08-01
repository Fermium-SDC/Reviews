const db = require('./db');

module.exports = {
  // getReviews: (page = 1, count = 5, product_Id = 1, sort = 'newest', callback) => {
  //   db.query(
  //     `SELECT * FROM "Reviews" WHERE "product_Id"=${product_Id} LIMIT ${count} OFFSET ${(count * page) - count};`,
  //     (err, res) => callback(err, res),
  //   );
  // },
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
    // const query = `SELECT id AS review_id, rating, summary, recommend, response, body, date, name AS reviewer_name, helpfulness FROM "Reviews" WHERE "product_Id"=$1 ORDER BY ${sortQuery} DESC LIMIT $2 OFFSET $3;`;
    const query = `SELECT jsonb_build_object (
      'product', "Reviews".id,
      'rating', "Reviews".rating,
      'summary', "Reviews".summary,
      'recommend', "Reviews".recommend,
      'response', "Reviews".response,
      'body', "Reviews".body,
      'date', "Reviews".date,
      'reviewer_name', "Reviews".name,
      'helpfulness', "Reviews".helpfulness,
      'photos', (SELECT COALESCE(json_agg(photoArray), '[]') FROM (SELECT id, url FROM "Photos" WHERE review_id = "Reviews".id) AS photoArray)
    ) FROM "Reviews" WHERE "product_Id"=$1 ORDER BY ${sortQuery} DESC LIMIT $2 OFFSET $3;`;
    db.query(
      query,

      [product_Id, count, count * page - count],
      (err, res) => callback(err, res),
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

  post: (product_Id = 1) => {
    db.query();
  },

  put: (product_Id) => {
    db.query(``);
  },
};
