"use client"

import Image from "next/image"
import Link from "next/link"

const Header = () => {
  return (
    <div className="navbar">
      <div className="navbar-start">
        <ul className="menu menu-horizontal nav-bar-button flex gap-[32px]">
          <li className="-mx-4">
            <Link href="/">
              <div className="flex items-center gap-1">
                <Image
                  alt="aoscan"
                  width={20}
                  height={20}
                  src="/aoscan.svg"
                  className="inline-block h-[20px]"
                />
                <Image
                  alt="ao"
                  width={20}
                  height={20}
                  src="/ao.svg"
                  className="inline-block h-[20px]"
                />
              </div>
            </Link>
          </li>
          <li>
            <Link href="/">Scan</Link>
          </li>
          <li>
            <a>Spec</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <a className="nav-bar-button btn-ghost btn">Try it now</a>
      </div>
    </div>
  )
}

export default Header
