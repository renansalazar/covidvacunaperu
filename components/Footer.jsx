import styles from "../styles/Footer.module.css";

export default () => {
    return (
        <footer className={styles.footer}>
            <a href="https://github.com/renansalazar" target="_blank">
            Desarrollado por Renan Salazar
            </a>
            <span>•</span>
            <a
            href="https://github.com/renansalazar/covidvacunaperu"
            target="_blank"
            >
            Github
            </a>
        </footer>
    )
}