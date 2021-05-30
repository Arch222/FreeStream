import styles from "~/components/Sidebar.module.scss";

import * as React from "react";
import * as U from "~/common/utilities";

import Input from "~/components/Input";
import Button from "~/components/Button";

export default function Sidebar(props) {
  return (
    <div className={styles.sidebar}>
      <h3>Upload Important Files,Presentations,Videos,and Pictures to Textile for future use</h3>


        <p>
        Have access to a shared repository of important files for your viewers or co-workers.
        <br />
        <br />
        In the spirit of decentralization and content-creator independence, we do not track your personal information. All of your files will remain with your specific thread.
      </p>

      {U.isEmpty(props.state.key) ? (
        <React.Fragment>
          <h2 style={{ marginTop: 48 }}>Create or set token</h2>
          <p>
            If you already have a private key, just enter it here. To learn more about private keys on the Textile Infrastructure, click{" "}
            <a href="https://textileio.github.io/js-textile/docs/hub.privatekey" target="_blank">
          here.
            </a>{" "}
          You can also generate a brand new private key if you are new to the Textile Infrastructure.
          </p>
          <Input
            style={{ marginTop: 16 }}
            name="token"
            value={props.state.token}
            onChange={(e) => {
              return props.onChange({ ...props.state, [e.target.name]: e.target.value });
            }}
            placeholder="Your Private Key.."
          />

          <div className={styles.actions}>
            <Button
              loading={props.state.loading}
              style={{ marginRight: 10 }}
              onClick={props.onGenerateToken}
            >
              Create a New Key
            </Button>
            <Button
              loading={props.state.loading}
              onClick={() => props.onSetToken(props.state.token)}
            >
              Access
            </Button>
          </div>
        </React.Fragment>
      ) : null}

      {U.isEmpty(props.state.key) ? null : (
        <React.Fragment>
          <h2 style={{ marginTop: 48 }}>Your Private Key</h2>
          <p>
            <strong className={styles.dark}>{props.state.key}</strong>
          </p>

          {props.state.addresses && props.state.addresses.length ? (
            <React.Fragment>
              <h2 style={{ marginTop: 24 }}>Your Filecoin Address</h2>
              <p>
                <strong>{props.state.addresses[0].address}</strong>
              </p>
              <p>
                <a className = {styles.button} href="https://verify.glif.io" target="_blank">
                  Verify
                </a>
              </p>
            </React.Fragment>
          ) : null}

          {props.state.addresses && props.state.addresses.length ? (
            <React.Fragment>
              <h2 style={{ marginTop: 24 }}>Current Filecoin Balance</h2>
              <p>{U.inFIL(props.state.addresses[0].balance)}</p>
            </React.Fragment>
          ) : null}

          {props.state.addresses && props.state.addresses.length ? (
            <React.Fragment>
              <h2 style={{ marginTop: 24 }}>Address</h2>
              <p>{props.state.addresses[0].name}</p>
            </React.Fragment>
          ) : null}



          <p style={{ marginTop: 48 }}>
            You should never give your private key out freely. Doing so will allow malicious attackers to access your storage and deploy content.
          </p>
          <div className={styles.actions}>
            <Button
              onClick={() => {
                const confirm = window.confirm(
                  "Be sure to store your private key somewhere else to avoid losing access to your content!"
                );

                if (!confirm) {
                  return;
                }
                props.onChange({
                  addresses: [],
                  token: null,
                  key: null,
                  buckets: [],
                  selectedArchives: null,
                  loading: false,
                });
              }}
            >
              Delete this Private Key and refresh the application
            </Button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
