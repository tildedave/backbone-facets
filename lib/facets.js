var Backbone = require('backbone');

// Nothing here for now
var Facet = Backbone.Model.extend({});

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
      facetData['count'] = 1;
      facetedCollection.add(new Facet(facetData));
    } else {
      var existingFacet = facetedCollection.get(id);
      existingFacet.set('count', existingFacet.get('count') + 1);
    }
  });


  return facetedCollection;
};

module.exports = {
  facetCollection: facetCollection
};