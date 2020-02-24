import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getIpfs, ipfsCat } from "../../ipfs";

function Item(props: { name: string; ipfsPath: string; files: [string] }) {
  const { name, ipfsPath, files } = props;

  return (
    <div className="container">
      <div className="card">
        <div className="card-content">
          <p className="is-size-5">
            <NavLink to={"/view" + ipfsPath}>
              {new Date(parseInt(name, 10)).toLocaleString()}
            </NavLink>
          </p>
          <p>
            {files.map(e => (
              <span className="tag" key="{e}">
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
  const [state, setState] = useState<{ items: any[] }>({ items: [] });
  useEffect(() => {
    const getList = async () => {
      const ipfs = await getIpfs();
      const files = await ipfs.files.ls("/yours", { sort: true });
      files.reverse();
      const cid = (await ipfs.files.stat("/yours")).hash;

      let items = [];
      for (const f of files) {
        const filesinfo = JSON.parse(await ipfsCat(
          ipfs,
          "/ipfs/" + cid + "/" + f.name + "/.yourbin.json"
        ));

        const fcid = (await ipfs.files.stat("/yours/" + f.name)).hash;

        items.push({
          name: f.name,
          ipfsPath: "/ipfs/" + fcid,
          files: Object.values(filesinfo.files).map((v: any) => v.filename)
        });
      }

      console.log(items);

      setState({ items });
    };
    getList();
  }, []);

  return (
    <section className="section">
      {state.items.map((item) => <Item name={item.name} ipfsPath={item.ipfsPath} files={item.files} />)}
    </section>
  );
}
