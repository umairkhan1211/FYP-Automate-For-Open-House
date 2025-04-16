import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

function Layout({ children, setRole, token }) {
  const [showFooter, setShowFooter] = useState(true); // Footer visible by default

  useEffect(() => {
    if (token) {
      setShowFooter(false); // Token miltay hi footer hide kar do
    } else {
      setShowFooter(true); // Agar token na ho toh footer wapis show ho
    }
  }, [token]);

  return (
    <>
      <Header setRole={setRole} token={token} />
      <main>{children}</main>
      {!token && <Footer />} {/* Footer tabhi dikhao jab token na ho */}
    </>
  );
}

export default Layout;
