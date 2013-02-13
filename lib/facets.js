var Backbone = require('backbone');

/**
 * Facet model, contains 'id', 'title', and 'count'.
 */
var Facet = Backbone.Model.extend({
  defaults: {
    count: 0
  }
});

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

  collection.forEach(function (model) {
    var facetData = criteriaFn(model);
    var id = facetData.id;

    if (!facetedCollection.get(id)) {
      facetedCollection.add(new Facet(facetData));
    }

    var facet = facetedCollection.get(id);
    facet.set('count', facet.get('count') + 1);
  });

  collection.on('add', function (model) {
    var facetData = criteriaFn(model);
    var id = facetData.id;

    if (!facetedCollection.get(id)) {
      facetedCollection.add(new Facet(facetData));
    }

    var facet = facetedCollection.get(id);
    facet.set('count', facet.get('count') + 1);
  });

  return facetedCollection;
};

module.exports = {
  facetCollection: facetCollection
};