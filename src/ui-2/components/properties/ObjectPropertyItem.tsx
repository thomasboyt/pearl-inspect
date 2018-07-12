import * as React from 'react';
import PropertiesList from './PropertiesList';

interface Props {
  value: any;
  entityId: string;
  componentName: string;
  prop: string;
  path: string[];
}

export default class ObjectPropertyItem extends React.Component<Props> {
  state = {
    isOpen: false,
  };

  handleToggleOpen() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    const isOpen = this.state.isOpen;

    // TODO: serialized constructor name?
    const label = 'Object';

    return (
      <li>
        <span onClick={this.handleToggleOpen}>
          {/* <ListArrow isActive={isOpen} /> */}
          <code>{this.props.prop}</code>: {label}
        </span>

        {isOpen && (
          <PropertiesList
            entityId={this.props.entityId}
            componentName={this.props.componentName}
            value={this.props.value}
            lastPath={this.props.path}
          />
        )}
      </li>
    );
  }
}
