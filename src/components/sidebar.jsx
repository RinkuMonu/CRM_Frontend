import { useSelector } from "react-redux";
import Admin from "./Navigation/Admin";
import Leader from "./Navigation/Leader";
import Employee from "./Navigation/Employee";
import { useEffect, useState } from "react";

const SideBar = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.authSlice);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);

  // detect screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 991;
      setIsMobile(mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 40,
          }}
        ></div>
      )}

      {/* Sidebar */}
      <div className="main-sidebar">

        <aside
          style={{
            position: isMobile ? "fixed" : "relative",
            top: 0,
            left: 0,
            height: "100vh",
            width: "260px",
            background: "#fff",
            borderRight: "1px dashed #ddd9d9",
            zIndex: 50,
            boxShadow: isMobile ? "2px 0 10px rgba(0,0,0,0.3)" : "none",
            transform: isMobile
              ? isOpen
                ? "translateX(0)"
                : "translateX(-100%)"
              : "translateX(0)",
            transition: "transform 0.3s ease-in-out",
            zIndex: 999,
            // zIndex: isMobile ? 50 : 1,
            // padding: isMobile ? "10px" : "24px",÷
          }}
        >
          {/* Close button for Mobile */}
          {isMobile && (
            <div style={{ display: "flex", justifyContent: "flex-end", }}>
              <button
                onClick={onClose}
                style={{
                  border: "none",
                  color: "#dc3545",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  background: "transparent",
                  cursor: "pointer",
                  position: "absolute",
                  top: "25px",
                  fontWeight: "600",
                  fontSize: "20px",
                  background: "#fff",
                  borderRadius: "10px",
                  right: "15px",
                }}
              >
                <i class="bi bi-x-lg"></i>            </button>
            </div>
          )}

          {/* Role-based Sidebar */}
          {user?.user?.type === "Admin" ? (
            <Admin />
          ) : user?.user?.type === "Leader" ? (
            <Leader />
          ) : (
            <Employee />
          )}
        </aside>
      </div>

    </>
  );
};

export default SideBar;

