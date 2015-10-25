# Basic Store API for a store that handles a list of data
#
# @note This store is compatible with services that return lists
BaseStore = require './BaseStore'
_ = require 'lodash'

class ListStore extends BaseStore

  @storeName: 'List'

  constructor: ->
    super(arguments...)
    @list = []

  ### API ###
  getList: ->
    @list

  ### Action Handlers ###

  onClearList: ->
    @list = []

  onReceiveList: (@list) ->

  ### Serialization ###
  dehydrate: ->
    list: @list

  rehydrate: ({@list}) ->

module.exports = ListStore
