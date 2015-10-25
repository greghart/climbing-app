module.exports =
  home:
    path: '/'
    method: 'get'
    page: 'home'
    title: 'Home'
    handler: require './components/Crag'
  about:
    path: '/about'
    method: 'get'
    page: 'about'
    title: 'About'
    handler: require('./components/About')