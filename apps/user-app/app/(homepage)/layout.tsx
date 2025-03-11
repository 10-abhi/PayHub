import Navbar from "../../components/navbar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="flex">
        <Navbar></Navbar>
            {children}
    </div>
  );
}
