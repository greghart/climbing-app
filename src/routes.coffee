module.exports =
  home:
    path: '/'
    method: 'get'
    page: 'home'
    title: 'Home'
    handler: require './components/explorer/Crag'
  tracer:
    path: '/tracer'
    method: 'get'
    page: 'tracer'
    title: 'Tracer'
    handler: require './components/tracer/Tracer'
  about:
    path: '/about'
    method: 'get'
    page: 'about'
    title: 'About'
    handler: require('./components/About')