import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import CodeMirror from "codemirror";
import "codemirror/addon/runmode";
import BufferList from "bl";

// https://blog.inkdrop.info/making-a-syntax-highlighter-using-codemirror-for-reactjs-b8169038432a
const Highlight = (props: any) => {
  const { type, content } = props;

  const elements: any[] = [];
  let index = 0;
  const pushElement = (token: string, style: string) => {
    elements.push(
      <span className={style || ""} key={++index}>
        {token}
      </span>
    );
  };
  // @ts-ignore
  CodeMirror.runMode(content, type, pushElement);

  return (
    <code>
      <pre>{elements}</pre>
    </code>
  );
};

const ViewPaste = (props: any) => {
  const { ipfsPath } = props;

  const [state, setState] = useState({ fileinfos: null });

  useEffect(() => {
    const getFileInfos = async () => {
      if (window.ipfs && window.ipfs.enable) {
        const ipfs = await window.ipfs.enable({ commands: ["get"] });

        const getResult = await ipfs.get(ipfsPath + "/.yourbin.js");
        const content = new BufferList();
        for await (const chunk of getResult.content) {
          content.append(chunk);
        }
        const fileinfos = JSON.parse(content.toString());

        setState({ fileinfos });
      }
    };

    getFileInfos();
  }, [ipfsPath]);

  return <div></div>;
};

export default connect()(ViewPaste);
