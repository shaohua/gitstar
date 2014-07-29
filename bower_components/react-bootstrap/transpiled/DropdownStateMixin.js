define(
  ["./react-es6","./react-es6/lib/EventListener","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var React = __dependency1__["default"];
    var EventListener = __dependency2__["default"];

    /**
     * Checks whether a node is within
     * a root nodes tree
     *
     * @param {DOMElement} node
     * @param {DOMElement} root
     * @returns {boolean}
     */
    function isNodeInRoot(node, root) {
      while (node) {
        if (node === root) {
          return true;
        }
        node = node.parentNode;
      }

      return false;
    }

    var DropdownStateMixin = {
      getInitialState: function () {
        return {
          open: false
        };
      },

      setDropdownState: function (newState, onStateChangeComplete) {
        if (newState) {
          this.bindRootCloseHandlers();
        } else {
          this.unbindRootCloseHandlers();
        }

        this.setState({
          open: newState
        }, onStateChangeComplete);
      },

      handleDocumentKeyUp: function (e) {
        if (e.keyCode === 27) {
          this.setDropdownState(false);
        }
      },

      handleDocumentClick: function (e) {
        // If the click originated from within this component
        // don't do anything.
        if (isNodeInRoot(e.target, this.getDOMNode())) {
          return;
        }

        this.setDropdownState(false);
      },

      bindRootCloseHandlers: function () {
        this._onDocumentClickListener =
          EventListener.listen(document, 'click', this.handleDocumentClick);
        this._onDocumentKeyupListener =
          EventListener.listen(document, 'keyup', this.handleDocumentKeyUp);
      },

      unbindRootCloseHandlers: function () {
        if (this._onDocumentClickListener) {
          this._onDocumentClickListener.remove();
        }

        if (this._onDocumentKeyupListener) {
          this._onDocumentKeyupListener.remove();
        }
      },

      componentWillUnmount: function () {
        this.unbindRootCloseHandlers();
      }
    };

    __exports__["default"] = DropdownStateMixin;
  });