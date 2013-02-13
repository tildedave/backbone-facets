var assert = require('assert'),
    facets = require('facets'),
    Backbone = require('backbone');

describe('faceter', function () {

  var collection, redTriangle, blueTriangle, redSquare;

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
});