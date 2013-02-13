var Backbone = require('backbone');

/**
 * This interface was determined ahead of time by considering
 * how a collection could be sliced up and turned into a second
 * collection.
 *
 * @param {function(Backbone.Model):Object} criteriaFn
 * @param {Backbone.Collection} collection
 * @return {Backbone.Collection}
 */
var facetCollection = function (criteriaFn, collection) {
  var facetedCollection = new Backbone.Collection();

  facetedCollection.add({
    title: 'Trivial',
    count: collection.length
  });

  return facetedCollection;
};

module.exports = {
  facetCollection: facetCollection
};