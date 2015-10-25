EventEmitter = require('events').EventEmitter
_ = require 'lodash'

class BaseStore extends EventEmitter

  @handle: (handlers...) ->
    @handlers = _.clone(@handlers ? {})
    for thisHandler, i in handlers when i % 2 is 0
      if @handlers[thisHandler]?
        console.warn "BaseStore.handle -- #{thisHandler} is already being handled. This will be overridden, watch out!"
      @handlers[thisHandler] = handlers[i+1]
    @

  # Sugar for setting up a new Store klass with given handlers
  @withHandlers: (handlers...) ->
    class WithHandlers extends @
      @handle(handlers...)

  @withName: (name) ->
    class WithName extends @
      @storeName: name

  constructor: (@dispatcher) ->
    @setMaxListeners 0

module.exports = BaseStore