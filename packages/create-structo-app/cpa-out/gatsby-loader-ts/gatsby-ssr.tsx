

const React = require("react")

const HeadComponents = [
  <script
    key="structo-hmr"
    type="text/javascript"
    dangerouslySetInnerHTML={{
      __html: `
        if (typeof window !== "undefined" && /\\/structo-host\\/?$/.test(window.location.pathname)) {
          const RealEventSource = window.EventSource;
          window.EventSource = function(url, config) {
            if (/[^a-zA-Z]hmr($|[^a-zA-Z])/.test(url)) {
              console.warn("Structo: disabled EventSource request for", url);
              return {
                onerror() {}, onmessage() {}, onopen() {}, close() {}
              };
            } else {
              return new RealEventSource(url, config);
            }
          }
        }
      `,
    }}
  />
]

const isProduction = process.env.NODE_ENV === "production"

exports.onRenderBody = ({ pathname, setHeadComponents }) => {
  
  if (!isProduction || pathname === "/structo-host/") {
    setHeadComponents(HeadComponents)
  }
}
