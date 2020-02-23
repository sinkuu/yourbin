import CodeMirror from "codemirror";
import "codemirror/addon/runmode/runmode";
import React from "react";
import "codemirror/lib/codemirror.css";

// https://blog.inkdrop.info/making-a-syntax-highlighter-using-codemirror-for-reactjs-b8169038432a
const Highlight = (props: any) => {
  const { type, content } = props;

  const elements: any[] = [];
  let index = 0;
  const pushElement = (token: string, style: string) => {
    elements.push(
      <span className={style ? ("cm-" + style) : ""} key={++index}>
        {token}
      </span>
    );
  };
  // @ts-ignore
  CodeMirror.runMode(content, type, pushElement);

  return (
    <code>
      <pre className="cm-s-default">{elements}</pre>
    </code>
  );
};

export default function ViewFile(props: any) {
  const contentView = props.loading ? (
    "Loading..."
  ) : (
    <Highlight type={props.type} content={props.content} />
  );
  return (
    <section className="section">
      <div className="container">
        <div className="card">
          <div className="card-header">
            <p className="card-header-title">{props.filename}</p>
          </div>
          <div className="card-content">
            <div className="content">{contentView}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
