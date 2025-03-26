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
    onAsyncValidation?: (status: {status?: string; value?: any}) => void;
    resetAsyncErr?: () => void;
    touched?: boolean;
    reducers?: Array<(state: FormState, prevState: FormState, formState: FormState) => FormState>;
    name?: string;
    action?: string;
    formStore?: FormStore;
    innerRef?: React.Ref<HTMLFormElement>;
  }
  export interface InputProps<Value,FormState> {
    type: string;
    name?: string;
    value?: any;
    index?: number | string;
    checked?: boolean;
    validators?: Array<(value: Value, formState: FormState) => string | undefined>;
    asyncValidator?: (value: Value) => Promise<Value>;
    onValidation?: (errors: Array<string>, isValid: boolean) => void;
    onAsyncValidation?: (status: {status?: string; value?: Value}) => void;
    resetSyncErr?: () => void;
    resetAsyncErr?: () => void;
    touched?: boolean;
    multiple?: boolean;
    reducers?: Array<(value: Value, prevValue: Value, formState: FormState) => Value>;
    onChange?: (value: Value, event: React.ChangeEvent) => void;
    onBlur?: (event: React.FocusEvent) => void;
    onFocus?: (event: React.FocusEvent) => void;
    innerRef?: React.Ref<HTMLInputElement>;
  }
  export interface CollectionProps {
    children?: React.ReactNode;
    name?: string;
    index?: number | string;
    object?: boolean;
    array?: boolean;
    touched?: boolean;
    value?: any;
    reducers?: Array<(state: any, prevState: any, formState: any) => any>;
    onValidation?: (errors: Array<string>, isValid: boolean) => void;
    resetSyncErr?: () => void;
    validators?: Array<(value: any, formState: Record<string, any>) => string | undefined>;
    asyncValidator?: (value: any) => Promise<any>;
    onAsyncValidation?: (status: {status?: string; value?: any}) => void;
    resetAsyncErr?: () => void;
  }
  export interface FormStore {
    getState: () => Record<string, any>;
    update: (formState: Record<string, any>, shouldNotify?: boolean) => void;
  }
  export const Form: React.FC<FormProps>;
  export const Input: React.FC<InputProps>;
  export const Select: React.FC<InputProps>;
  export const TextArea: React.FC<InputProps>;
  export const Collection: React.FC<CollectionProps>;
  export const PersistStateOnUnmount: React.FC;
  export const FormContext: React.FC<FormProps>;
  
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
  
  export function useForm(): {
    state: Record<string, any>;
    reset: () => void;
    isValid: boolean;
    pristine: boolean;
    submitted: number;
    submitAttempts: number;
    isSubmitting: boolean;
    formStatus: string;
    dispatch: (state: Record<string, any> | ((prevState: Record<string, any>) => Record<string, any>)) => void;
    onSubmitForm: (e: React.FormEvent) => void;
  };
  export function useValidation(validators: Array<(value: any, formState: Record<string, any>) => string | undefined>): [
    {error?: string; isValid: boolean},
    {onValidation: (errors: Array<string>, isValid: boolean) => void; validators: Array<Function>; resetSyncErr: () => void}
  ];
  export function useSelector<T>(selector: (state: Record<string, any>) => T): [T, (value: T | ((prev: T) => T)) => void];
  export function useAsyncValidation(asyncValidator: (value: any) => Promise<any>): [
    {status?: string; value?: any},
    {onAsyncValidation: (status: {status?: string; value?: any}) => void; asyncValidator: Function; resetAsyncErr: () => void}
  ];
  
  export function useChildren<T>(initialValue?: T[]): [T[], React.Dispatch<React.SetStateAction<T[]>>];
  export function useField(props: InputProps): Record<string, any>;
  export function useCollection(props: CollectionProps): Record<string, any>;
  export function useMultipleForm(onChange?: (state: Record<string, any>) => void): [() => Record<string, any>, Record<string, any>];
  export function withIndex<T>(Component: React.ComponentType<T>): React.FC<T>;
  export function createFormStore(initialState?: Record<string, any>): [FormStore, (selector: (state: Record<string, any>) => any) => [any, (value: any) => void]];
}