import * as React from "react";
import { type SidebarProps } from "react-sidebar";
import Sidebar from "react-sidebar";
import { connect } from "react-redux";

import { setOpen } from "../../ducks/sidebar.js";
import scopeObject from "../../ducks/util/scopeObject.js";
import scopedSelector from "../../ducks/util/scopedSelector.js";
import type { State } from "../../reducer.js";

type Props = SidebarProps & {
  children: React.ReactNode;
};

const MySidebar = (props: Props) => {
  console.warn({ props }, "MySidebar");
  const _Sidebar = Sidebar as any;
  return <_Sidebar {...props}>{props.children}</_Sidebar>;
};

/**
 * Thin container around react-sidebar.
 */
const getContainerForScope = (scope: string) => {
  const mapStateToProps = (state: State) => {
    const target = scopedSelector(scope)(state.sidebar);
    return {
      open: target.open,
    };
  };

  const mapDispatchToProps = {
    onSetOpen: (isOpen: boolean) => {
      return scopeObject(setOpen(isOpen), scope);
    },
  };

  type StateProps = {
    open: boolean;
  };
  type DispatchProps = {
    onSetOpen: (isOpen: boolean) => void;
  };
  return connect<StateProps, DispatchProps, Props>(
    mapStateToProps,
    mapDispatchToProps
  )(MySidebar);
};

export default getContainerForScope("singleton-sidebar");
export { getContainerForScope };
