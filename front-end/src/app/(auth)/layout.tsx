// Route group "(auth)": de haakjes zorgen dat de map NIET in de URL komt
// (/login en /register blijven gewoon /login en /register), maar de pagina's
// delen wel deze layout: een smalle kolom voor formulieren.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <div className="max-w-md">{children}</div>;
}
