// @flow
import fetch from "cross-fetch";
import {decode as base64Decode} from "base-64";

import {Ledger} from "../../core/ledger/ledger";
import type {GithubToken} from "../../plugins/github/token";
import {
  type RepoIdString,
  type RepoId,
  stringToRepoId,
} from "../../plugins/github/repoId";
import type {LedgerStorage} from "../ledgerManager";

const GET_LEDGER_QUERY = `
query getLedger($owner: String!, $repo: String!, $expression:String!) {
  repository(owner: $owner, name: $repo) {
    object(expression: $expression) {
      ... on Blob {
        oid
      }
    }
  }
}
`;

type CreateBlobRes = {
  sha: string,
  url: string,
};

type Opts = {
  apiToken: GithubToken,
  repo: RepoIdString,
  branch: string,
};

export class GithubStorage implements LedgerStorage {
  static ENDPOINT: string = "https://api.github.com";

  constructor(opts: Opts) {
    this._token = opts.apiToken;
    this._repoId = stringToRepoId(opts.repo);
    this._branch = opts.branch;
  }

  _token: GithubToken;
  _repoId: RepoId;
  _branch: string;

  _getRepoEndpoint(): string {
    const {owner, name} = this._repoId;
    return `${GithubStorage.ENDPOINT}/repos/${owner}/${name}`;
  }

  async read(): Promise<Ledger> {
    const opts = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this._token}`,
      },
      body: JSON.stringify({
        query: GET_LEDGER_QUERY,
        variables: {
          owner: this._repoId.owner,
          repo: this._repoId.name,
          expression: `${this._branch}:data/ledger.json`,
        },
      }),
    };

    const res = await fetch(`${GithubStorage.ENDPOINT}/graphql`, opts);

    const {data} = await res.json();
    const blobSha = data.repository.object.oid;

    const ledgerBlobRes = await fetch(
      `${this._getRepoEndpoint()}/git/blobs/${blobSha}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this._token}`,
        },
      }
    );
    const ledgerDataBase64 = await ledgerBlobRes.json();

    const rawLedger = base64Decode(ledgerDataBase64.content);

    return Ledger.parse(rawLedger);
  }

  async write(ledger: Ledger) {
    const ledgerData = ledger.serialize();

    // Get latest commit hash of target branch
    const refRes = await fetch(
      `${this._getRepoEndpoint()}/git/ref/heads/${this._branch}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this._token}`,
        },
      }
    );

    const refResJson = await refRes.json();
    const baseCommit = refResJson.object.sha;

    // Create a new tree from the latest commit and update the ledger blob
    const ledgerBlobRes = await fetch(`${this._getRepoEndpoint()}/git/trees`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this._token}`,
      },
      body: JSON.stringify({
        tree: [
          {
            content: ledgerData,
            type: "blob",
            path: "data/ledger.json",
            mode: "100644", // see https://docs.github.com/en/rest/reference/git#create-a-tree
          },
        ],
        base_tree: baseCommit,
      }),
    });

    const blobResJson: CreateBlobRes = await ledgerBlobRes.json();

    // Create a commit with the new tree on top of the target branch
    const commitRes = await fetch(`${this._getRepoEndpoint()}/git/commits`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this._token}`,
      },
      body: JSON.stringify({
        message: "Ledger Update",
        tree: blobResJson.sha,
        parents: [baseCommit],
        author: {
          name: "credbot",
          email: "credbot@users.noreply.github.com",
        },
      }),
    });
    const commitResJson = await commitRes.json();

    // Update the target branch to point to the new commit
    const updateRefRes = await fetch(
      `${this._getRepoEndpoint()}/git/refs/heads/${this._branch}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this._token}`,
        },
        body: JSON.stringify({
          sha: commitResJson.sha,
        }),
      }
    );
    await updateRefRes.json();
  }
}
