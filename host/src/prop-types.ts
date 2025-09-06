import { CSSProperties, StructoElement } from "./element-types";
import { StyleSection } from "./registerComponent";

export interface CanvasComponentProps<Data = any> {
  
  setControlContextData?: (data: Data) => void;
}

export type ControlExtras = {
  path: (string | number)[];
  item?: any;
};

export type InferDataType<P> = P extends CanvasComponentProps<infer Data>
  ? Data
  : any;


export type ControlContext<P> = [
  
  P,
  
  InferDataType<P> | null,
  
  ControlExtras
];


export type ContextDependentConfig<P, R> = (...args: ControlContext<P>) => R;

export interface PropTypeBase<P> {
  displayName?: string;
  description?: string;
  helpText?: string;
  required?: boolean;
  
  exprHint?: string;
 
  hidden?: ContextDependentConfig<P, boolean>;
  readOnly?: boolean | ContextDependentConfig<P, boolean>;

  advanced?: boolean;

  disableDynamicValue?: boolean;
 
  forceRemount?: boolean;
 
  invariantable?: boolean;
}

export interface Defaultable<P, T> {
  
  defaultValue?: T;


  defaultValueHint?: T | ContextDependentConfig<P, T | undefined>;

 
  defaultExpr?: string;
  defaultExprHint?: string;


  validator?: (
    value: T,
    ...args: ControlContext<P>
  ) => (string | true) | Promise<string | true>;
}

export interface Controllable {
 
  editOnly?: boolean;
  
  uncontrolledProp?: string;
}

export interface PropTypeBaseDefault<P, T>
  extends PropTypeBase<P>,
    Defaultable<P, T>,
    Controllable {}

export interface PlainStringType<P> extends PropTypeBaseDefault<P, string> {
  type: "string";
  control?: "default" | "large";
  isLocalizable?: boolean;
}

export interface CodeStringType<P> extends PropTypeBaseDefault<P, string> {
  type: "code";
  lang: "css" | "html" | "javascript" | "json";
}

export interface RichTextType<P> extends PropTypeBaseDefault<P, string> {
  type: "richText";
}

export interface HrefType<P> extends PropTypeBaseDefault<P, string> {
  type: "href";
}

export interface ColorType<P> extends PropTypeBaseDefault<P, string> {
  type: "color";
 
  keepCssVar?: boolean;
  
  disableTokens?: boolean;
}

export interface DateStringType<P> extends PropTypeBaseDefault<P, string> {
  type: "dateString";
}
export interface DateRangeStringsType<P>
  extends PropTypeBaseDefault<P, [string, string]> {
  type: "dateRangeStrings";
}

export interface ClassType<P> extends PropTypeBase<P> {
  type: "class";
  
  selectors?: {
  
    selector: string;
    
    label?: string;
   
    defaultStyles?: CSSProperties;
  }[];
  
  styleSections?: StyleSection[];
  
  defaultStyles?: CSSProperties;
}

export interface ThemeResetClassType<P> extends PropTypeBase<P> {
  type: "themeResetClass";
 
  targetAllTags?: boolean;
}

export interface CardPickerType<P> extends PropTypeBaseDefault<P, string> {
  type: "cardPicker";
  modalTitle?: React.ReactNode | ContextDependentConfig<P, React.ReactNode>;
  options:
    | {
        value: string;
        label?: string;
        imgUrl: string;
        footer?: React.ReactNode;
      }[]
    | ContextDependentConfig<
        P,
        {
          value: string;
          label?: string;
          imgUrl: string;
          footer?: React.ReactNode;
        }[]
      >;
  showInput?: boolean | ContextDependentConfig<P, boolean>;
  onSearch?: ContextDependentConfig<P, ((value: string) => void) | undefined>;
}

export type RichStringType<P> =
  | PlainStringType<P>
  | CodeStringType<P>
  | RichTextType<P>
  | ColorType<P>
  | ClassType<P>
  | ThemeResetClassType<P>
  | CardPickerType<P>
  | HrefType<P>;

export type StringType<P> = "string" | "href" | RichStringType<P>;

export interface RichBooleanType<P> extends PropTypeBaseDefault<P, boolean> {
  type: "boolean";
}

export type BooleanType<P> = "boolean" | RichBooleanType<P>;

export type GraphQLValue = {
  query: string;
  variables?: Record<string, any>;
};

export interface GraphQLType<P> extends PropTypeBaseDefault<P, GraphQLValue> {
  type: "code";
  lang: "graphql";
  endpoint: string | ContextDependentConfig<P, string>;
  method?: string | ContextDependentConfig<P, string>;
  headers?: object | ContextDependentConfig<P, object>;
}

export interface NumberTypeBase<P> extends PropTypeBaseDefault<P, number> {
  type: "number";
  min?: number | ContextDependentConfig<P, number>;
  max?: number | ContextDependentConfig<P, number>;
}

export interface PlainNumberType<P> extends NumberTypeBase<P> {
  control?: "default";
}

export interface SliderNumberType<P> extends NumberTypeBase<P> {
  control: "slider";
  step?: number | ContextDependentConfig<P, number>;
}

export type RichNumberType<P> = PlainNumberType<P> | SliderNumberType<P>;
export type NumberType<P> = "number" | RichNumberType<P>;

export interface ObjectType<P>
  extends PropTypeBaseDefault<P, Record<string, any>> {
  type: "object";
  fields?: Record<string, PropType<P>>;
  nameFunc?: (item: any, ...args: ControlContext<P>) => string | undefined;
}

export interface ArrayType<P> extends PropTypeBaseDefault<P, any[]> {
  type: "array";
  itemType?: ObjectType<P>;
  
  unstable__canDelete?: (item: any, ...args: ControlContext<P>) => boolean;
 
  unstable__keyFunc?: (item: any) => any;
 
  unstable__minimalValue?: ContextDependentConfig<P, any>;
}

export type JSONLikeType<P> = "object" | ObjectType<P> | ArrayType<P>;

export interface DataSourceType<P> extends PropTypeBase<P> {
  type: "dataSource";
  dataSource: "airtable" | "cms";
}

export type DataPickerValueType = string | number | (string | number)[];
export interface RichDataPickerType<P>
  extends PropTypeBaseDefault<P, DataPickerValueType> {
  type: "dataSelector";
  data?: Record<string, any> | ContextDependentConfig<P, Record<string, any>>;
  alwaysShowValuePathAsLabel?: boolean;
  isolateEnv?: boolean;
}
export type DataPickerType<P> = "dataPicker" | RichDataPickerType<P>;

export interface RichExprEditorType<P>
  extends PropTypeBaseDefault<P, DataPickerValueType> {
  type: "exprEditor";
  data?: Record<string, any> | ContextDependentConfig<P, Record<string, any>>;
  isolateEnv?: boolean;
}
export type ExprEditorType<P> = "exprEditor" | RichExprEditorType<P>;

export interface FormValidationRulesType<P>
  extends PropTypeBaseDefault<P, any> {
  type: "formValidationRules";
}

export interface EventHandlerType<P> extends PropTypeBase<P> {
  type: "eventHandler";
  argTypes: { name: string; type: ArgType<any> }[];
}

export type ChoiceValue = string | number | boolean;

export type ChoiceObject = { label: string; value: ChoiceValue };

export type ChoiceOptions = ChoiceValue[] | ChoiceObject[];

export interface ChoiceTypeBase<P, T> extends PropTypeBaseDefault<P, T> {
  type: "choice";
  options:
    | ChoiceOptions
    | ContextDependentConfig<
        P,
        | string[]
        | {
            label: string;
            value: string | number | boolean;
          }[]
      >;
  allowSearch?: boolean;
  filterOption?: boolean;
  onSearch?: ContextDependentConfig<P, ((value: string) => void) | undefined>;
}

export interface SingleChoiceType<P>
  extends ChoiceTypeBase<P, string | number | boolean> {
  multiSelect?: false;
}

export interface MultiChoiceType<P>
  extends ChoiceTypeBase<P, (string | number | boolean)[]> {
  multiSelect: true;
}

export interface CustomChoiceType<P>
  extends ChoiceTypeBase<
    P,
    string | number | boolean | (string | number | boolean)[]
  > {
  multiSelect: ContextDependentConfig<P, boolean>;
}

export type ChoiceType<P> =
  | SingleChoiceType<P>
  | MultiChoiceType<P>
  | CustomChoiceType<P>;

export interface RichSlotType<P> {
  type: "slot";
  description?: string;

  
  allowedComponents?: string[];
  
  allowRootWrapper?: boolean;
 
  hidePlaceholder?: boolean;
  
  isRepeated?: boolean;

  
  displayName?: string;

 
  hidden?: ContextDependentConfig<P, boolean>;

  
  renderPropParams?: string[];

  
  unstable__isMainContentSlot?: boolean;

  defaultValue?: StructoElement | StructoElement[];


  mergeWithParent?: boolean | ContextDependentConfig<P, boolean>;

  
  hiddenMergedProps?: ContextDependentConfig<P, boolean>;
}

export type SlotType<P> = "slot" | RichSlotType<P>;

export interface RichImageUrlType<P> extends PropTypeBaseDefault<P, string> {
  type: "imageUrl";
}

export type ImageUrlType<P> = "imageUrl" | RichImageUrlType<P>;

export interface ModalProps {
  show?: boolean;
  children?: React.ReactNode;
  onClose: () => void;
  style?: CSSProperties;
}

export interface StudioOps {
  showModal: (
    modalProps: Omit<ModalProps, "onClose"> & { onClose?: () => void }
  ) => void;
  refreshQueryData: () => void;
  appendToSlot: (element: StructoElement, slotName: string) => void;
  removeFromSlotAt: (pos: number, slotName: string) => void;
  updateProps: (newValues: any) => void;
  updateStates: (newValues: any) => void;
}

export interface ProjectData {
  components: { name: string }[];
  pages: { name: string; pageMeta: { path: string } }[];
}

export interface CustomControlProps<P> {
  componentProps: P;
  
  contextData: InferDataType<P> | null;
  
  studioOps: StudioOps | null;
  
  projectData: ProjectData;
  value: any;
  
  updateValue: (newVal: any) => void;
 
  FullscreenModal: React.ComponentType<ModalProps>;
  
  SideModal: React.ComponentType<ModalProps>;

  studioDocument: typeof document;
}
export type CustomControl<P> = React.ComponentType<CustomControlProps<P>>;

export interface RichCustomType<P> extends PropTypeBaseDefault<P, any> {
  type: "custom";
  control: CustomControl<P>;
}

export type CustomType<P> = RichCustomType<P> | CustomControl<P>;

export type PrimitiveType<P = any> = Extract<
  StringType<P> | BooleanType<P> | NumberType<P> | JSONLikeType<P>,
  string
>;

export type PropType<P> =
  | StringType<P>
  | BooleanType<P>
  | GraphQLType<P>
  | NumberType<P>
  | JSONLikeType<P>
  | DataSourceType<P>
  | DataPickerType<P>
  | ExprEditorType<P>
  | FormValidationRulesType<P>
  | EventHandlerType<P>
  | ChoiceType<P>
  | CustomType<P>
  | ImageUrlType<P>
  | SlotType<P>
  | DateStringType<P>
  | DateRangeStringsType<P>;

export type ArgType<P> = Exclude<
  PropType<P>,
  SlotType<P> | EventHandlerType<P>
>;

export type StringCompatType<P> =
  | DateStringType<P>
  | StringType<P>
  | ChoiceType<P>
  | JSONLikeType<P>
  | ImageUrlType<P>
  | CustomType<P>
  | DataPickerType<P>;
export type BoolCompatType<P> =
  | BooleanType<P>
  | CustomType<P>
  | DataPickerType<P>;
export type NumberCompatType<P> =
  | NumberType<P>
  | CustomType<P>
  | DataPickerType<P>;

export type RestrictPropType<T, P> = T extends string
  ? StringCompatType<P>
  : T extends boolean
  ? BoolCompatType<P>
  : T extends number
  ? NumberCompatType<P>
  : PropType<P>;
