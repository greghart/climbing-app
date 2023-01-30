import * as React from 'react';
import { Tooltip } from 'react-leaflet';
import { LeafletEvent } from 'leaflet';

import { ExtractProps } from '../../../externals';
import _debug from '../../../debug';
const debug = _debug.extend('redux/components/map/ClickableTooltip');

type Props = ExtractProps<Tooltip> & {
  onClick: (e: LeafletEvent | MouseEvent) => unknown;
};

/**
 * Setup a clickable tooltip
 * You can set an `onClick` that will trigger *if* the popup is open
 */
class ClickableTooltip extends React.Component<Props> {
  ref = React.createRef<Tooltip>();

  constructor(props) {
    super(props);
    this.onTooltipClose = this.onTooltipClose.bind(this);
    this.onTooltipOpen = this.onTooltipOpen.bind(this);
  }

  handleClick(e) {
    console.warn({
      e,
      isPopupOpen: this.ref.current.leafletElement.isPopupOpen(),
    },           'This is a click');
    if (this.ref.current.leafletElement.isPopupOpen()) {
      this.props.onClick && this.props.onClick(e);
    }
  }

  componentDidMount() {
    this.ref.current.leafletElement.on('tooltipopen', () => {
      debug('tooltipopen');
    });
    this.ref.current.leafletElement.on('click', () => {
      debug('click');
    });
    // this.ref.current.leafletElement.getElement().addEventListener('click', () => {
    //   debug('click 2');
    // });
    this.ref.current.onTooltipClose  = this.onTooltipClose;
  }

  onTooltipOpen() {
    debug('setting up', {
      this: this,
      el: this.ref.current.leafletElement.getElement(),
    });
    this.ref.current.leafletElement.on('click', this.handleClick);
    this.ref.current.leafletElement.getElement().addEventListener('click', this.handleClick);
  }

  onTooltipClose() {
    console.warn('on close?');
    this.ref.current.leafletElement.off('click', this.handleClick);
  }

  render() {
    return (
      <Tooltip
        ref={this.ref}
        onOpen={this.onTooltipOpen}
        onClose={this.onTooltipClose}
        {...this.props}
      />
    );
  }
}

export default ClickableTooltip;
