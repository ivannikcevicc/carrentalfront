"use client";

import { useEffect, ReactNode } from "react";

interface AdminLTEProviderProps {
  children: ReactNode;
}

const AdminLTEProvider: React.FC<AdminLTEProviderProps> = ({ children }) => {
  useEffect(() => {
    const jqueryScript = document.createElement("script");
    jqueryScript.src = "https://code.jquery.com/jquery-3.6.0.min.js";
    jqueryScript.async = true;
    document.body.appendChild(jqueryScript);

    const adminlteScript = document.createElement("script");
    adminlteScript.src =
      "https://cdn.jsdelivr.net/npm/admin-lte@3.1/dist/js/adminlte.min.js";
    adminlteScript.async = true;

    jqueryScript.onload = () => {
      document.body.appendChild(adminlteScript);
    };

    const adminlteCss = document.createElement("link");
    adminlteCss.rel = "stylesheet";
    adminlteCss.href =
      "https://cdn.jsdelivr.net/npm/admin-lte@3.1/dist/css/adminlte.min.css";
    adminlteCss.type = "text/css";
    document.head.appendChild(adminlteCss);

    return () => {
      if (document.body.contains(jqueryScript)) {
        document.body.removeChild(jqueryScript);
      }
      if (document.body.contains(adminlteScript)) {
        document.body.removeChild(adminlteScript);
      }
      if (document.head.contains(adminlteCss)) {
        document.head.removeChild(adminlteCss);
      }
    };
  }, []);

  return <>{children}</>;
};

export default AdminLTEProvider;
