var assert = require('assert'),
    facets = require('facets'),
    Backbone = require('backbone');

describe('faceter', function () {

  var collection, redTriangle, blueTriangle, redSquare, shapeCriteria;

  function shapeModel(id, color, shape) {
    return new Backbone.Model({
      id: id,
      color: color,
      shape: shape
    });
  }

  beforeEach(function () {
    redTriangle = shapeModel(1, 'Red', 'Triangle');
    blueTriangle = shapeModel(2, 'Blue', 'Triangle');
    redSquare = shapeModel(3, 'Red', 'Square');
    collection = new Backbone.Collection([redTriangle, blueTriangle, redSquare]);
  });

  shapeCriteria = function (model) {
    var shape = model.get('shape');
    return {
      id: shape.toLowerCase(),
      title: shape
    };
  };


  it('maps every model to one facet', function () {
    var trivialCriteria, facetedCollection;

    trivialCriteria = function (model) {
      return {
        id: 1,
        title: 'Trivial'
      };
    };
    facetedCollection = facets.facetCollection(trivialCriteria, collection);

    assert.equal(1, facetedCollection.length);

    var singleFacet = facetedCollection.at(0);
    assert.equal(3, singleFacet.get('count'));
    assert.equal('Trivial', singleFacet.get('title'));
  });

  it('maps models to different facets', function () {
    var facetedCollection;

    facetedCollection = facets.facetCollection(shapeCriteria, collection);

    assert.equal(2, facetedCollection.length);

    var triangleFacet = facetedCollection.where({ title: 'Triangle' })[0];
    assert.equal(2, triangleFacet.get('count'));

    var squareFacet = facetedCollection.where({ title: 'Square' })[0];
    assert.equal(1, squareFacet.get('count'));
  });

  it('updates the facets when a model is added', function () {
    var facetedCollection;

    facetedCollection = facets.facetCollection(shapeCriteria, collection);
    collection.add(shapeModel(4, 'Green', 'Square'));

    // Should now have two squares
    var squareFacet = facetedCollection.where({ title: 'Square' })[0];
    assert.equal(2, squareFacet.get('count'));
  });
});