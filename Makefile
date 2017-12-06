BROWSERIFYCMD = node_modules/.bin/browserify

SMOKECHROME = node_modules/.bin/tap-closer | \
	node_modules/.bin/smokestack -b chrome

SMOKEFIREFOX = node_modules/.bin/tap-closer | \
	node_modules/.bin/smokestack -b firefox

run-chrome-test: 
	$(BROWSERIFYCMD) -d tests/basic-tests.js | $(SMOKECHROME)
	$(BROWSERIFYCMD) -d tests/chunk-tests.js | $(SMOKECHROME)

run-firefox-test:
	$(BROWSERIFYCMD) -d tests/basic-tests.js | $(SMOKEFIREFOX)
	$(BROWSERIFYCMD) -d tests/chunk-tests.js | $(SMOKEFIREFOX)

test-chrome: start-web-server run-chrome-test

test-firefox: start-web-server run-firefox-test

test: test-chrome test-firefox

start-web-server:
	node tests/fixtures/test-server.js > tests/fixtures/server-pid.txt &

kill-web-server:
	kill $(shell cat tests/fixtures/server-pid.txt)
	rm -f tests/fixtures/server-pid.txt

pushall:
	git push origin gh-pages && npm publish

lint:
	./node_modules/.bin/eslint .

prettier:
	prettier --single-quote --write "**/*.js"
