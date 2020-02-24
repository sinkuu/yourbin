import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { getIpfs, ipfsCat } from "../../ipfs";

function Item(props: {
  name: string;
  description: string;
  ipfsPath: string;
  files: [string];
}) {
  const { name, description, ipfsPath, files } = props;

  return (
    <div className="container">
      <div className="card">
        <div className="card-content">
          <p className="is-size-5">
            {description}
            &nbsp;-&nbsp;
            <time>
              <NavLink to={"/view" + ipfsPath}>
                {new Date(parseInt(name, 10)).toLocaleString()}
              </NavLink>
            </time>
          </p>
          <p>
            {files.map(e => (
              <span className="tag" key={e}>
                {e}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Yours(props: any) {
  const [state, setState] = useState<{ num_files: number; items: any[] }>({
    num_files: 0,
    items: []
  });

  const PerPage = 10;
  let { page } = useParams();
  const pagei = parseInt(page || "1", 10) - 1;

  console.log(pagei);

  useEffect(() => {
    const getList = async () => {
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
      setState({ num_files, items });
    };
    getList();
  }, [pagei]);

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
      <section className="section">
        {state.items.map(item => (
          <Item
            key={item.ipfsPath + item.name}
            name={item.name}
            description={item.description}
            ipfsPath={item.ipfsPath}
            files={item.files}
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
