import React from "react";
import "./App.sass";
// import "bulma";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { HashRouter, Route, NavLink, Switch } from "react-router-dom";
import New from "./components/page/New";
import { connect } from "react-redux";
import { State, EditorState } from "./state";
import Favorite from "./components/page/Favorite";
import UnloadPrompt from "./components/UnloadPrompt";
import View from "./components/page/View";

function RouteLink(props: { to: string; children: string }) {
  return (
    <NavLink
      to={props.to}
      exact
      className="navbar-item"
      activeClassName="navbar-item has-background-grey-lighter"
    >
      {props.children}
    </NavLink>
  );
}

function NavBar(props: { modified: boolean }) {
  return (
    <nav
      className="navbar has-background-white-ter"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <button
          className="button navbar-burger burger"
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

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <RouteLink to="/">{"New" + (props.modified ? " *" : "")}</RouteLink>

          <RouteLink to="yours">Your pastes</RouteLink>

          <RouteLink to="favorite">Favorite</RouteLink>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <p className="control has-icons-left">
              <input className="input" type="text" placeholder="IPFS Path" />
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

function App(props: { modified: boolean }) {
  return (
    <HashRouter>
      <UnloadPrompt when={props.modified} />
      <div>
        <NavBar modified={props.modified} />
        <div>
          <Switch>
            <Route path="/" exact>
              <New />
            </Route>
            <Route path="/yours">yours</Route>
            <Route path="/favorite">
              <Favorite />
            </Route>
            <Route path="/view/ipfs/:path">
              <View/>
            </Route>
          </Switch>
        </div>
      </div>
    </HashRouter>
  );
}

const mapStateToProps = (state: State) => {
  return {
    modified: Object.values(state.editors.states).some(
      (e: EditorState) => e.modified
    )
  };
};

export default connect(mapStateToProps)(App);
