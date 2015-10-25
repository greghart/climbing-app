
# ByIdStore is a store to track entities by ID
# Always treats all IDs as strings
#
# @note It only ever adds to the data it has
BaseStore = require './BaseStore'
isFinite = require 'lodash/lang/isFinite'
merge = require 'lodash/object/merge'
values = require 'lodash/object/values'
indexBy = require 'lodash/collection/indexBy'
# Proxy methods
find = require 'lodash/collection/find'
findWhere = require 'lodash/collection/findWhere'
where = require 'lodash/collection/where'

# Lodash proxying
proxy = (fxn) ->
  (args...) ->
    fxn values(@byId), args...

class ByIdStore extends BaseStore

  @storeName: 'ById'

  constructor: ->
    super(arguments...)
    @byId = {}
    # Keep errors per entity -- this *shouldn't* be necessary, since we only
    # really have one error at a time. Is there a way to have a singular "Error Store" that knows how to handle all the errors? Yes...yes I believe so
    @errorById = {}
    # Bind lodash methods
    @find = @find.bind(@)
    @findWhere = @findWhere.bind(@)

  ### API ###
  getById: (id) ->
    @byId[id.toString()]

  getErrorById: (id) ->
    @errorById[id.toString()]

  # Proxy to some lodash functions on this store's collection
  find: proxy(find)
  findWhere: proxy(findWhere)
  where: proxy(where)

  ### Action Handlers ###

  onReceiveList: (list) ->
    @byId = merge(
      @byId,
      indexBy(list, 'id')
    )
    @emit 'change'

  # Receive an entity that has an id, and persist it
  #
  # @TODO If there is no entity, service 404'd basically (which we don't handle
  #  yet)
  onReceive: (entity) ->
    return unless entity?
    @_set(entity.id.toString(), entity)

  # Receive an error and persist it
  #
  # Errors are mostly stateless, so include payload to give some context
  onReceiveError: ({error, payload}) ->
    return unless payload.id?
    @errorById[payload.id.toString()] = error
    console.log "ById.onReceiveError #{payload.id}"
    @emit 'change', payload.id.toString()

  # Some entities don't have id attached, so provide API to give it separately
  onReceiveForId: (entity, id) ->
    @_set(id.toString(), entity)

  _set: (id, entity) ->
    id = id.toString()
    @byId[id] = entity
    delete @errorById[id]
    @emit 'change', id

  ### Serialization ###
  dehydrate: ->
    byId: @byId

  rehydrate: ({@byId}) ->

module.exports = ByIdStore