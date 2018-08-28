const cacheModel = require('../src/models/Cache');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const expect = chai.expect;


chai.use(chaiHttp);
// testing endpoints only
describe('Cache Unit Testing', () => {
  beforeEach((done) => {
    // empty database before tests are run
    cacheModel.deleteMany({}, (err) => { 
      done();           
    });        
  });

  describe('GET cache', () => {
    it('it should retrieve all the cache', (done) => {
      chai.request(server)
        .get('/api/cache')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('it should retrieve cache by key', (done) => {
      chai.request(server)
        .get('/api/cache/1')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

  describe('POST cache', () => {
    it('it should save cache', (done) => {
      chai.request(server)
        .post('/api/cache')
        .send({ key: '1' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data.key).to.equal('1');
          done();
        });
    });

    it('it should throw error on saving', (done) => {
      chai.request(server)
        .post('/api/cache')
        .send({ })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });
  });

  describe('DELETE cache', () => {
    it('it should delete cache', (done) => {
      chai.request(server)
        .delete('/api/cache')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('it should delete cache by key', (done) => {
      chai.request(server)
        .delete('/api/cache/1')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });
  });

  describe('PUT cache', () => {
    it('it should not update cache', (done) => {
      chai.request(server)
        .put('/api/cache/1')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });
  });
});
