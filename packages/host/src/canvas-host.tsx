
import { ensure } from "./lang-utils";
import React from "react";
import useForceUpdate from "./useForceUpdate";
import ReactDOM from "react-dom";


declare global{
    interface Window {
        __StructoHostVersion: string
    }
}

if((globalThis as any).__StructoHostVersion ===  null) {
(globalThis as any).__StructoHostVersion = '5.0.0';
}

const rootChangeListeners: (() => void)[] = [];
class StructoRootNodeWrapper {
    constructor(private value: null | React.ReactElement){}

    set = (val: null | React.ReactElement) =>{
        this.value = val;
        rootChangeListeners.forEach((f) => f())
    }

    get = () => this.value;
}


const structoRootNode = new StructoRootNodeWrapper(null);

function getHashParams(){
    return new URLSearchParams(location.hash.replace(/^#/, "?"))
}


function getStructoOrigin(){
    const params = getHashParams();
    return ensure(
    
    params.get("origin"), "Missing information from Structo window"
    )
}

function getStudioHash(){
    const hashParams  = getHashParams()
    if(hashParams.has("studioHash")){
        return hashParams.get("studioHash");
    }

    const urlParams = new URL(location.href).searchParams
    return urlParams.get("studio-hash")
}


function renderStudioIntoframe(){
    const script = document.createElement("script");
    const structoOrigin = getStructoOrigin()
    const hash = getStudioHash()
    script.src = `${structoOrigin}/static/js/studio${
        hash ? `.${hash}.js` : `.js`
    }`;
    document.body.appendChild(script)
}


let renderCount = 0

export function setStructoRootNode(node: React.ReactElement | null){
    renderCount++;
    structoRootNode.set(node);
}


export interface StructoCanvasContextValue {
    componentName: string | null;
    globalVariants: Record<string, string>
    interactive?: boolean;
}



export const StructoCanvasContext = React.createContext<StructoCanvasContextValue | false   >(false)

export const useStructoCanvasContext = () =>
    React.useContext(StructoCanvasContext);

function _StructoCanvasHost(){
    const isFrameAttached = !!window.parent;
    const isCanvas = !!location.hash?.match(/\bcanvas=true\b/);
     const isLive = !!location.hash?.match(/\blive=true\b/) || !isFrameAttached;
const shouldRenderStrudio = isFrameAttached && !document.querySelector("#structo-studio-tag") && !isCanvas && !isLive;


const forceUpdate = useForceUpdate()
React.useLayoutEffect(()=>{
    rootChangeListeners.push(forceUpdate)

    return () => {
        const index = rootChangeListeners.indexOf(forceUpdate)

        if(index >= 0){
            rootChangeListeners.splice(index, 1)
        }
    }
},[forceUpdate])
React.useEffect(() => {
    if(shouldRenderStrudio && isFrameAttached && window.parent !== window){
        renderStudioIntoframe()
    }
},[shouldRenderStrudio, isFrameAttached]);

React.useEffect(() => {
if(!shouldRenderStrudio && !document.querySelector("#getlibs") && isLive){
    const scriptElt = document.createElement("script")
    scriptElt.id = "getlibs";
    scriptElt.src = getStructoOrigin() + '/static/js/getlibs.js'
    scriptElt.async = false;
    scriptElt.onload = () => {
        (window as any ).__GetlibsReadyResolver?.()
    }
    document.head.append(scriptElt)
}
}, [shouldRenderStrudio])

const [canvasContextValue, setCanvasContextValue] = React.useState(() =>
    deriveCanvasContextValue()
  );

React.useEffect(() => { 
if(isCanvas){
    const listener = () => {
        setCanvasContextValue(deriveCanvasContextValue())
    }

    window.addEventListener("hashchange", listener)
    return ()=> window.removeEventListener("hashchange", listener)
}
return undefined
}, [isCanvas])

if(!isFrameAttached){
    return null;
}
if(isCanvas || isLive){
    let appDiv = document.querySelector("#structo-app.__wab_user-body")

    if(!appDiv){
        appDiv = document.createElement("div");
        appDiv.id = "structo-app"
        appDiv.classList.add("__wab_uaer-body");
        document.body.prepend(appDiv);
    }

    return ReactDOM.createPortal(
         <ErrorBoundary key={`${renderCount}`}>
           <StructoCanvasContext.Provider value={canvasContextValue}>
            {structoRootNode.get()} 
            </StructoCanvasContext.Provider>
            </ErrorBoundary>,
            appDiv,
            "structo-app"
    )
}


if(shouldRenderStrudio && window.parent === window){ 

    return (
        <iframe
        src={`https://docs.structo.app/app-content/app-host-ready#appHostUrl=${encodeURIComponent(
          location.href
        )}`}
        style={{
          width: "100vw",
          height: "100vh",
          border: "none",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 99999999,
        }}
      ></iframe>
    )
}
return null
}


interface StructoCanvasHostProps {
    enableWebpackHmr?: boolean
}


export const StructoCanvasHost: React.FunctionComponent< StructoCanvasHostProps> = (props) => {
    const {enableWebpackHmr} = props;
    const [ node, setNode] = React.useState<React.ReactElement<any, any> | null> (
        null
    )

    React.useEffect(() => { 
setNode(<_StructoCanvasHost />)
    },[])

 return (
    <>
      {!enableWebpackHmr && <DisableWebpackHmr />}
      {node}
    </>
  );
}

type RenderErrorListener = (err: Error) => void
const renderErrorListeners: RenderErrorListener[] = []

export function registerRenderErrorListener(listener: RenderErrorListener){

    return ()=>{
        const index = renderErrorListeners.indexOf(listener)
        if(index >= 0){
            renderErrorListeners.splice(index, 1)
        }
    }
}


interface ErrorBoundaryProps {
children?: React.ReactNode;
}

interface ErrorBoundaryState {
error?: Error
}


class ErrorBoundary extends React.Component<
ErrorBoundaryProps,
ErrorBoundaryState
>{
constructor(props: ErrorBoundaryProps)
{
    super(props);
    this.state = {};
}
static getDerivedStateFromError(error: Error) {
    return {error}
}


componentDidCatch(error: Error) {
renderErrorListeners.forEach((listener) => listener(error))
}


render(){

     if (this.state.error) {
      return <div>Error: {`${this.state.error.message}`}</div>;
    } else {
      return <>{this.props.children}</>;
    }
}
}


function DisableWebpackHmr(){
    if(process.env.NODE_ENV === "production" ){
return null;
    }


    return (

           <script
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `
      if (typeof window !== "undefined") {
        const RealEventSource = window.EventSource;
        window.EventSource = function(url, config) {
          if (/[^a-zA-Z]hmr($|[^a-zA-Z])/.test(url)) {
            console.warn("Plasmic: disabled EventSource request for", url);
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
    ></script>
    )
}


function deriveCanvasContextValue(): StructoCanvasContextValue | false {
const hash = window.location.hash;
if(hash && hash.length > 0){
    const params  = new URLSearchParams(hash.substring(1))

     if (params.get("canvas") === "true") {
      const globalVariants = params.get("globalVariants");
      return {
        componentName: params.get("componentName") ?? null,
        globalVariants: globalVariants ? JSON.parse(globalVariants) : {},
        interactive: params.get("interactive") === "true",
      };
    }
}

return false
}


const  INTERNAL_CC_CANVAS_SELECTION_PROP = "__structo_selection_prop__"


export function useStructoCanvasComponentInfo(props:any){
    return React.useMemo(()=>{
   const selectionInfo = props?.[INTERNAL_CC_CANVAS_SELECTION_PROP];
    if (selectionInfo) {
      return {
        isSelected: selectionInfo.isSelected as boolean,
        selectedSlotName: selectionInfo.selectedSlotName as string | undefined,
      };
    }
    return null;
  }, [props]);
}