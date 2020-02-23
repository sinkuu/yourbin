import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { editorUpdate } from "../action";

const ModeButton = (props: {
  active: boolean;
  children: string;
  onClick: () => void;
}) => {
  const { active, onClick, children } = props;
  return (
    <button
      className={"button" + (active ? " is-active" : "")}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const IndentConfig = (props: any) => {
  const { id, indent, dispatch } = props;

  console.log(props);

  const setMode = (mode: "space" | "tab") => {
    dispatch(
      editorUpdate(id, editor => ({
        ...editor,
        indent: { ...editor.indent, mode }
      }))
    );
  };

  const setSize = (size: number) => {
    dispatch(
      editorUpdate(id, editor => ({
        ...editor,
        indent: { ...editor.indent, size }
      }))
    );
  };

  const displayMode =
    indent.mode.charAt(0).toUpperCase() + indent.mode.slice(1);

  return (
    <div className="dropdown is-hoverable">
      <div className="dropdown-trigger">
        <button className="button">
          <span>
            {displayMode}: {indent.size}
          </span>
          <span className="icon is-small">
            <FontAwesomeIcon icon={faAngleDown} />
          </span>
        </button>
      </div>
      <div className="dropdown-menu">
        <div className="dropdown-content">
          <div className="dropdown-item">
            <ModeButton
              active={indent.mode === "space"}
              onClick={() => setMode("space")}
            >
              Spaces
            </ModeButton>
            &nbsp;
            <ModeButton
              active={indent.mode === "tab"}
              onClick={() => setMode("tab")}
            >
              Tabs
            </ModeButton>
          </div>
          <hr className="dropdown-separator" />
          <div className="dropdown-item">
            <div className="control">
              Indent size:
              <input
                type="number"
                value={indent.size}
                onChange={e => setSize(parseInt(e.target.value, 10))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect()(IndentConfig);
