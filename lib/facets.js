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

  // Map to look up which facet belongs to which model, since when a 'change' event is
  // fired we can't determine this with the criteria function
  var facetForModel = {};

  var addFacetForModel = function (model) {
    var facetData = criteriaFn(model);
    var id = facetData.id;

    if (!facetedCollection.get(id)) {
      facetedCollection.add(new Facet(facetData));
    }

    var facet = facetedCollection.get(id);
    facet.set('count', facet.get('count') + 1);
    facetForModel[model.id] = facet;
  };

  var removeFacetForModel = function (model) {
    var facet = facetForModel[model.id];
    facet.set('count', facet.get('count') - 1);
    if (!facet.get('count')) {
      facetedCollection.remove(facet);
    }
  };

  var updateFacetForModel = function (model) {
    var oldFacet = facetForModel[model.id];
    var newFacet = criteriaFn(model);

    if (oldFacet.id === newFacet.id) {
      return;
    }

    removeFacetForModel(model);
    addFacetForModel(model);
  };

  var listenForUpdates = function (model) {
    model.on('change', function () {
      updateFacetForModel(model);
    });
  };

  collection.forEach(function (model) {
    addFacetForModel(model);
    listenForUpdates(model);
  });

  collection.on('add', function (model) {
    addFacetForModel(model);
  });
  collection.on('remove', function (model) {
    removeFacetForModel(model);
  });

  return facetedCollection;
};

module.exports = {
  facetCollection: facetCollection
};