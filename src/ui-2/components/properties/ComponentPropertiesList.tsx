import * as React from 'react';
// var EntityProperty = require('./EntityProperty');
// import ObjectPropertyItem from './ObjectPropertyItem';
import PropertyItem from './PropertyItem';
import { SerializedComponent, SerializedProperty } from '../../../agent/types';

interface Props {
  entityId: string;
  component: SerializedComponent;
}

export default class PropertiesList extends React.Component<Props> {
  renderPropertyValue(property: SerializedProperty) {
    if (property.type === 'primitive') {
      if (property.value === null) {
        return 'null';
      } else if (property.value === undefined) {
        return 'undefined';
      } else if (property.value === true) {
        return 'true';
      } else if (property.value === false) {
        return 'false';
      } else if (typeof property.value === 'string') {
        return `"${property.value}"`;
      }

      return property.value;
    } else if (property.type === 'object') {
      return `${property.objectType}`;
    } else if (property.type === 'array') {
      return `Array`;
    } else if (property.type === 'coordinates') {
      return `{x: ${property.value.x}, y: ${property.value.y}}`;
    } else if (property.type === 'entity') {
      return `Entity ${property.entityId}`;
    }
  }

  renderItem(property: SerializedProperty): JSX.Element {
    // if (typeof val === 'object' && val !== null) {
    //   return (
    //     <ObjectPropertyItem
    //       entityId={this.props.entityId}
    //       componentName={this.props.componentName}
    //       prop={key}
    //       path={path}
    //       value={val}
    //       key={key}
    //     />
    //   );
    // }

    // <PropertyItem
    //   entityId={this.props.entityId}
    //   componentName={this.props.componentName}
    //   prop={key}
    //   path={path}
    //   value={val}
    //   key={key}
    // />
    return (
      <li key={property.name}>
        <strong>{property.name}</strong>: {this.renderPropertyValue(property)}
      </li>
    );
  }

  render() {
    const properties = this.props.component.properties;

    const items = Object.keys(properties).map((propName) =>
      this.renderItem(properties[propName])
    );

    return <ul>{items}</ul>;
  }
}
