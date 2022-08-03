const models = require('./models');

module.exports = {
  get: (req, res) => {
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
        res.status(200).send(formattedObj);
      }
    );
  },
  getMeta: (req, res) => {
    models.getMetaQuery(req.query.product_id).then((response) => {
      res.status(200).send(response.rows[0].json_build_object);
    });
  },
  post: (req, res) => {
    models
      .post(req.body)
      .then((response) => res.status(201).send('Review posted 🚀'))
      .catch((err) => {
        res.send('Could not post');
      });
  },
  putHelp: (req, res) => {
    //request.params.product_id
    models
      .putHelp(req.params.review_id)
      .then((response) => res.send('Updated Successfully'))
      .catch(() => res.send('Could not update'));
  },
  putReport: (req, res) => {
    //request.params.product_id
    models
      .putReport(req.params.review_id)
      .then((response) => res.send('Reported Successfully'))
      .catch(() => res.send('Could not report'));
  },
};
