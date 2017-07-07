import * as React from 'react';
import { SFC } from 'react';
import isLocal from '../util/isLocal';

const isHot = !!module.hot;
const isProduction = process.env.NODE_ENV === 'production';

type HtmlComponentProps = {
  content: string;
  state: string;
};

/**
 * Pure React component for rending an html page
 *
 * TODO Better scripts setup and options
 */
const HtmlComponent: SFC<HtmlComponentProps> = (props) => {
  const { content, state } = props;
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <meta charSet="utf-8" />
        <meta property="og:title" content="Climbing App" />
        <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en" />
        <script src="https://use.fontawesome.com/470e7e519a.js" />
        <script src="/js/vendor.bundle.js" />
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body className="body--sidebar">
        <div
          id="app"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <script dangerouslySetInnerHTML={{ __html: state }} />
        <script src="/js/application.js" />
      </body>
    </html>
  );
};

HtmlComponent.defaultProps = {
  state: ''
};

export default HtmlComponent;
