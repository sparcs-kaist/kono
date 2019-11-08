const req = require.context('.', true, /^(?!.\/index).*.js$/);

req.keys().forEach(key => {
    const moduleName = /.\/(.*?).js$/.test(key) && key.match(/.\/(.*?).js$/)[1];
    module.exports[moduleName] = req(key).default;
});