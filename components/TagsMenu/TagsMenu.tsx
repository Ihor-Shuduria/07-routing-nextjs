"use client";

import { useState } from "react";
import css from "./TagsMenu.module.css";
import { tagsList } from "@/types/note";

function TagsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className={css.menuContainer}>
      <button className={css.menuButton} onClick={toggle}>
        Notes ▾
      </button>
      {isOpen && (
        <ul className={css.menuList}>
          {tagsList.map((tag) => (
            <li className={css.menuItem} key={tag}>
              <a href={`/notes/filter/${tag}`} className={css.menuLink}>
                {tag}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TagsMenu;
