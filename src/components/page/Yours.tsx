import React, { useEffect, useState, useCallback } from "react";
import { NavLink, useParams } from "react-router-dom";
import { getIpfs, ipfsCat } from "../../ipfs";
import { setErrorMessage } from "../../action";
import { connect } from "react-redux";
const classNames = require("classnames");

function Item(props: {
  name: string;
  description: string;
  ipfsPath: string;
  files: [string];
  onRemove: (name: string) => void;
}) {
  const { name, description, ipfsPath, files, onRemove } = props;

  return (
    <div className="container">
      <div className="card">
        <div className="card-content">
          <nav className="level">
            <div className="level-left">
              <div className="level-item is-size-5">
                {description}
                &nbsp;-&nbsp;
                <time>
                  <NavLink to={"/view" + ipfsPath}>
                    {new Date(parseInt(name, 10)).toLocaleString()}
                  </NavLink>
                </time>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <button
                  className="delete is-pulled-right"
                  onClick={() => {
                    if (
                      window.confirm("Do you really want to remove this item?")
                    ) {
                      onRemove(name);
                    }
                  }}
                ></button>
              </div>
            </div>
          </nav>

          {files.length === 1 && files[0] === "0.txt" ? (
            []
          ) : (
            <p>
              {files.map(e => (
                <span className="tag" key={e}>
                  {e}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Yours(props: { dispatch: (action: any) => void }) {
  const [state, setState] = useState<{
    num_files: number;
    load_done: boolean;
    items: any[];
  }>({
    num_files: 0,
    load_done: false,
    items: []
  });
  console.log(state);

  const PerPage = 10;
  let { page } = useParams();
  const pagei = parseInt(page || "1", 10) - 1;

  console.log(pagei);

  const { dispatch } = props;

  useEffect(() => {
    const getList = async () => {
      setState(s => ({
        ...s,
        load_done: false
      }));

      const ipfs = await getIpfs();
      let files: any[] = await ipfs.files.ls("/yours", { sort: true });
      files.reverse();
      const cid = (await ipfs.files.stat("/yours")).hash;

      const num_files = files.length;

      if (num_files > PerPage) {
        files = files.slice(PerPage * pagei, PerPage * (pagei + 1));
      }

      let items = [];
      for (const f of files) {
        const filesinfo = JSON.parse(
          await ipfsCat(ipfs, "/ipfs/" + cid + "/" + f.name + "/.yourbin.json")
        );

        const fcid = (await ipfs.files.stat("/yours/" + f.name)).hash;

        items.push({
          name: f.name,
          description: filesinfo.description,
          ipfsPath: "/ipfs/" + fcid,
          files: Object.values(filesinfo.files).map((v: any) => v.filename)
        });
      }
      console.log(items);
      setState({ num_files, load_done: true, items });
    };
    getList().catch((error: any) => {
      console.log(error);
      let errorStr = error.toString();
      if (errorStr !== "Error: file does not exist") {
        dispatch(setErrorMessage(error.toString()));
      }
      setState(s => ({ ...s, load_done: true }));
    });
  }, [pagei, dispatch]);

  const onRemove = useCallback(name => {
    const remove = async () => {
      const ipfs = await getIpfs();
      await ipfs.files.rm("/yours/" + name, { recursive: true });
      window.location.reload();
    };
    remove();
  }, []);

  let pageLinks = [];

  for (let i = 1; i <= Math.ceil(state.num_files / PerPage); i++) {
    pageLinks.push(
      <li key={i}>
        <NavLink
          className={"pagination-link" + (i === pagei + 1 ? " is-current" : "")}
          to={"/yours/" + i}
        >
          {i}
        </NavLink>
      </li>
    );
  }

  return (
    <div>
      <div className="container">
        <progress
          className={classNames("progress", "is-small", "is-info", {
            "is-hidden": state.load_done
          })}
        >
          Loading
        </progress>
      </div>

      <div
        className={classNames("container", {
          "is-hidden": !state.load_done || state.num_files !== 0
        })}
      >
        <div className="notification">No pastes found.</div>
      </div>
      <section className="section">
        {state.items.map(item => (
          <Item
            name={item.name}
            description={item.description}
            ipfsPath={item.ipfsPath}
            files={item.files}
            key={item.ipfsPath + item.name}
            onRemove={onRemove}
          />
        ))}
      </section>

      <div className="container">
        <nav className="pagination" role="navigation" aria-label="pagination">
          <ul className="pagination-list">{pageLinks}</ul>
        </nav>
      </div>
    </div>
  );
}

export default connect()(Yours);
