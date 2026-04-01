import Navbar from "../../components/navbar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="min-h-screen bg-slate-950">
        <Navbar></Navbar>
        <div className="pb-24">
            {children}
        </div>
    </div>
  );
}
