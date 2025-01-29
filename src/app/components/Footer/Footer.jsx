"use client";

import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";

/**
 * @component
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <p>
        Derechos reservados &copy; {currentYear} |
        <Link
          href="https://jairocolon.com"
          target="_blank"
          rel="norreperer"
          className={styles.jairoColonLink}
        >
          JAIRO COLÓN Web Seveloper
        </Link>
      </p>
    </footer>
  );
}
