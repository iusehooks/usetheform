import React from "react";

import { FormStoreContext } from "./hooks/useFormStore";

export class FormStore extends React.PureComponent {
  constructor(props) {
    super(props);
    const { reducers: storeReducers } = props;
    const setStoreDispatcher = dispatch => this.setState({ dispatch });
    const setStoreState = state => this.setState({ state });
    this.state = {
      storeReducers,
      dispatch: null,
      setStoreDispatcher,
      state: {},
      setStoreState
    };
  }

  render() {
    return (
      <FormStoreContext.Provider value={this.state}>
        {this.props.children}
      </FormStoreContext.Provider>
    );
  }
}
