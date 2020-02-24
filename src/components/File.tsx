import React, { useMemo, useState, useCallback } from "react";
import Editor from "./Editor";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EditorState } from "../state";
import CodeMirror from "codemirror";
import "codemirror/mode/meta";
import IndentConfig from "./IndentConfig";

// @ts-ignore
const findModeByFileName = CodeMirror.findModeByFileName;

const TYPE_AUTO = "__AUTO";

interface FileProps {
  id: string;
  editor: EditorState;
  onChange: (id: string, content: string) => void;
  onTypeChange: (id: string, type: string) => void;
  onFileNameChange: (id: string, filename: string) => void;
  onRemove: (id: string) => void;
  onIndentModeChange: (id: string, mode: "space" | "tab") => void;
  onIndentSizeChange: (id: string, size: number) => void;
}

const File = (props: FileProps) => {
  const {
    id,
    editor,
    onChange,
    onTypeChange,
    onFileNameChange,
    onRemove,
    onIndentModeChange,
    onIndentSizeChange
  } = props;

  const autoMode = useMemo(
    () => findModeByFileName(editor.filename ? editor.filename : ""),
    [editor.filename]
  );

  const modes = useMemo(() => {
    // @ts-ignore
    return CodeMirror.modeInfo.map(mi => {
      return (
        <option key={mi.name} value={mi.mime}>
          {mi.name}
        </option>
      );
    });
  }, []);

  const [state, setState] = useState({ typeSelect: editor.type || TYPE_AUTO });

  const dispatchTypeChange = (typeSelect: string, filename: string) => {
    const autoMime = filename ? findModeByFileName(filename)?.mime : "";
    const currentType = typeSelect === TYPE_AUTO ? autoMime || "" : typeSelect;
    onTypeChange(id, currentType);
  };

  return (
    <div className="panel">
      <div className="panel-heading">
        <nav className="level">
          <div className="level-left">
            <div className="level-item">
              <p className="control has-icons-left">
                <input
                  className="input"
                  type="text"
                  placeholder="Filename"
                  value={editor.filename}
                  onChange={e => {
                    const filename = e.target.value;
                    onFileNameChange(id, filename);
                    if (state.typeSelect === TYPE_AUTO)
                      dispatchTypeChange(state.typeSelect, filename);
                  }}
                />
                <span className="icon is-left">
                  <FontAwesomeIcon icon={faFileAlt} />
                </span>
              </p>
            </div>

            <div className="level-item">
              <div className="control is-expanded">
                <div className="select is-fullwidth">
                  <select
                    onChange={e => {
                      const typeSelect = e.target.value;
                      setState({ typeSelect });
                      dispatchTypeChange(typeSelect, editor.filename);
                    }}
                    value={state.typeSelect}
                  >
                    <option value={TYPE_AUTO}>
                      {"Auto" + (autoMode ? ` (${autoMode.name})` : "")}
                    </option>
                    {modes}
                  </select>
                </div>
              </div>
            </div>
            <div className="level-item">
              <IndentConfig
                indent={editor.indent}
                onModeChange={useCallback(
                  (mode: "space" | "tab") => onIndentModeChange(id, mode),
                  [onIndentModeChange, id]
                )}
                onSizeChange={useCallback(
                  (size: number) => onIndentSizeChange(id, size),
                  [onIndentSizeChange, id]
                )}
              />
            </div>
          </div>

          <div className="level-right">
            <div className="level-item">
              <button
                className="delete is-pulled-right"
                onClick={() => {
                  if (
                    !editor.modified ||
                    window.confirm("Do you really want to remove this file?")
                  ) {
                    onRemove(id);
                  }
                }}
              ></button>
            </div>
          </div>
        </nav>
      </div>
      <div className="panel-item">
        <Editor
          onChange={useCallback((s: string) => onChange(id, s), [id, onChange])}
          editor={editor}
        />
      </div>
    </div>
  );
};

export default File;
