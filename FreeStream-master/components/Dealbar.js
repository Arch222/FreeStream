import styles from "~/components/Dealbar.module.scss";

import * as React from "react";
import * as UTILITIES_MAIN from "~/common/utilities";

import Input from "~/components/Input";
import Button from "~/components/Button";
import LoaderSpinner from "~/components/LoaderSpinner";

const DealCard = (props) => {
  const classNames = UTILITIES_MAIN.classNames(styles.card, props.status === 5 ? styles.success : null);

  return (
    <div className={classNames}>
      <p className={styles.detail}>
        <strong>
          {props.tag} {UTILITIES_MAIN.toDate(props.createdAt)}
        </strong>
      </p>
      {!UTILITIES_MAIN.isEmpty(props.failureMsg) ? (
        <p className={styles.error}>failureMsg: {props.failureMsg}</p>
      ) : (
        <p className={styles.detail}>
          {props.status !== 5 ? (
            <strong>this deal has a chance of succeeding! ask the miner for log reports.</strong>
          ) : (
            <strong>SUCCESS! This CID is stored on the Filecoin network.</strong>
          )}
        </p>
      )}
      <p className={styles.detail}>aborted: {String(props.aborted)}</p>
      <p className={styles.detail}>archiveStatus: {props.archiveStatus}</p>
      <p className={styles.detail}>jobId: {props.jobId}</p>
      <p className={styles.detail}>status: {props.status}</p>
    </div>
  );
};

export default function Dealbar(props) {
  const [formState, setFormState] = React.useState({
    miner: "",
    repFactor: 4,
    dealMinDuration: 525600,
    maxPrice: 0,
  });

  if (props.state.loading) {
    return (
      <div className={styles.sidebar}>
        <LoaderSpinner style={{ height: 48, width: 48 }} />
      </div>
    );
  }

  return (
    <React.Fragment>
      {!props.archives ? (
        <div className={styles.sidebar}>
          <h2>Make a storage to get access to Filecoin's storage capabilities</h2>
          <p>Choose a bucket to begin</p>
        </div>
      ) : (
        <React.Fragment>
          <div className={styles.sidebar}>
            <h2>Get access to Filecoin!</h2>
            <p> Your chosen bucket is {props.archives.bucketName}. Use your filecoin address to continue.</p>

            <p style={{ marginTop: 10 }}>
              <strong>Choose a specific miner for this deal</strong>
            </p>
            <p>
              Enter the address of a specific miner to connect with for the storage deal. If you need a refresher on how storage deals work, go <a href = "https://filecoin.io/blog/posts/how-storage-and-retrieval-deals-work-on-filecoin/">here</a>.
            </p>
            <Input
              name="miner"
              type="text"
              value={formState.miner}
              style={{ marginTop: 16 }}
              placeholder="Minerid"
              onChange={(e) => {
                setFormState({ ...formState, [e.target.name]: e.target.value });
              }}
            />

            <p style={{ marginTop: 24 }}>
              <strong>Filecoin Availiblity</strong>
            </p>
            <p>How many miners do you want this deal to reach?</p>
            <Input
              name="repFactor"
              type="number"
              value={formState.repFactor}
              style={{ marginTop: 16 }}
              placeholder="Type in amount of miners"
              onChange={(e) => {
                setFormState({ ...formState, [e.target.name]: e.target.value });
              }}
            />

            <p style={{ marginTop: 24 }}>
              <strong>This is how long your deal will remain in the Filecoin network.</strong>
            </p>
            <p>Your deal will last {formState.dealMinDuration / 2880} days</p>
            <Input
              name="dealMinDuration"
              type="number"
              unit="epochs"
              style={{ marginTop: 16 }}
              value={formState.dealMinDuration}
              placeholder="Type in epochs (1 epoch = ~30 seconds)"
              onChange={(e) => {
                setFormState({ ...formState, [e.target.name]: e.target.value });
              }}
            />

            <p style={{ marginTop: 24 }}>
              <strong>Stake</strong>
            </p>
            <p>
              Set a stake for the deal: {UTILITIES_MAIN.inFIL(formState.maxPrice)}.
            </p>
            <Input
              unit="attoFIL"
              type="number"
              name="maxPrice"
              style={{ marginTop: 16 }}
              value={formState.maxPrice}
              placeholder="Type in amount of Filecoin (attoFIL)"
              onChange={(e) => {
                setFormState({ ...formState, [e.target.name]: e.target.value });
              }}
            />

            <div className={styles.actions}>
              <Button
                loading={props.state.loading}
                onClick={() => {
                  props.onMakeDeal({
                    bucketKey: props.archives.bucketKey,
                    bucketName: props.archives.bucketName,
                    settings: {
                      addr:
                        props.state.addresses && props.state.addresses[0]
                          ? props.state.addresses[0].address
                          : null,
                      excludedMiners: [],
                      trustedMiners: [formState.miner],
                      repFactor: formState.repFactor,
                      dealMinDuration: formState.dealMinDuration,
                      countryCodes: [],
                      maxPrice: formState.maxPrice,
                      renew: null,
                      fastRetrieval: true,
                      dealStartOffset: 8640,
                    },
                  });
                }}
              >
                Make Filecoin storage deal
              </Button>
            </div>
          </div>
        </React.Fragment>
      )}
      {!props.archives ? (
        <div className={styles.bottom}>
          <h2 style={{ marginTop: 12 }}>Previous Deals</h2>
          <p>Select a bucket to get Filecoin storage history.</p>
        </div>
      ) : (
        <div className={styles.bottom}>
          <h2 style={{ marginTop: 12 }}>Deal history for {props.archives.bucketName}</h2>
          <p>Current deals in queue and history of deals.</p>

          {props.archives.current ? (
            <DealCard {...props.archives.current} tag="[ Current ]" />
          ) : (
            <p style={{ marginTop: 12 }}>No Deals currently in progress</p>
          )}

          {props.archives.history.map((h) => {
            return <DealCard {...h} tag="[ History ]" />;
          })}
        </div>
      )}
    </React.Fragment>
  );
}
