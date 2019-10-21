import React from "react";

import {
  FormStoreContextPublic,
  FormStoreContextPrivate
} from "./hooks/useFormStore";

export class FormStore extends React.PureComponent {
  constructor(props) {
    super(props);
    const { reducers: storeReducers } = props;

    const setFormStore = props =>
      this.setState(prev => ({ store: { ...prev.store, ...props } }));

    this.state = {
      store: {
        dispatch: null,
        state: {},
        meta: { isValid: false, pristine: false }
      },
      fn: { storeReducers, setFormStore }
    };
  }

  render() {
    return (
      <FormStoreContextPublic.Provider value={this.state.store}>
        <FormStoreContextPrivate.Provider value={this.state.fn}>
          {this.props.children}
        </FormStoreContextPrivate.Provider>
      </FormStoreContextPublic.Provider>
    );
  }
}
