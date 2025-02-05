import Link from "next/link";
import "./nav-bar.scss"

type Navigation = {
    title: string;
    href: string;
}

export default function Navbar() {

    const nav: Navigation[] = [
        { title: "Domov", href: "/" },
        { title: "Dashboard", href: "/dashboard" },
        { title: "Generator", href: "/invoice-generator" }
    ]

    return <nav>
        <ul className="nav">
            {nav.map((x) => (<li className="nav-link" key={x.title}><Link href={x.href}>{x.title}</Link> </li>))}
        </ul>
    </nav>
}