import * as React from 'react';
import { SerializedComponent } from '../../agent/types';
import PropertiesList from './properties/PropertiesList';

interface Props {
  entityId: string;
  component: SerializedComponent;
}

export default class ComponentView extends React.Component<Props> {
  render() {
    const component = this.props.component;

    const propertyItems = Object.keys(component.properties).map((name) => {
      const val = component.properties[name];

      return (
        <div className="property-row" key={name}>
          <div className="property-label">{name}</div>
          <div className="property-value">{val}</div>
        </div>
      );
    });

    return (
      <div className="component">
        <div className="component-name">{component.name}</div>
        <div className="component-properties">
          <PropertiesList
            entityId={this.props.entityId}
            componentName={component.name}
            value={component.properties}
          />
        </div>
      </div>
    );
  }
}
