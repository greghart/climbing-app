import * as React from 'react';
import { connect } from 'react-redux';

import Accordion from './Accordion';
import { setOpen } from '../../ducks/accordion';
import scopeObject from '../../ducks/util/scopeObject';
import scopedSelector from '../../ducks/util/scopedSelector';
import { State } from '../../reducer';
import { ExtractProps } from '../../../externals';

type Props = Pick<ExtractProps<typeof Accordion>, 'header' | 'content'> & {
  scope: string;
  defaultOpen?: boolean;
}

const mapStateToProps = (state: State, ownProps: Props) => {
  const target = scopedSelector(ownProps.scope)(state.accordion).open;
  console.warn({
    state,
    ownProps,
    target
  }, 'AccordionContainer')
  return {
    isOpen: target == undefined ? ownProps.defaultOpen : target
  };
};

const mapDispatchToProps = (dispatch, ownProps: Props) => {
  return {
    onToggle: (isOpen: boolean) => dispatch(
      scopeObject(
        setOpen(!isOpen),
        ownProps.scope
      )
    )
  };
};

const AccordionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Accordion);
AccordionContainer.defaultProps = {
  defaultOpen: true
}

export default AccordionContainer;
