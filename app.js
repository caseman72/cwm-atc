var http_server = require("http-server");

var server = http_server.createServer({
	root: __dirname,
	cache: -1
});
server.listen(process.env.VCAP_APP_PORT || process.env.VMC_APP_PORT || 8000);
