
declare module "usetheform/types" {
  export type ReducerFn<Value, FormState = Value> = (
      state: Value,
      prevState: Value,
      formState: FormState
  ) => Value;

  export type ValidatorFn<Value, FormState = Value> = (
    value: Value,
    formState: FormState
  ) => string | undefined;

  export type AsyncValidatorFn<Value> = (
    value: Value,
  ) => Promise<string>;

  export type OnSubmitFormFn<FormState> = (
    state: FormState,
    isFormValid: boolean
  ) => Promise<unknown> | boolean | void;

  export type OnInitFormFn<FormState> = (
    state: FormState,
    isFormValid: boolean
  ) => void;

  export type OnChangeFormFn<FormState> = (
    state: FormState,
    isFormValid: boolean
  ) => void;

  export type OnResetFormFn<FormState> = (
    state: FormState,
    isFormValid: boolean
  ) => void;
}
declare module "usetheform" {
  import { AsyncValidatorFn, ReducerFn, OnSubmitFormFn, OnInitFormFn, OnChangeFormFn, OnResetFormFn, ValidatorFn } from "usetheform/types";

  type InputType =
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week"
    | "custom";
  interface FormStore<FormState> {
    getState: () => FormState;
    update: (formState: FormState, shouldNotify?: boolean) => void;
  }
  interface FormProps<FormState>{
    children?: React.ReactNode;
    initialState?: Partial<FormState>;
    onChange?: OnChangeFormFn<FormState>;
    onInit?: OnInitFormFn<FormState>;
    onReset?: OnResetFormFn<FormState>;
    onSubmit?: OnSubmitFormFn<FormState>;
    onValidation?: (errors: string[], isValid: boolean) => void;
    resetSyncErr?: () => void;
    validators?: Array<ValidatorFn<FormState, FormState>>;
    asyncValidator?: AsyncValidatorFn<FormState>;
    onAsyncValidation?: (status: AsyncStatus<string>) => void;
    resetAsyncErr?: () => void;
    touched?: boolean;
    reducers?: ReducerFn<FormState> | ReducerFn<FormState>[];
    name?: string;
    action?: string;
    formStore?: FormStore<FormState>;
    innerRef?: React.Ref<HTMLFormElement>;
  }
  interface UseFieldPropsReturnBase<InputValue = string> {
    name?: string;
    value?: InputValue;
    multiple?: boolean;
    checked?: boolean;
    onChange?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  }

  interface UseFieldReturnCustom<InputValue> extends UseFieldPropsReturnBase<InputValue> {
    type: "custom";
    setValue: (value: InputValue) => void;
  }

  interface UseFieldReturnStandard<InputValue> extends UseFieldPropsReturnBase<InputValue> {
    type: Exclude<InputType, "custom">;
  }

  interface CommonInputProps<InputValue, FormState > {
    name?: string;
    value?: InputValue;
    index?: number | string;
    validators?: Array<ValidatorFn<InputValue, FormState>>;
    asyncValidator?: AsyncValidatorFn<InputValue>
    onValidation?: (errors: string[], isValid: boolean) => void;
    onAsyncValidation?: (status: AsyncStatus<string>) => void;
    resetSyncErr?: () => void;
    resetAsyncErr?: () => void;
    touched?: boolean;
    multiple?: boolean;
    reducers?: ReducerFn<InputValue, FormState> | ReducerFn<InputValue, FormState>[];
    onChange?: (value: InputValue, event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    innerRef?: React.Ref<HTMLInputElement>;
  }

  interface CheckedInputProps<InputValue, FormState> extends CommonInputProps<InputValue, FormState> {
    type: "checkbox" | "radio";
    checked?: boolean;
  }

  interface NonCheckedInputProps<InputValue, FormState> extends CommonInputProps<InputValue, FormState> {
    type: Exclude<InputType, "checkbox" | "radio">;
    checked?: never;
  }

  type InputProps<InputValue, FormState> =
    | CheckedInputProps<InputValue, FormState>
    | NonCheckedInputProps<InputValue, FormState>;

  type SelectProps<InputValue, FormState> = CommonInputProps<InputValue, FormState> &
    React.SelectHTMLAttributes<HTMLSelectElement>;

    // Base props for Collection component
  interface UseCollectionPropsBase<CollectionValue, FormState> {
    type: "object" | "array";
    touched?: boolean;
    value?: CollectionValue;
    reducers?: ReducerFn<CollectionValue, FormState> | ReducerFn<CollectionValue, FormState>[];
    onValidation?: (errors: string[], isValid: boolean) => void;
    validators?: Array<ValidatorFn<CollectionValue, FormState>>;
    asyncValidator?: AsyncValidatorFn<CollectionValue>;
    onAsyncValidation?: (status: AsyncStatus<string>) => void;
    resetAsyncErr?: () => void;
  }

  // Props when 'name' is provided
  interface UseCollectionPropsWithName<CollectionValue, FormState> extends UseCollectionPropsBase<CollectionValue, FormState> {
    name: string;  // `name` is required
    index?: never;  // `index` should never be provided when `name` is present
  }

  // Props when 'index' is provided
  interface UseCollectionPropsWithIndex<CollectionValue, FormState> extends UseCollectionPropsBase<CollectionValue, FormState> {
    index: number | string;  // `index` is required
    name?: never;  // `name` should never be provided when `index` is present
  }

  type UseCollectionProps<CollectionValue, FormState> = UseCollectionPropsWithName<CollectionValue, FormState> | UseCollectionPropsWithIndex<CollectionValue, FormState>

  interface UseFieldCustomInputProps<InputValue, FormState> extends CommonInputProps<InputValue, FormState> {
    type: "custom";
  }

  type useCollectionReturnType<CollectionValue, FormState> = {
    value: CollectionValue;
    updateCollection: (
      key: CollectionValue extends Array<any> ? number : keyof CollectionValue,
      value: unknown
    ) => void;
    state: FormState;
  };
  // Base props for Collection component
  interface CollectionPropsBase<CollectionValue, FormState> {
    children?: React.ReactNode;
    as?: string // Allow string element as 'as'
    object?: boolean;
    array?: boolean;
    touched?: boolean;
    value?: Partial<CollectionValue>;
    reducers?: ReducerFn<CollectionValue, FormState> | ReducerFn<CollectionValue, FormState>[];
    onValidation?: (errors: string[], isValid: boolean) => void;
    validators?: Array<ValidatorFn<CollectionValue, FormState>>;
    asyncValidator?: AsyncValidatorFn<CollectionValue>;
    onAsyncValidation?: (status: AsyncStatus<string>) => void;
    resetAsyncErr?: () => void;
  }

  // Props when 'name' is provided
  interface CollectionPropsWithName<CollectionValue, FormState> extends CollectionPropsBase<CollectionValue, FormState> {
    name: string;  // `name` is required
    index?: never;  // `index` should never be provided when `name` is present
  }

  // Props when 'index' is provided
  interface CollectionPropsWithIndex<CollectionValue, FormState> extends CollectionPropsBase<CollectionValue, FormState> {
    index: number | string;  // `index` is required
    name?: never;  // `name` should never be provided when `index` is present
  }

  // Union type that ensures either 'name' or 'index' is provided, but not both
  type CollectionProps<CollectionValue, FormState> = CollectionPropsWithName<CollectionValue, FormState> | CollectionPropsWithIndex<CollectionValue, FormState>

  interface PersistStateOnUnmountProps {
    children: React.ReactNode;
  }

  type InputHTMLAttributes = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">
  type FormHTMLAttributes = Omit<React.FormHTMLAttributes<HTMLFormElement>, "onChange" | "onInit" | "onReset" | "onSubmit">
  type SelectHTMLAttributes = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value">
  type TextareaHTMLAttributes = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value">

  // Utility to split a string like "a.b.c" into ["a", "b", "c"]
  type Split<S extends string, D extends string = "."> =
  string extends S ? string[] :
  S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S];

  // Recursively go into the object using path parts
  type PathValue<T, P extends string[]> =
  P extends [infer Head, ...infer Rest]
    ? Head extends keyof T
      ? Rest extends string[]
        ? PathValue<T[Head], Rest>
        : never
      : never
    : T;

  // Resolves a string path like "a.b" to its value type in T
  type GetValueByPath<T, K extends string> = PathValue<T, Split<K>>;

  type AsyncStatus<T> = { status?: "asyncStart" | "asyncSuccess" | "asyncError"; value?: T };

  export enum STATUS {
    ON_RESET = "ON_RESET",
    READY = "READY",
    RESETTED = "RESETTED",
    ON_CHANGE = "ON_CHANGE",
    ON_INIT = "ON_INIT",
    ON_SUBMIT = "ON_SUBMIT",
    ON_INIT_ASYNC = "ON_INIT_ASYNC",
    ON_RUN_ASYNC = "ON_RUN_ASYNC",
    ON_ASYNC_END = "ON_ASYNC_END"
  }

  export const Form: <FormState>(props: FormProps<FormState> & FormHTMLAttributes) => React.ReactElement;
  export const Input: <InputValue = unknown, FormState = unknown>(props: InputProps<InputValue, FormState> & InputHTMLAttributes) => React.ReactElement;
  export const Select: <InputValue = unknown, FormState = unknown>(props: SelectProps<InputValue, FormState> & SelectHTMLAttributes) => React.ReactElement;
  export const TextArea: <InputValue = unknown, FormState = unknown>(props: InputProps<InputValue, FormState> & TextareaHTMLAttributes) => React.ReactElement;
  export const Collection: <CollectionValue = unknown, FormState = unknown>(props: CollectionProps<CollectionValue, FormState>) => React.ReactElement;
  export const PersistStateOnUnmount: React.FC<PersistStateOnUnmountProps>;
  export const FormContext: <FormState = unknown>(props: Omit<FormProps<FormState>, "innerRef">) => React.ReactElement;

  export function useForm<FormState>(): {
    state: FormState;
    reset: () => void;
    isValid: boolean;
    pristine: boolean;
    submitted: number;
    submitAttempts: number;
    isSubmitting: boolean;
    formStatus: keyof typeof STATUS;
    dispatch: (state: FormState | ((prevState: FormState) => FormState)) => void;
    onSubmitForm: (e: React.FormEvent) => void;
  };

  export function useField<InputValue = string, FormState = InputValue>(
    props: UseFieldCustomInputProps<InputValue, FormState>
  ): UseFieldReturnCustom<InputValue>;

  export function useField<InputValue = string, FormState = InputValue>(
    props: InputProps<InputValue, FormState>
  ): UseFieldReturnStandard<InputValue>;


  export function useAsyncValidation<Value = unknown>(asyncValidator:AsyncValidatorFn<Value>): [
    AsyncStatus<string>,
    { onAsyncValidation: (status: AsyncStatus<string>) => void; asyncValidator: AsyncValidatorFn<Value>; resetAsyncErr: () => void }
  ];

  export function useValidation<Value, FormState = Value>(validators: Array<ValidatorFn<Value, FormState>>): [
    { error?: string; isValid: boolean },
    { onValidation: (errors: string[], isValid: boolean) => void; validators: Array<ValidatorFn<Value, FormState>>; resetSyncErr: () => void }
  ];

  export function useSelector<T = unknown, FormState = Record<string, any>>(selector: (state: FormState) => T): [T, (value: T | ((prev: T) => T)) => void];

  export function useCollection<CollectionValue = unknown, FormState  = Record<string, any>>(props: UseCollectionProps<CollectionValue, FormState>): useCollectionReturnType<CollectionValue, FormState>;

  export function useChildren<T = unknown>(initialValue?: T[], onReset?: () => void): [T[], React.Dispatch<React.SetStateAction<T[]>>];

  export function useMultipleForm(onChange?: (state: Record<string, any>) => void): [() => Record<string, any>, Record<string, any>];
  export function withIndex<T>(Component: React.ComponentType<T>): React.FC<T>;


  export function createFormStore<FormState>(
    initialState?: Partial<FormState>
  ): [
    FormStore<FormState>,
    <K extends string>(
      selector: (state: FormState) => GetValueByPath<FormState, K>
    ) => [
      GetValueByPath<FormState, K>,
      (value: GetValueByPath<FormState, K> | ((prev: GetValueByPath<FormState, K>) => GetValueByPath<FormState, K>)) => void
    ]
  ];
}
