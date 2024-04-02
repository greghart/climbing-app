/**
 * A fixed header that has a backbutton prepend setup
 *
 * Connected already
 */
import * as React from "react";
import { goBack } from "connected-react-router";
import { connect } from "react-redux";

import SearchGroup from "../search/SearchGroup.js";

interface Props {
  input: React.ReactNode;
  onClickPrepend: React.MouseEventHandler<any>;
}

const GoBackHeader: React.SFC<Props> = (props) => {
  return (
    <SearchGroup
      {...props}
      prepend={<i className="fa fa-arrow-left" />}
      onClickPrepend={props.onClickPrepend}
    />
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClickPrepend: () => {
      return dispatch(goBack());
    },
  };
};

export default connect<void, ReturnType<typeof mapDispatchToProps>, any>(
  undefined,
  mapDispatchToProps
)(GoBackHeader);
