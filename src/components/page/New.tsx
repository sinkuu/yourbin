import React, { useCallback } from "react";
import { connect } from "react-redux";
import File from "../File";
import { State, Editors, EditorState } from "../../state";
import {
  editorAdd,
  editorDiscardAll,
  editorUpdate,
  editorRemove,
  editorSetDescription
} from "../../action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FilesInfo } from "../../ipfs";
import { useHistory } from "react-router-dom";
import CodeMirror from "codemirror";

declare global {
  interface Window {
    ipfs: WindowIpfs;
  }
  interface WindowIpfs {
    enable: (options: any) => Promise<any>;
  }
}

const New = (props: { dispatch: (action: any) => void; editors: Editors }) => {
  const { dispatch } = props;

  const onChange = useCallback(
    (id: string, content: string) =>
      dispatch(
        editorUpdate(id, editor => ({
          ...editor,
          modified: true,
          content
        }))
      ),
    [dispatch]
  );

  const onTypeChange = useCallback(
    (id: string, type: string) =>
      dispatch(
        editorUpdate(id, editor => {
          const modified = editor.modified || type !== "";
          return {
            ...editor,
            type,
            modified
          };
        })
      ),
    [dispatch]
  );

  const onFileNameChange = useCallback(
    (id: string, filename: string) =>
      dispatch(
        editorUpdate(id, editor => ({
          ...editor,
          filename,
          modified: true
        }))
      ),
    [dispatch]
  );

  const onRemove = useCallback((id: string) => dispatch(editorRemove(id)), [
    dispatch
  ]);

  const onIndentModeChange = useCallback(
    (id: string, mode: "space" | "tab") => {
      dispatch(
        editorUpdate(id, editor => ({
          ...editor,
          indent: { ...editor.indent, mode }
        }))
      );
    },
    [dispatch]
  );

  const onIndentSizeChange = useCallback(
    (id: string, size: number) => {
      dispatch(
        editorUpdate(id, editor => ({
          ...editor,
          indent: { ...editor.indent, size }
        }))
      );
    },
    [dispatch]
  );

  let editors = Object.entries(props.editors.states).map(
    ([id, e]: [string, EditorState]) => {
      return (
        <section key={id} className="section">
          <div className="container">
            <File
              id={id}
              editor={e}
              onChange={onChange}
              onTypeChange={onTypeChange}
              onFileNameChange={onFileNameChange}
              onRemove={onRemove}
              onIndentModeChange={onIndentModeChange}
              onIndentSizeChange={onIndentSizeChange}
            />
          </div>
        </section>
      );
    }
  );

  const addNew = () => {
    props.dispatch(editorAdd());
  };

  const history = useHistory();

  const publish = async () => {
    let editors = Object.entries(props.editors.states);
    const description = props.editors.description;
    props.dispatch(editorDiscardAll());
    editors.sort(([k1, _v1], [k2, _v2]) => parseInt(k1, 10) - parseInt(k2, 10));

    editors = editors.map(([id, e]: [string, EditorState]) => {
      let filename;
      let ext;
      if (e.filename) {
        filename = e.filename;
        // @ts-ignore
      } else if ((ext = CodeMirror.findModeByMIME(e.type)?.ext[0])) {
        filename = id + "." + ext;
      } else {
        filename = id;
      }

      return [
        id,
        {
          ...e,
          filename
        }
      ];
    });

    const files: any[] = editors.map(([id, e]: [string, EditorState]) => ({
      path: "/" + e.filename,
      content: e.content || [],
      mtime: { secs: Math.floor(new Date().getTime() / 1000) }
    }));

    let filesinfo: FilesInfo = editors.reduce(
      (o, [id, editor]) => ({
        ...o,
        files: {
          ...o.files,
          [id]: {
            filename: editor.filename,
            type: editor.type
          }
        }
      }),
      { description, files: {} }
    );

    files.push({
      path: "/.yourbin.json",
      content: JSON.stringify(filesinfo),
      mtime: null
    });

    if (window.ipfs && window.ipfs.enable) {
      const ipfs = await window.ipfs.enable({ commands: ["add"] });
      const result = await ipfs.add(files, {
        hashAlg: "blake2b-256",
        cidVersion: 1,
        pin: false,
        wrapWithDirectory: true
      });

      // history.push()
      console.log(result);

      const ipfsPath = "/ipfs/" + result.slice(-1)[0].hash;

      await ipfs.files.mkdir("/yours", {
        parents: true,
        hashAlg: "blake2b-256"
      });
      await ipfs.files.cp(ipfsPath, "/yours/" + new Date().getTime(), {
        hashAlg: "blake2b-256"
      });

      history.push("/view" + ipfsPath);
    }
  };

  return (
    <div>
      {editors}

      <section className="section">
        <div className="container">
          <button className="button is-pulled-left" onClick={addNew}>
            <span className="icon">
              <FontAwesomeIcon icon={faPlus} />
            </span>
            <span>Add new file</span>
          </button>

          <div className="is-pulled-right">
            <button className="button is-primary" onClick={publish}>
              <span className="icon">
                <FontAwesomeIcon icon={faUpload} />
              </span>
              <span>Publish</span>
            </button>
          </div>
          {/* <div className="column">
                <button className="button">
                  <span className="icon">
                    <FontAwesomeIcon icon={faUpload} />
                  </span>
                  <span>Publish (encrypted)</span>
                </button>
              </div> */}
        </div>
        <div className="is-pulled-right" style={{ marginRight: "1em" }}>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Description"
              size={50}
              value={props.editors.description}
              onChange={e => dispatch(editorSetDescription(e.target.value))}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  editors: state.editors
});

export default connect(mapStateToProps)(New);
