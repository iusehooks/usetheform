import React, { createContext } from "react";

import {
  FormStoreContext,
  FormStoreContextIsolatad
} from "./hooks/useFormStore";

export class FormStore extends React.PureComponent {
  constructor(props) {
    super(props);
    const { reducers: storeReducers } = props;

    const setStoreDispatcher = dispatch =>
      this.setState(prev => ({ store: { ...prev.store, dispatch } }));
    const setStoreState = state =>
      this.setState(prev => ({ store: { ...prev.store, state } }));

    this.state = {
      store: { dispatch: null, state: {} },
      fn: { storeReducers, setStoreDispatcher, setStoreState }
    };
  }

  render() {
    return (
      <FormStoreContext.Provider value={this.state.store}>
        <FormStoreContextIsolatad.Provider value={this.state.fn}>
          {this.props.children}
        </FormStoreContextIsolatad.Provider>
      </FormStoreContext.Provider>
    );
  }
}
