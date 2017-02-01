/**
 * Created by paul.a.fischer on 1/24/2017.
 */
var selenium = require('selenium-webdriver'),
    AxeBuilder = require('axe-webdriverjs'),
    Handlebars = require('handlebars');

var tests = require('../data/tests.json');

var fs = require('fs');
var driver, browser;
var index = -1;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe('Selenium-aXe Tutorial', function() {

  // Open the Deque website in the browser before each test is run
  beforeEach(function(done) {
    index ++;

    driver = new selenium.Builder()
        .forBrowser('chrome');

    browser = driver.build();
    browser.manage().timeouts().setScriptTimeout(60000);

    browser.get(tests[index].url).then(function () {
      browser.executeAsyncScript(function(callback) {
        var script = document.createElement('script');
        script.innerHTML = 'document.documentElement.classList.add("deque-axe-is-ready");';
        document.documentElement.appendChild(script);
        callback();
      })
      .then(function () {
        return browser.wait(selenium.until.elementsLocated(selenium.By.css('.deque-axe-is-ready')));
      })
      .then(function(){
        done();
      });
    });

  });

  // Close the website after each test is run (so that it is opened fresh each time)
  afterEach(function(done) {
    browser.quit().then(function () {
      fs.writeFile('data/tests.json', JSON.stringify(tests, null, '\t'), function(err) {
        done();
      })
    });
  });

  tests.forEach(function(test) {
    test.runtime = dateFormat(new Date());
    it('should load url ' + test.url + ' and analyze it', function (done) {
      AxeBuilder(browser)
        .withTags('section508')
        .analyze(function(results) {
          test.violations = results.violations.length;
          if (results.violations.length > 0) {
            fs.writeFile('reports/results-' + test.id + '.json', JSON.stringify(transform(results), null, '\t'), function(err) {
              expect(results.violations.length).toBe(0);
              done();
            });
          }
        });
    });
  });

});

function transform(results) {
  var results = Object.assign({}, {runtime: dateFormat(results.timestamp)}, results );
  return results;
}

function dateFormat(date) {
  var date = new Date(date);
  return date.getFullYear() + '-' + lpad(date.getMonth()+1) + '-' + lpad(date.getDate()) + ' ' +
    lpad(date.getHours()) + ':' + lpad(date.getMinutes()) + ':' + lpad(date.getSeconds());
}

function lpad(num) {
  var value = '0' + num;
  return value.substr(value.length-2, 2);
}
