import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/router'
import Image from "next/image";

import styles from '../styles/Header.module.css'

export default () => {
    const [openNavbar, setOpenNavbar] = useState(false)
    const handleOpenNavbar = () => {
        setOpenNavbar(!openNavbar)
    }
    const {pathname} = useRouter()
    return (
        <>
            { openNavbar && <div className={styles.navbar}>
                <ul>
                    <li>
                        <Link href="/">
                            <a>
                                Vacunación
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/covid">
                            <a>
                                Reportes sobre el Covid
                            </a>
                        </Link>
                    </li>
                </ul>
            </div>}
            <div className={styles.navbarDesktop}>
                <div className={styles.imageNavbar}>
                    <Link href="/">
                        <a>
                            <Image
                                src="/map.png"
                                width={60}
                                height={60}
                            />
                        </a>
                    </Link>
                </div>
                <ul>
                    <li className={pathname=="/"?styles.active:""}>
                        <Link href="/">
                            <a>
                                Vacunación
                            </a>
                        </Link>
                    </li>
                    <li className={pathname=="/covid"?styles.active:""}>
                        <Link href="/covid">
                            <a>
                                Reportes sobre el Covid
                            </a>
                        </Link>
                    </li>
                </ul>
            </div>
            <a className={styles.buttonShare}
                target="__blank"
                href="https://twitter.com/intent/tweet?text=Progreso%20de%20la%20Vacunaci&#243;n%20COVID-19%20en%20Perú.%20https://covidvacunaperu.app">
                <span>Compartir</span>
                <svg className="u01-dtc-react__twitter-logo-icon twtr-icon" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" opacity="0"></path><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" fill="#1D9BF0"></path></svg>
            </a>
            <div
                onClick={handleOpenNavbar} 
                className={styles.main__burger}
            >
                <span className={openNavbar?styles.close:""}></span>
            </div>
        </>
    )
}