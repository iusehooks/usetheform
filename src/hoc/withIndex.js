import React, { PureComponent } from "react";

export function withIndex(Cmp) {
  class WithIndex extends PureComponent {
    render() {
      return <Cmp {...this.props} />;
    }
  }

  WithIndex.defaultProps = {
    indexAuto: true
  };

  return WithIndex;
}
