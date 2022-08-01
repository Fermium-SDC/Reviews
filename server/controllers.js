const models = require('./models');

module.exports = {
  get: (req, res) => {
    console.log('getter');
    if (!req.query.product_id) res.status(422).send('No product ID given');
    models.getReviews(
      req.query.page,
      req.query.count,
      req.query.product_id,
      req.query.sort,
      (err, response) => {
        const formattedObj = {
          product: req.query.product_id,
          page: req.query.page || 0,
          count: req.query.count || 5,
          results: response.rows,
        };
        console.log(response.rows)
        res.status(200).send(formattedObj);
      }
    );
  },
  getMeta: (req, res) => {
    models.getMetaQuery(req.query.product_id).then((response) => {
      res.status(200).send(response.rows[0].json_build_object);
    });
    console.log('getmeta');
  },
  post: (req, res) => {
    console.log(req.body);
  },
  put: (req, res) => {
    //request.params.product_id
    console.log('put');
  },
};
