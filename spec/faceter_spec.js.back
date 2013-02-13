var assert = require('assert'),
    facets = require('facets'),
    Backbone = require('backbone');

describe('faceter', function () {

  var criteria, faceter, redTriangle, blueTriangle, redSquare, collection,
      facetedCollection, triangleCriteria, trivialCriteria;

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

    trivialCriteria = function (model) {
      return {
        id: 1,
        title: 'Trivial'
      };
    };

    triangleCriteria = function (model) {
      if (model.get('shape') === 'Triangle') {
        return {
          id: 1,
          title: 'Triangles'
        };
      } else {
        return {
          id: 2,
          title: 'Not Triangles'
        };
      }
    };
  });

  function facetCollectionByCriteria(criteriaFn) {
    return facets.facetCollection(criteriaFn, collection);
  }

  it('maps every model to one facet', function () {
    facetedCollection = facetCollectionByCriteria(trivialCriteria);

    assert.equal(1, facetedCollection.length);

    var singleFacet = facetedCollection.at(0);
    assert.equal(3, singleFacet.get('count'));
    assert.equal('Trivial', singleFacet.get('title'));
  });

  it('maps models to different facets', function () {
    facetedCollection = facetCollectionByCriteria(triangleCriteria);

    assert.equal(2, facetedCollection.length);

    var triangleFacet = facetedCollection.where({ title: 'Triangles' })[0];
    assert.equal(2, triangleFacet.get('count'));
    var notTriangleFacet = facetedCollection.where({ title: 'Not Triangles' })[0];
    assert.equal(1, notTriangleFacet.get('count'));
  });

  it('handles model updates in the original collection', function () {
    facetedCollection = facetCollectionByCriteria(triangleCriteria);
    var triangleFacet = facetedCollection.where({ title: 'Triangles' })[0];
    var notTriangleFacet = facetedCollection.where({ title: 'Not Triangles' })[0];

    redSquare.set('shape', 'Triangle');

    assert.equal(3, triangleFacet.get('count'));
    assert.equal(0, notTriangleFacet.get('count'));
  });

  it('handles model removal in the original collection', function () {
    facetedCollection = facetCollectionByCriteria(triangleCriteria);
    var notTriangleFacet = facetedCollection.where({ title: 'Not Triangles' })[0];

    collection.remove(redSquare);

    assert.equal(0, notTriangleFacet.get('count'));
  });

  it('handles model addition to the original collection', function () {
    var greenSquare;

    greenSquare = shapeModel(4, 'Green', 'Square');
    facetedCollection = facetCollectionByCriteria(triangleCriteria);
    var notTriangleFacet = facetedCollection.where({ title: 'Not Triangles' })[0];

    collection.add(greenSquare);

    assert.equal(2, notTriangleFacet.get('count'));
  });
});