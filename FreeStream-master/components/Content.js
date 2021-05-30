import styles from "~/components/Content.module.scss";

import * as React from "react";
import * as U from "~/common/utilities";

import Input from "~/components/Input";
import Button from "~/components/Button";

export default function Content(props) {
  let selectedBucket;
  if (props.state.buckets && props.state.buckets.length) {
    selectedBucket =
      props.state.buckets &&
      props.state.buckets.find((b) => b.key === props.state.selectedBucketKey);
  }

  return (
    <div className={styles.content}>
      {U.isEmpty(props.state.key) ? (
        <React.Fragment>
          <h2>Access your stored information and upload new information</h2>
          <p>
            Import a private key or generate a new one to use this feature.
          </p>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <h2>Textile Buckets and Threads</h2>
          <p>View all your uploaded data, supported through Textile buckets.</p>
          <br />
          <table className={styles.table}>
            <tbody>
              <tr className={styles.row}>
                <th className={styles.heading}>Filename</th>
                <th className={styles.heading}>Size</th>
                <th className={styles.heading}>Number</th>
              </tr>
              {props.state.buckets &&
                props.state.buckets.map((b) => {
                  const url = `${props.gateway}${b.path}`;
                  return (
                    <tr key={b.path} className={styles.row}>
                      <td className={styles.cell}>
                        <span
                          className={styles.action}
                          onClick={() => props.onSelectBucket({ bucketKey: b.key })}
                        >
                          {b.name}
                        </span>{" "}
                        <span
                          className={styles.secondary}
                          onClick={() =>
                            props.onGetArchivesForBucket({
                              bucketKey: b.key,
                              bucketName: b.name,
                            })
                          }
                        >
                          Use Filecoin!
                        </span>
                      </td>
                      <td className={styles.cell}>{U.bytesToSize(b.bucketSize)}</td>
                      <td className={styles.cell}>{b.items.length}</td>
                      <td className={styles.cell}>
                        <a href={url} target="_blank">
                          href:{b.cid}
                        </a>{" "}
                        {b.name !== "data" ? (
                          <span
                            className={styles.secondary}
                            onClick={() =>
                              props.onDeleteBucket({ bucketName: b.name, bucketKey: b.key })
                            }
                          >
                            (delete)
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          <div className={styles.actions}>
            <Button
              loading={props.state.loading}
              onClick={props.onListBuckets}
              style={{ marginRight: 16 }}
            >
              Refresh
            </Button>
            <Button onClick={props.onCreateBucket} loading={props.state.loading}>
              Create
            </Button>
          </div>
        </React.Fragment>
      )}

      {selectedBucket && (
        <React.Fragment>
          <h2 style={{ marginTop: 48 }}>Threads and Links/{selectedBucket.name}</h2>
          <p>
            <a className = {styles.button}
              href={`https://ipfs.io/ipfs/${selectedBucket.cid}`}
              target="_blank"
            >Your Uploaded Files on IPFS</a>
          </p>
          <br />
          <table className={styles.table}>
            <tbody>
              <tr className={styles.row}>
                <th className={styles.heading}>Name</th>
                <th className={styles.heading}>Size</th>
                <th className={styles.heading}>CID</th>
              </tr>
              {selectedBucket.items.map((i) => {
                const url = `${props.gateway}${i.path}`;
                return (
                  <tr key={i.path} className={styles.row}>
                    <td className={styles.cell}>{i.name}</td>
                    <td className={styles.cell}>{U.bytesToSize(i.size)}</td>
                    <td className={styles.cell}>
                      <a href={url} target="_blank">
                        {i.cid}
                      </a>{" "}
                      {i.name !== ".textileseed" ? (
                        <span className={styles.action} onClick={() => window.alert("coming soon")}>
                          (delete)
                        </span>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className={styles.actions}>
            <Button
              loading={props.state.loading}
              htmlFor="file"
              type="label"
              style={{ marginRight: 16 }}
            >
              Add File
            </Button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
