const context = require('./IoC/context.js').newContext();

const server = context('server')(context);
server.listen();