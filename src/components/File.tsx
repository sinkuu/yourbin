import { connect } from "react-redux";
import React, { useMemo, useState, useCallback } from "react";
import Editor from "./Editor";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { editorRemove } from "../action";
import { EditorState } from "../state";
import CodeMirror from "codemirror";
import "codemirror/mode/meta";
import IndentConfig from "./IndentConfig";

const TYPE_AUTO = "__AUTO";

interface FileProps {
  dispatch: (action: any) => void;
  id: string;
  editor: EditorState;
  onChange: (id: string, content: string) => void;
  onTypeChange: (id: string, type: string) => void;
  onFileNameChange: (id: string, filename: string) => void;
}

const File = (props: FileProps) => {
  const {
    dispatch,
    id,
    editor,
    onChange,
    onTypeChange,
    onFileNameChange
  } = props;

  const autoMode = useMemo(
    () =>
      // @ts-ignore
      editor.filename ? CodeMirror.findModeByFileName(editor.filename) : "",
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
    const autoMime = filename
    // @ts-ignore
      ? CodeMirror.findModeByFileName(filename)?.mime
      : "";
    const currentType = typeSelect === TYPE_AUTO ? autoMime || "" : typeSelect;
    console.log(typeSelect, currentType);
    onTypeChange(id, currentType);
  };

  return (
    <div className="panel">
      <div className="panel-heading">
        <div className="columns">
          <div className="column">
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
          <div className="column">
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
          <div className="column">
            <IndentConfig indent={editor.indent} id={id} />
          </div>
          <div className="column">
            <button
              className="delete is-pulled-right"
              onClick={() => {
                if (
                  !editor.modified ||
                  window.confirm("Do you really want to remove this file?")
                ) {
                  dispatch(editorRemove(id));
                }
              }}
            ></button>
          </div>
        </div>
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

export default connect()(File);
