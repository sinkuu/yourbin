import { connect } from "react-redux";
import React, { useMemo, useEffect, useState } from "react";
import Editor from "./Editor";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { editorUpdate, editorRemove } from "../action";
import { EditorState } from "../state";
import CodeMirror from "codemirror";
import "codemirror/mode/meta";
import IndentConfig from "./IndentConfig";

const TYPE_AUTO = "__AUTO";

interface FileProps {
  dispatch: (action: any) => void;
  id: string;
  editor: EditorState;
}

const File = (props: FileProps) => {
  const { dispatch, id, editor } = props;

  const autoMode = useMemo(
    // @ts-ignore
    () => CodeMirror.findModeByFileName(editor.filename),
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

  const [state, setState] = useState({ typeSelect: TYPE_AUTO });
  const { typeSelect } = state;

  const currentType =
    typeSelect === TYPE_AUTO ? autoMode?.mime || "" : typeSelect;

  useEffect(() => {
    dispatch(
      editorUpdate(id, editor => {
        const modified = editor.modified || currentType !== "";
        return {
          ...editor,
          type: currentType,
          modified
        };
      })
    );
  }, [currentType, dispatch, id]);

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
                onChange={e =>
                  dispatch(
                    editorUpdate(id, {
                      ...editor,
                      filename: e.target.value,
                      type: currentType,
                      modified: true
                    })
                  )
                }
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
                    setState({ typeSelect: e.target.value });
                  }}
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
            <IndentConfig indent={editor.indent} id={id}/>
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
        <Editor id={id} editor={editor} />
      </div>
    </div>
  );
};

export default connect()(File);
