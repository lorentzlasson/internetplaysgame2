import { React, ReactDOMServer } from "../dep.ts";

const ui = (x: string) => (
  <html>
    <body>
      <div>
        <h1>Hello {x}!</h1>
      </div>
    </body>
  </html>
);

export default (data: string) => ReactDOMServer.renderToString(ui(data));
