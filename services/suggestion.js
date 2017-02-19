const Yelp = require('yelp');
const User = require('../models/user');

const yelp = new Yelp({
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_TOKEN_SECRET,
});

exports.get = (req, res) => {
  const userId = req.user.sub;
  const { lat, long } = req.query;
  // const { lat, long } = req.body;
  // if (!lat || !long) {
  //   return res.status(400).send({
  //     result: 'Missing lat and long',
  //   });
  // }
  User.findOne({ userId }).then((user) => {
    yelp.search({
      limit: 20,
      term: 'food',
      // location: 'tampa',
      category_filter: user.interests.join().replace(/\s+/g, ''),
      ll: `${lat},${long}`
    })
      .then((data) => {
        // console.log(data);
        if (data.total == 0) {
          return res.status(400).send({
            result: 'Unable to search',
          })
        }
        console.log(data);
        return data.businesses.filter((restaurant) => !user.blacklist.includes(restaurant.id));
      })
      .then((filtered1) => req.query.history ?
        filtered1.filter((restaurant) => !user.history.includes(restaurant.id)) : filtered1)
      .then((filter2) => filter2[0])
      .then((restaurant) => {
        if (!user.history.includes(restaurant.id)) {
          user.history.push(restaurant.id);
          user.save();
        }
        return restaurant;
      })
      .then((restaurant) => res.status(200).send({
        id: restaurant.id,
        address: `${restaurant.location.address[0]}, ${restaurant.location.city}, ${restaurant.location.state_code}`,
        name: restaurant.name,
        image_url: restaurant.image_url,
        phone: restaurant.display_phone,
      }))
  })
  .catch(function (err) {
    console.error(err);
    return res.status(400).send(err);
  });
};
