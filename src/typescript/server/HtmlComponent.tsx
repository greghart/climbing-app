import * as React from "react";
import type { SFC } from "react";

const isHot = !!module.hot;
const isProduction = process.env.NODE_ENV === "production";

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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, shrink-to-fit=no, user-scalable=no"
        />
        <meta charSet="utf-8" />
        <meta property="og:title" content="Climbing App" />
        <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en,Symbol" />
        <script src="https://use.fontawesome.com/470e7e519a.js" />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
          integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
          crossOrigin="anonymous"
        />
      </head>
      <body className="body--sidebar">
        <div id="app" dangerouslySetInnerHTML={{ __html: content }} />
        <script dangerouslySetInnerHTML={{ __html: state }} />
        <script src="/build/js/application.js" />
      </body>
    </html>
  );
};

HtmlComponent.defaultProps = {
  state: "",
};

export default HtmlComponent;
