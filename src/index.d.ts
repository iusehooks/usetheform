declare module "usetheform" {

  export interface FormProps<FormState> {
    children?: React.ReactNode;
    initialState?: FormState;
    onChange?: (state: FormState, isValid: boolean) => void;
    onInit?: (state: FormState, isValid: boolean) => void;
    onReset?: (state: FormState, isValid: boolean) => void;
    onSubmit?: (state: FormState, isValid: boolean) => void;
    onValidation?: (errors: Array<string>, isValid: boolean) => void;
    resetSyncErr?: () => void;
    validators?: Array<(value: any, formState: FormState) => string | undefined>;
    asyncValidator?: (value: any) => Promise<any>;
    onAsyncValidation?: (status: { status?: string; value?: any }) => void;
    resetAsyncErr?: () => void;
    touched?: boolean;
    reducers?: Array<(state: FormState, prevState: FormState, formState: FormState) => FormState>;
    name?: string;
    action?: string;
    formStore?: FormStore;
    innerRef?: React.Ref<HTMLFormElement>;
  }
  export interface InputProps<InputValue, FormState> {
    type: string;
    name?: string;
    value?: any;
    index?: number | string;
    checked?: boolean;
    validators?: Array<(value: InputValue, formState: FormState) => string | undefined>;
    asyncValidator?: (value: InputValue) => Promise<InputValue>;
    onValidation?: (errors: Array<string>, isValid: boolean) => void;
    onAsyncValidation?: (status: { status?: string; value?: InputValue }) => void;
    resetSyncErr?: () => void;
    resetAsyncErr?: () => void;
    touched?: boolean;
    multiple?: boolean;
    reducers?: Array<(value: InputValue, prevValue: InputValue, formState: FormState) => InputValue>;
    onChange?: (value: InputValue, event: React.ChangeEvent) => void;
    onBlur?: (event: React.FocusEvent) => void;
    onFocus?: (event: React.FocusEvent) => void;
    innerRef?: React.Ref<HTMLInputElement>;
  }
  export interface CollectionProps<CollectionValue, FormState> {
    children?: React.ReactNode;
    name?: string;
    index?: number | string;
    object?: boolean;
    array?: boolean;
    touched?: boolean;
    value?: any;
    reducers?: Array<(state: CollectionValue, prevState: CollectionValue, formState: FormState) => any>;
    onValidation?: (errors: Array<string>, isValid: boolean) => void;
    resetSyncErr?: () => void;
    validators?: Array<(value: CollectionValue, formState: FormState) => string | undefined>;
    asyncValidator?: (value: CollectionValue) => Promise<CollectionValue>;
    onAsyncValidation?: (status: { status?: string; value?: CollectionValue }) => void;
    resetAsyncErr?: () => void;
  }
  export interface FormStore<FormState> {
    getState: () => FormState;
    update: (formState: FormState, shouldNotify?: boolean) => void;
  }


  export const Form: <FormState>(props: FormProps<FormState>) => React.ReactElement;
  export const Input: <InputValue, FormState>(props: InputProps<InputValue, FormState>) => React.ReactElement;
  export const Select: <InputValue, FormState>(props: InputProps<InputValue, FormState>) => React.ReactElement;
  export const TextArea: <InputValue, FormState>(props: InputProps<InputValue, FormState>) => React.ReactElement;
  export const Collection: <CollectionValue, FormState>(props: CollectionProps<CollectionValue, FormState>) => React.ReactElement;
  export const PersistStateOnUnmount: React.FC;
  export const FormContext: React.FC<FormProps<FormState>>;

  export function getValueByPath(path: string | string[], obj: Record<string, any>, separator?: string): any;
  export const STATUS: {
    ON_RESET: string;
    READY: string;
    RESETTED: string;
    ON_CHANGE: string;
    ON_INIT: string;
    ON_SUBMIT: string;
    ON_INIT_ASYNC: string;
    ON_RUN_ASYNC: string;
    ON_ASYNC_END: string;
  };

  export function useForm<FormState>(): {
    state: FormState;
    reset: () => void;
    isValid: boolean;
    pristine: boolean;
    submitted: number;
    submitAttempts: number;
    isSubmitting: boolean;
    formStatus: string;
    dispatch: (state: FormState | ((prevState: FormState) => FormState)) => void;
    onSubmitForm: (e: React.FormEvent) => void;
  };
  export function useValidation<Value, FormState>(validators: Array<(value: Value, formState: FormState) => string | undefined>): [
    { error?: string; isValid: boolean },
    { onValidation: (errors: Array<string>, isValid: boolean) => void; validators: Array<Function>; resetSyncErr: () => void }
  ];
  export function useSelector<T>(selector: (state: Record<string, any>) => T): [T, (value: T | ((prev: T) => T)) => void];
  export function useAsyncValidation(asyncValidator: (value: any) => Promise<any>): [
    { status?: string; value?: any },
    { onAsyncValidation: (status: { status?: string; value?: any }) => void; asyncValidator: Function; resetAsyncErr: () => void }
  ];

  const getProperty: GetProperty<FormState, keyof FormState> = (obj, key) => obj[key];

  export function useChildren<T>(initialValue?: T[]): [T[], React.Dispatch<React.SetStateAction<T[]>>];
  export function useField(props: InputProps): Record<string, any>;
  export function useCollection(props: CollectionProps): Record<string, any>;
  export function useMultipleForm(onChange?: (state: Record<string, any>) => void): [() => Record<string, any>, Record<string, any>];
  export function withIndex<T>(Component: React.ComponentType<T>): React.FC<T>;
  export function createFormStore<FormState>(
    initialState?: FormState
  ): [
      FormStore<FormState>,
      <K extends keyof FormState>(
        selector: (state: FormState) => FormState[K]
      ) => [FormState[K], (value: FormState[K] | ((prev: FormState[K]) => FormState[K])) => void
        ]
    ];
}