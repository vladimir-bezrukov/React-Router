'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _React$PropTypes = _react2['default'].PropTypes;
var bool = _React$PropTypes.bool;
var object = _React$PropTypes.object;
var string = _React$PropTypes.string;
var func = _React$PropTypes.func;

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

/**
 * A <Link> is used to create an <a> element that links to a route.
 * When that route is active, the link gets an "active" class name
 * (or the value of its `activeClassName` prop).
 *
 * For example, assuming you have the following route:
 *
 *   <Route path="/posts/:postID" component={Post} />
 *
 * You could use the following component to link to that route:
 *
 *   <Link to={`/posts/${post.id}`} />
 *
 * Links may pass along location state and/or query string parameters
 * in the state/query props, respectively.
 *
 *   <Link ... query={{ show: true }} state={{ the: 'state' }} />
 */
var Link = _react2['default'].createClass({
  displayName: 'Link',

  contextTypes: {
    history: object
  },

  propTypes: {
    activeStyle: object,
    activeClassName: string,
    onlyActiveOnIndex: bool.isRequired,
    to: string.isRequired,
    query: object,
    state: object,
    onClick: func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      className: '',
      activeClassName: 'active',
      onlyActiveOnIndex: false,
      style: {}
    };
  },

  getInitialState: function getInitialState() {
    var active = this.getActiveState();
    return { active: active };
  },

  trySubscribe: function trySubscribe() {
    var history = this.context.history;

    if (!history) return;
    this._unlisten = history.listen(this.handleHistoryChange);
  },

  tryUnsubscribe: function tryUnsubscribe() {
    if (!this._unlisten) return;
    this._unlisten();
    this._unlisten = undefined;
  },

  handleHistoryChange: function handleHistoryChange() {
    var active = this.state.active;

    var nextActive = this.getActiveState();
    if (active !== nextActive) {
      this.setState({ active: nextActive });
    }
  },

  getActiveState: function getActiveState() {
    var history = this.context.history;
    var _props = this.props;
    var to = _props.to;
    var query = _props.query;
    var onlyActiveOnIndex = _props.onlyActiveOnIndex;

    if (!history) return false;
    return history.isActive(to, query, onlyActiveOnIndex);
  },

  componentDidMount: function componentDidMount() {
    this.trySubscribe();
  },

  componentWillUnmount: function componentWillUnmount() {
    this.tryUnsubscribe();
  },

  handleClick: function handleClick(event) {
    var allowTransition = true;
    var clickResult;

    if (this.props.onClick) clickResult = this.props.onClick(event);

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) return;

    if (clickResult === false || event.defaultPrevented === true) allowTransition = false;

    event.preventDefault();

    if (allowTransition) this.context.history.pushState(this.props.state, this.props.to, this.props.query);
  },

  componentWillMount: function componentWillMount() {
    _warning2['default'](this.context.history, 'A <Link> should not be rendered outside the context of history; ' + 'some features including real hrefs, active styling, and navigation ' + 'will not function correctly');
  },

  render: function render() {
    var _props2 = this.props;
    var to = _props2.to;
    var query = _props2.query;

    var props = _extends({}, this.props, {
      onClick: this.handleClick
    });

    var history = this.context.history;
    var active = this.state.active;

    // Ignore if rendered outside the context
    // of history, simplifies unit testing.
    if (history) {
      props.href = history.createHref(to, query);

      if (active) {
        if (props.activeClassName) props.className += props.className !== '' ? ' ' + props.activeClassName : props.activeClassName;

        if (props.activeStyle) props.style = _extends({}, props.style, props.activeStyle);
      }
    }

    return _react2['default'].createElement('a', props);
  }

});

exports['default'] = Link;
module.exports = exports['default'];