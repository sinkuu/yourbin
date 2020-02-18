import React from "react";
import { connect } from "react-redux";
import File from "../File";
import { State, Editors, EditorState } from "../../state";
import { editorAdd, editorDiscardAll } from "../../action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUpload } from "@fortawesome/free-solid-svg-icons";

declare global {
  interface Window {
    ipfs: WindowIpfs;
  }
  interface WindowIpfs {
    enable: (options: any) => Promise<any>;
  }
}

const New = (props: { dispatch: (action: any) => void; editors: Editors }) => {
  let editors = Object.entries(props.editors.states).map(
    ([i, e]: [string, EditorState]) => {
      return (
        <section key={i} className="section">
          <div className="container">
            <File id={i} editor={e} />
          </div>
        </section>
      );
    }
  );

  const addNew = () => {
    props.dispatch(editorAdd());
  };

  const publish = async () => {
    const editors = Object.entries(props.editors.states);
    props.dispatch(editorDiscardAll());
    editors.sort(([k1, _v1], [k2, _v2]) => parseInt(k1, 10) - parseInt(k2, 10));

    const files: any[] = editors.map(([id, e]: [string, EditorState]) => ({
      path: "/" + (e.filename ? e.filename : id),
      content: e.content,
      mtime: { secs: new Date().getTime() }
    }));

    let filesinfo = editors.reduce(
      (o, [id, editor]) => ({
        ...o,
        [id]: {
          filename: editor.filename,
          type: editor.type
        }
      }),
      {}
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

      console.log(result);
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
            <div className="columns">
              <div className="column">
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
