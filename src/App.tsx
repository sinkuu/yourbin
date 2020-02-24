import React, { useCallback, useState } from "react";
import "./App.sass";
// import "bulma";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import {
  HashRouter,
  Route,
  NavLink,
  Switch,
  useHistory
} from "react-router-dom";
import New from "./components/page/New";
import { connect } from "react-redux";
import { State, EditorState } from "./state";
import Favorite from "./components/page/Favorite";
import UnloadPrompt from "./components/UnloadPrompt";
import View from "./components/page/View";
import Yours from "./components/page/Yours";
import { setErrorMessage } from "./action";
const classNames = require("classnames");

function RouteLink(props: { to: string; children: string; exact: boolean }) {
  return (
    <NavLink
      to={props.to}
      exact={props.exact}
      className="navbar-item"
      activeClassName="navbar-item has-background-grey-lighter"
    >
      {props.children}
    </NavLink>
  );
}

function NavBar(props: { modified: boolean }) {
  const history = useHistory();

  const [state, setState] = useState({ burgerActive: false });

  const onSearch = useCallback(
    e => {
      const value: string = e.target.value;
      const cid = value.replace(/^\/ipfs\/|\/$/g, "");

      if (cid.match(/^\w+/)) {
        history.push("/view/ipfs/" + cid);
      }
    },
    [history]
  );

  return (
    <nav
      className="navbar has-background-white-ter"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <button
          className={classNames("button navbar-burger burger", {
            "is-active": state.burgerActive
          })}
          onClick={() => {
            setState({ burgerActive: !state.burgerActive });
          }}
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          style={{ border: 0, appearance: "none" }}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>

      <div
        className={classNames("navbar-menu", {
          "is-active": state.burgerActive
        })}
      >
        <div className="navbar-start">
          <RouteLink exact to="/">
            {"New" + (props.modified ? " *" : "")}
          </RouteLink>

          <RouteLink exact={false} to="/yours">
            Your pastes
          </RouteLink>

          {/* <RouteLink to="/favorite">Favorite</RouteLink> */}
        </div>

        <div className="navbar-end">
          <div className="navbar-item has-dropdown is-active">
            <div
              className={classNames("navbar-dropdown is-right", {
                "is-hidden": !!window.ipfs
              })}
            >
              <div className="navbar-item">
                <span className="icon">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                </span>
                This site requires local IPFS daemon and&nbsp;
                <a href="https://github.com/ipfs-shipyard/ipfs-companion/">
                  IPFS Companion
                </a>
                &nbsp;installed.
              </div>
            </div>
          </div>
          <div className="navbar-item">
            <p className="control has-icons-left">
              <input
                className="input"
                type="text"
                placeholder="IPFS Path"
                onChange={onSearch}
              />
              <span className="icon is-left">
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Notification(props: {
  message: string | null;
  onCloseButtonClicked: () => void;
}) {
  const { message, onCloseButtonClicked } = props;

  return (
    <div className={classNames("container", { "is-hidden": !message })}>
      <div id="error_notification" className="notification is-warning is-light">
        <button
          className="delete"
          aria-label="delete"
          onClick={onCloseButtonClicked}
        ></button>
        <span className="icon">
          <FontAwesomeIcon icon={faExclamationTriangle} />
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
}

function App(props: {
  dispatch: (action: any) => void;
  modified: boolean;
  error_message: string | null;
}) {
  const { dispatch, modified, error_message } = props;
  return (
    <HashRouter>
      <UnloadPrompt when={modified} />
      <NavBar modified={modified} />
      <Notification
        message={error_message}
        onCloseButtonClicked={useCallback(
          () => dispatch(setErrorMessage(null)),
          [dispatch]
        )}
      />
      <Switch>
        <Route path="/" exact>
          <New />
        </Route>
        <Route exact path="/yours/:page?" component={Yours} />
        <Route path="/favorite">
          <Favorite />
        </Route>
        <Route path="/view/ipfs/:path">
          <View />
        </Route>
      </Switch>
    </HashRouter>
  );
}

const mapStateToProps = (state: State) => {
  return {
    modified: Object.values(state.editors.states).some(
      (e: EditorState) => e.modified
    ),
    error_message: state.error_message
  };
};

export default connect(mapStateToProps)(App);
