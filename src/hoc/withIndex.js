import React, { PureComponent, createContext } from "react";

export const IndexContext = createContext();
let ids = -1;
export function withIndex(Cmp) {
  class WithIndex extends PureComponent {
    constructor(props) {
      super(props);
      ids = ids + 1;
      this.state = { id: ids, getID: this.getID };
    }

    getID() {
      return ++ids;
    }

    render() {
      return (
        <IndexContext.Provider value={this.state}>
          <Cmp {...this.props} />
        </IndexContext.Provider>
      );
    }
  }

  return WithIndex;
}
