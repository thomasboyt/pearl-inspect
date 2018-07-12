import * as React from 'react';
// var EntityProperty = require('./EntityProperty');
import ObjectPropertyItem from './ObjectPropertyItem';
import PropertyItem from './PropertyItem';

interface Props {
  value: any;
  entityId: string;
  componentName: string;
  lastPath?: string[];
}

export default class PropertiesList extends React.Component<Props> {
  renderItem(key: string, val: any): JSX.Element {
    const lastPath = this.props.lastPath || [];
    const path = lastPath.concat(key);

    if (typeof val === 'object' && val !== null) {
      return (
        <ObjectPropertyItem
          entityId={this.props.entityId}
          componentName={this.props.componentName}
          prop={key}
          path={path}
          value={val}
          key={key}
        />
      );
    }

    return (
      <PropertyItem
        entityId={this.props.entityId}
        componentName={this.props.componentName}
        prop={key}
        path={path}
        value={val}
        key={key}
      />
    );
  }

  render() {
    var obj = this.props.value;

    var items = Object.keys(obj).map((prop) =>
      this.renderItem(prop, obj[prop])
    );

    return <ul>{items}</ul>;
  }
}
