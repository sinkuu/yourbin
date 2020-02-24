let instance: any = null;

export async function getIpfs() {
  if (instance) return instance;

  if (window.ipfs && window.ipfs.enable) {
    instance = await window.ipfs.enable({
      commands: [
        "add",
        "files.add",
        "files.cat",
        "files.cp",
        "files.get",
        "files.ls",
        "files.mkdir",
        "files.rm",
        "files.stat"
      ]
    });
    return instance;
  } else {
    return null;
  }
}

export async function ipfsCat(ipfs: any, path: string): Promise<string> {
  const content = [];
  for await (const chunk of await ipfs.cat(path)) {
    content.push(chunk);
  }
  return Buffer.from(content).toString();
}

export interface FilesInfo {
  description: string;
  files: {
    filename: string;
    type: string;
  }[];
}
