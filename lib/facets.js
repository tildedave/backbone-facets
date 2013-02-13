var Backbone = require('backbone');

var Facet = Backbone.Model.extend({
  defaults: {
    count: 0
  }
});

var facetCollection = function (criteriaFn, collection) {
  var facetedCollection = new Backbone.Collection();

  this._facetsForModel = {};

  this.addFacetForModel = function (model) {
    var facetData = criteriaFn(model);
    var id = facetData.id;

    if (!facetedCollection.get(id)) {
      facetedCollection.add(new Facet(facetData));
      this._facetsForModel[model.id] = id;
    }

    var facet = facetedCollection.get(id);
    facet.set('count', facet.get('count') + 1);
  };

  this.removeFacetForModel = function (model) {
    var oldFacet = facetedCollection.get(this._facetsForModel[model.id]);
    oldFacet.set('count', oldFacet.get('count') - 1);
  };

  this.updateFacets = function (model) {
    var facetData = criteriaFn(model);
    var id = facetData.id;
    var oldFacetId = this._facetsForModel[model.id];

    if (oldFacetId && oldFacetId === id) {
      return;
    }

    this.removeFacetForModel(model);
    this.addFacetForModel(model);
  };

  this.listenForUpdates = function (model) {
    model.on('change', function () {
      this.updateFacets(model);
    }, this);
  };

  collection.forEach(function (model) {
    this.addFacetForModel(model);
    this.listenForUpdates(model);
  }, this);
  collection.on('remove', function (model) {
    this.removeFacetForModel(model);
  }, this);
  collection.on('add', function (model) {
    this.addFacetForModel(model);
  }, this);

  return facetedCollection;
};

module.exports = {
  Facet: Facet,
  facetCollection: facetCollection
};