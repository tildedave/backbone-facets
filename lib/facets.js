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

  var addFacetForModel = function (model) {
    var facetData = criteriaFn(model);
    var id = facetData.id;

    if (!facetedCollection.get(id)) {
      facetedCollection.add(new Facet(facetData));
    }

    var facet = facetedCollection.get(id);
    facet.set('count', facet.get('count') + 1);
  };

  collection.forEach(function (model) {
    addFacetForModel(model);
  });

  collection.on('add', function (model) {
    addFacetForModel(model);
  });
  collection.on('remove', function (model) {
    var facetData = criteriaFn(model);
    var id = facetData.id;

    var facet = facetedCollection.get(id);
    facet.set('count', facet.get('count') - 1);
    if (!facet.get('count')) {
      facetedCollection.remove(facet);
    }
  });

  return facetedCollection;
};

module.exports = {
  facetCollection: facetCollection
};