let instance: any = null;

export async function getIpfs() {
  if (instance) return instance;

  if (window.ipfs && window.ipfs.enable) {
    instance = await window.ipfs.enable({ commands: ["add", "get", "cat"] });
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
  [id: string]: {
    filename: string;
    type: string;
  };
}