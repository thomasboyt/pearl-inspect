import * as React from 'react';
import { inject, observer } from 'mobx-react';
import EntitiesStore from '../../stores/EntitiesStore';
import sendMessage from '../../util/sendMessage';
// import PropertyInput from './PropertyInput';

const isUneditable = function(value: any) {
  return (
    typeof value === 'string' &&
    (value === '[[Coquette namespace]]' ||
      value === '[[Circular reference]]' ||
      value.match(/^\[\[Entity .*\]\]$/) ||
      value.match(/^\[\[object [^\s]*\]\]$/))
  );
};

interface Props {
  entitiesStore?: EntitiesStore;
  entityId: string;
  componentName: string;
  value: any;
  prop: string;
  path: string[];
}

@inject(({ entitiesStore }) => ({
  entitiesStore: entitiesStore as EntitiesStore,
}))
@observer
export default class PropertyItem extends React.Component<Props> {
  state = {
    isOpen: false,
  };

  handleOpen() {
    if (isUneditable(this.props.value)) {
      return;
    }

    this.setState({
      isOpen: true,
    });
  }

  handleClose(e: React.FocusEvent<HTMLInputElement>) {
    this.setState({
      isOpen: false,
    });

    let value: string | number = e.target.value;

    if (typeof this.props.value === 'number') {
      value = parseInt(value, 10);
    }

    sendMessage('updateProperty', {
      entityId: this.props.entityId,
      componentName: this.props.componentName,
      path: this.props.path,
      value: value,
    });
  }

  getClassFor(val: any) {
    if (isUneditable(val)) {
      return;
    }

    let className;
    if (val === null) {
      className = 'null';
    } else {
      className = typeof val;
    }

    return 'console-formatted-' + className;
  }

  renderValue() {
    const val = this.props.value;

    const className = this.getClassFor(val);
    const isString = className === 'console-formatted-string';

    return (
      <span className={className} onDoubleClick={this.handleOpen}>
        {isString && '"'}
        {val === null ? 'null' : val.toString()}
        {isString && '"'}
      </span>
    );
  }

  render() {
    const prop = this.props.prop;

    let valueDisplay;
    // if (this.state.isOpen) {
    //   valueDisplay = (
    //     <PropertyInput val={this.props.value} onBlur={this.handleClose} />
    //   );
    // } else {
    valueDisplay = this.renderValue();
    // }

    return (
      <li key={prop} className="entity-property-item">
        <code>{prop}</code>: {valueDisplay}
      </li>
    );
  }
}
