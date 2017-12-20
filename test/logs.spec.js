const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon  = require("sinon");
const moment = require('moment');
const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../server/app');
//'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
describe("Logger", function() {
  this.timeout(6500);
  beforeEach(() => {
    sinon.stub(console, "log").returns(void 0);
    sinon.stub(console, "error").returns(void 0);
  });

  afterEach(() => {
    console.log.restore();
    console.error.restore();
  });

  it("GET / calls console.log", (done) => {
  chai.request(app)
    .get('/')
    .end((err, res) => {
      expect(console.log.callCount).to.equal(1);
      expect(console.log.calledOnce).to.equal(true);
      done();
    })
  });

  it("GET / log includes a user-agent in position 1", (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        const out = console.log.getCall(0).args[0].split(',');
        expect(out[0]).to.contain('node-superagent');
        done();
    })
  });

  it("GET / log includes an ISO date in position 2", (done) => {
  chai.request(app)
    .get('/')
    .end((err, res) => {
      const out = console.log.getCall(0).args[0].split(',');
      expect(moment(out[1], moment.ISO_8601).isValid()).to.equal(true);
      done();
    })
  });

  it("GET / log a verb in position 3", (done) => {
  chai.request(app)
    .get('/')
    .end((err, res) => {
      const out = console.log.getCall(0).args[0].split(',');
      expect(out[2]).to.equal('GET');
      done();
    })
  });

  it("GET / log a url in the position 4", (done) => {
  chai.request(app)
    .get('/')
    .end((err, res) => {
      const out = console.log.getCall(0).args[0].split(',');
      expect(out[3]).to.equal('/');
      done();
    })
  });

  it("GET / log a HTTP type of 'HTTP/1.1' in the position 5", (done) => {
  chai.request(app)
    .get('/')
    .end((err, res) => {
      const out = console.log.getCall(0).args[0].split(',');
      expect(out[4]).to.equal('HTTP/1.1');
      done();
    })
  });

  it("GET / log a Status of 200 in the position 6", (done) => {
  chai.request(app)
    .get('/')
    .end((err, res) => {
      const out = console.log.getCall(0).args[0].split(',');
      // may have a newline char, check only that it contains HTTP/1.1
      expect(out[5]).to.contain('200');
      done();
    })
  });

});
