import * as React from "react";
import { connect } from "react-redux";

import Accordion from "./Accordion.js";
import { setOpen } from "../../ducks/accordion.js";
import scopeObject from "../../ducks/util/scopeObject.js";
import scopedSelector from "../../ducks/util/scopedSelector.js";
import type { State } from "../../reducer.js";
import type { ExtractProps } from "../../../externals.js";

type Props = Pick<ExtractProps<typeof Accordion>, "header" | "content"> & {
  scope: string;
  defaultOpen?: boolean;
};

const mapStateToProps = (state: State, ownProps: Props) => {
  const target = scopedSelector(ownProps.scope)(state.accordion).open;
  return {
    isOpen: target === undefined ? ownProps.defaultOpen : target,
  };
};

const mapDispatchToProps = (dispatch, ownProps: Props) => {
  return {
    onToggle: (isOpen: boolean) =>
      dispatch(scopeObject(setOpen(!isOpen), ownProps.scope)),
  };
};

const AccordionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Accordion);
AccordionContainer.defaultProps = {
  defaultOpen: true,
};

export default AccordionContainer;
