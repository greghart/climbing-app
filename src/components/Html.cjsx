React = require 'react'
ApplicationStore = require '../stores/ApplicationStore'

class Html extends React.Component

  render: ->
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>{this.props.context.getStore(ApplicationStore).getPageTitle()}</title>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <link rel="stylesheet" href="/public/css/lib.min.css"/>
      </head>
      <body>
        <div
          id="app"
          dangerouslySetInnerHTML={{__html: this.props.markup}}
        ></div>
      </body>
      <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
      <script src="http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.js"></script>
      <script src='/public/js/lib.min.js'></script>
      <script src={'/public/js/' + this.props.clientFile}></script>
    </html>

module.exports = Html