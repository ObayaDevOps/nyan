import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";
import Icon from "./Icon";
import styles from "./sidebar.module.css";
const tiny = localFont({
  src: "../fonts/tiny5-regular.ttf",
  preload: false,
  display: "swap",
});
const primaryIcons = {
  home: "BiSolidHomeAlt2",
  events: "BsFillCalendarHeartFill",
  rental: "FaBuildingCircleCheck",
};

function SidebarSection({ category, onNavigate }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className={styles.category}>
      <button
        id={`${id}-toggle`}
        className={styles.sectionToggle}
        aria-expanded={open}
        aria-controls={`${id}-content`}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name={category.iconKey} />
        {category.label}
        <span aria-hidden="true" className={styles.chevron} data-open={open}>
          ⌄
        </span>
      </button>
      <div
        id={`${id}-content`}
        className={styles.sectionContent}
        data-open={open}
        role="region"
        aria-labelledby={`${id}-toggle`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className={styles.sectionInner}>
          <div className={styles.children}>
            {category.links.map((link) => (
              <a href={link.url} key={link._key} onClick={onNavigate}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SideBar({
  navigation = { primaryLinks: [], categories: [], socialLinks: {} },
  showNavIcon = false,
}) {
  const dialog = useRef(null),
    trigger = useRef(null),
    frame = useRef(null),
    closeTimer = useRef(null),
    [open, setOpen] = useState(false),
    [entered, setEntered] = useState(false),
    [message, setMessage] = useState("");
  useEffect(() => {
    if (!open) return;
    const opener = trigger.current;
    const el = dialog.current,
      overflow = document.body.style.overflow;
    el.showModal();
    document.body.style.overflow = "hidden";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEntered(true);
    } else {
      frame.current = requestAnimationFrame(() => {
        frame.current = requestAnimationFrame(() => setEntered(true));
      });
    }
    return () => {
      cancelAnimationFrame(frame.current);
      clearTimeout(closeTimer.current);
      el.close();
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, [open]);
  const close = () => {
    cancelAnimationFrame(frame.current);
    setEntered(false);
    if (
      !entered ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setOpen(false);
    } else {
      clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(() => setOpen(false), 360);
    }
  };
  const social = navigation.socialLinks || {};
  const headerClass = `${styles.header}${showNavIcon ? "" : ` ${styles.homeHeader}`}`;
  async function copy() {
    try {
      await navigator.clipboard.writeText(social.email);
      setMessage("Email copied");
    } catch {
      setMessage("Copy unavailable. Use the email link.");
    }
  }
  return (
    <>
      <header className={headerClass}>
        <button
          ref={trigger}
          className={styles.trigger}
          aria-label="open menu"
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
        >
          <Icon width="24" height="24" />
        </button>
        {showNavIcon && (
          <Link className={styles.logo} href="/">
            <Image
              src="/neko-logo.svg"
              alt="Nekosero home"
              width={50}
              height={50}
            />
          </Link>
        )}
      </header>
      <dialog
        ref={dialog}
        className={styles.dialog}
        data-entered={entered}
        aria-label="Website menu"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClose={() => {
          setEntered(false);
          setOpen(false);
        }}
        onTransitionEnd={(event) => {
          if (
            event.target === event.currentTarget &&
            event.propertyName === "transform" &&
            !entered
          ) {
            setOpen(false);
          }
        }}
      >
        <div className={headerClass}>
          <button
            autoFocus
            className={styles.close}
            aria-label="Close menu"
            onClick={close}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <nav aria-label="Main navigation" className={styles.nav}>
          {navigation.primaryLinks.map((l) => (
            <Link
              className={styles.primary}
              href={l.url}
              key={l._key}
              onClick={close}
            >
              <Icon name={primaryIcons[l.routeKey]} />
              {l.label}
            </Link>
          ))}
          {navigation.categories.map((c) => (
            <SidebarSection key={c._key} category={c} onNavigate={close} />
          ))}
        </nav>
        <footer className={styles.footer}>
          {social.email && (
            <>
              <button onClick={copy} aria-label="Copy email">
                <Icon name="HiOutlineMail" />
              </button>
              <a className="sr-only" href={`mailto:${social.email}`}>
                Email us
              </a>
            </>
          )}
          {[
            ["instagram", "FaInstagram"],
            ["facebook", "FaFacebook"],
            ["map", "RiMapPinLine"],
          ].map(
            ([key, icon]) =>
              social[key] && (
                <a href={social[key]} key={key} aria-label={key}>
                  <Icon name={icon} />
                </a>
              ),
          )}
          <a className={styles.credit} href="https://www.twofivesix.online/">
            <span>built by</span>{" "}
            <span className={tiny.className}>twofivesix</span>
          </a>
          <span role="status" className={styles.status}>
            {message}
          </span>
        </footer>
      </dialog>
    </>
  );
}
