import React, { PureComponent, createContext } from "react";

export const IndexContext = createContext();
let ids = -1;
export function withIndex(Cmp) {
  class WithIndex extends PureComponent {
    constructor(props) {
      super(props);
      ids = ids + 1;
    }

    render() {
      return (
        <IndexContext.Provider value={ids}>
          <Cmp {...this.props} />
        </IndexContext.Provider>
      );
    }
  }

  return WithIndex;
}
