import React from "react";
import styles from "./SkeletonLoader.module.css";

export default function SkeletonLoader() {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeletonItem}></div>
      <div className={styles.skeletonItem}></div>
      <div className={styles.skeletonItem}></div>
    </div>
  );
}
