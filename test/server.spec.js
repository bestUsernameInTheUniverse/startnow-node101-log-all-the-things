const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../server/app');

describe("Server API logs endpoint", function() {
  this.timeout(6500);
  it("GET / responds with a 200 response code", (done) => {
		chai.request(app)
  		.get('/')
  		.end((err, res) => {
        expect(res).to.have.status(200);
  			done();
  		})
	});

  it("GET /logs returns a json object", (done) => {
    chai.request(app)
      .get('/logs')
      .end((err, res) => {
        expect(res.body.length).to.be.above(1);
        done();
      })
  });

  it("GET /logs returns json with the correct keys", (done) => {
    chai.request(app)
      .get('/logs')
      .end((err, res) => {
        expect(res.body[1]).to.have.keys('Agent', 'Time', 'Method', 'Resource', 'Version', 'Status');
        done();
      })
  });

});
