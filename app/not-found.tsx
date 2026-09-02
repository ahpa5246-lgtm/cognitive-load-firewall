import Link from "next/link";
export default function NotFound() { return <main className="app-shell"><section className="narrow"><div className="eyebrow">Not found</div><h1>This page is not here.</h1><p className="lede">The workspace is still available, with your guest preferences kept in this browser.</p><Link className="primary" href="/dashboard">Open workspace</Link></section></main>; }
