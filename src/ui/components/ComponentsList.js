var React = require('react');
var _ = require('lodash');

var ComponentsList = React.createClass({
  render() {
    const entity = this.props.entity;
    const components = entity.components;

    const items = _.map(components, (component, name) => {
      return <li key={name}>{name}</li>;
    });

    return <ul>{items}</ul>;
  },
});

module.exports = ComponentsList;
