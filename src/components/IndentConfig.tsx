import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { IndentConfig } from "../state";

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

interface IndentConfigProps {
  indent: IndentConfig,
  onModeChange: (mode: "space" | "tab") => void;
  onSizeChange: (size: number) => void;
}

export default (props: IndentConfigProps) => {
  const { indent, onModeChange, onSizeChange } = props;

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
              onClick={() => onModeChange("space")}
            >
              Spaces
            </ModeButton>
            &nbsp;
            <ModeButton
              active={indent.mode === "tab"}
              onClick={() => onModeChange("tab")}
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
                onChange={e => onSizeChange(parseInt(e.target.value, 10))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
