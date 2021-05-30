import styles from "~/components/App.module.scss";
import pkg from "~/package.json";

import * as React from "react";

export default function App(props) {
  return (
    <React.Fragment>
      <div className={styles.top}>
        <h2>FreeStream Record Upload</h2>

        {props.topRight}
      </div>
      <div className = {styles.app}> <a className={styles.button} href = "https://hub.textile.io/thread/bafkq3kykyfrzes3ffuz6bwo5u4i6ugmwjwgh52d62wrbmt7j5fecvti/buckets/bafzbeifklpgpc6pqqpfsotbvi5ehls5yfnmzpn5xjxx54dpbn7srlgfs54/test.html?token=eyJhbGciOiJFZDI1NTE5IiwidHlwIjoiSldUIn0.eyJpYXQiOjE2MjIyMjE1MDcsImlzcyI6ImJiYWFyZWlnd2pvYXd1ZWc1a3ZobWMzNjI3Z3Zja2htZTd6emZlbnVqYXVqcHRodGd6Y21odHRvYTZ1Iiwic3ViIjoiYmJhYXJlaWR4M25udTNnM3JnYXdjYWJ1bmc0M3ppc3d0N213ZnRueHMyNGhidXZlam5saGJ5aHJsNGkifQ.y9qCa1JpvCise15G6CXN5wvSo93F6zkhSqzSujw6YO_YRTHwLXmzGRcq75rOI8qb4_LMwLVF6lMgpaV5sAVyAQ">Learn More</a>
      <p>Don't believe us? Check out our code!
      <a className = {styles.button} href="https://github.com/application-research/next-daemon-bucket" target="_blank">
        Github Repository
      </a>
      </p>
      </div>
      <div className={styles.app}>
        <div className={styles.left}>{props.sidebar}</div>
        <div className={styles.middle}>{props.children}</div>
        {props.right ? <div className={styles.right}>{props.right}</div> : null}
      </div>
    </React.Fragment>
  );
}
