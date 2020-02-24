import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import { getIpfs, FilesInfo, ipfsCat } from "../../ipfs";
import ViewFile from "../ViewFile";
import { useParams } from "react-router-dom";

const ViewPaste = (props: any) => {
  const { path } = useParams();

  const ipfsPath = "/ipfs/" + path;

  const { dispatch } = props;

  const [state, setState] = useState<{ description: string; files: any }>({
    description: "",
    files: {}
  });

  useEffect(() => {
    const getFileInfos = async () => {
      const ipfs = await getIpfs();

      if (!ipfs) return;

      const json = await ipfsCat(ipfs, ipfsPath + "/.yourbin.json");
      console.log(json);
      const filesinfo: FilesInfo = JSON.parse(json);

      let files: any = {};
      for (const id in filesinfo.files) {
        files[id] = {
          filename: filesinfo.files[id].filename,
          type: filesinfo.files[id].type,
          loading: true,
          content: ""
        };
      }

      setState({ description: filesinfo.description, files });

      for (const entry of Object.entries(filesinfo.files)) {
        const [id, info]: [string, { filename: string; type: string }] = entry;
        console.log(info);
        const content = await ipfsCat(ipfs, ipfsPath + "/" + info.filename);
        files[id] = { ...files[id], loading: false, content };
        console.log(files);
        setState((s: any) => ({ ...s, files }));
      }
    };

    getFileInfos();
  }, [ipfsPath, dispatch]);

  const files = Object.entries(state.files).map(([id, info]: [string, any]) => {
    return (
      <ViewFile
        key={id}
        filename={info.filename}
        type={info.type}
        loading={info.loading}
        content={info.content}
      />
    );
  });

  return (
    <div>
      {state.description ? (
        <div className="container" style={{ marginTop: "1em" }}>
          {state.description}
        </div>
      ) : (
        []
      )}
      <div>{files}</div>
    </div>
  );
};

export default connect()(ViewPaste);
