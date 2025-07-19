import { Link } from "react-router-dom/cjs/react-router-dom";

const CountsCard = ({ title, count }) => {
  const getStylesByTitle = (title) => {
    const styles = {
      "Total Employees": {
        icon: "fas fa-user-tie",
        bgColor: "rgba(255, 215, 0, 0.1)",
        borderColor: "#FFD700",
        trendColor: "#4CAF50",
        href: "/employees",
        iconColor: "#FFD700",
        bgPattern:
          "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0icmdiYSgyNTUsMjE1LDAsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InJnYmEoMjU1LDIxNSwwLDAuMSkiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')",
      },
      "Team Leaders": {
        icon: "fas fa-crown",
        bgColor: "rgba(25, 118, 210, 0.1)",
        borderColor: "#1976D2",
        trendColor: "#4CAF50",
        href: "/leaders",
        iconColor: "#1976D2",
        bgPattern:
          "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0icmdiYSgyNSwxMTgsMjEwLDAuMDUpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJyZ2JhKDI1LDExOCwyMTAsMC4xKSIgZmlsbC1vcGFjaXR5PSIwLjUiLz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')",
      },
      "Total Admins": {
        icon: "fas fa-shield-alt",
        bgColor: "rgba(211, 47, 47, 0.1)",
        borderColor: "#D32F2F",
        trendColor: "#4CAF50",
        href: "/admins",
        iconColor: "#D32F2F",
        bgPattern:
          "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0icmdiYSgyMTEsNDcsNDcsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InJnYmEoMjExLDQ3LDQ3LDAuMSkiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')",
      },
      "Team Department": {
        icon: "fas fa-users",
        bgColor: "rgba(94, 53, 177, 0.1)",
        borderColor: "#5E35B1",
        trendColor: "#4CAF50",
        href: "/teams",
        iconColor: "#5E35B1",
        bgPattern:
          "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0icmdiYSg5NCw1MywxNzcsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InJnYmEoOTQsNTMsMTc3LDAuMSkiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')",
      },
      default: {
        icon: "fas fa-question-circle",
        bgColor: "rgba(108, 117, 125, 0.1)",
        borderColor: "#6C757D",
        trendColor: "#4CAF50",
        iconColor: "#6C757D",
        bgPattern: "none",
      },
    };

    return styles[title] || styles.default;
  };

  const { icon, bgColor, borderColor, trendColor, href, iconColor, bgPattern } =
    getStylesByTitle(title);

  return (
    <div className="mb-4 count-card">
      <div
        className="card border-0 rounded-lg overflow-hidden h-100 hover-lift position-relative"
        style={{
          transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
          borderLeft: `4px solid ${borderColor}`,
          backgroundColor: bgColor,
          backgroundImage: bgPattern,
        }}
      >
        {/* Background overlay */}
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-overlay"></div>

        <div className="card-body  position-relative z-index-1">
          {/* Decorative corner accent */}
          <div
            className="position-absolute top-0 end-0 w-0 h-0 border-t-[40px] border-l-[40px] border-t-transparent"
            style={{ borderLeftColor: borderColor }}
          ></div>

          <div className="d-flex align-items-start mb-1">
            <div
              className="rounded-lg d-flex align-items-center justify-content-center shadow-sm"
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(2px)",
                flexShrink: 0,
                border: `2px solid ${borderColor}`,
              }}
            >
              <i className={`${icon} fa-lg`} style={{ color: iconColor }}></i>
            </div>

            <div className="ms-3 flex-grow-1">
              <span className="text-uppercase tracking-wider text-muted small fw-medium letter-spacing">
                {title}
              </span>
              <h5 className="fw-bold text-dark mt-1 mb-0 display-">{count}</h5>
            </div>
            <Link
              to={href}
              className="btn btn-link p-0 text-decoration-none d-flex align-items-center hover-arrow"
              style={{ color: borderColor }}
            >
              Details
              <i
                className="fas fa-chevron-right ms-2"
                style={{ fontSize: "0.7rem" }}
              ></i>
            </Link>
          </div>

          <div className="d-flex justify-content-between align-items-center border-top border-light">
            {/* <div className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 rounded-pill px-2 py-1 d-flex align-items-center">
                <i 
                  className="fas fa-arrow-up me-1" 
                  style={{ 
                    color: trendColor, 
                    fontSize: "0.7rem" 
                  }}
                ></i>
                <span 
                  className="fw-semibold small" 
                  style={{ color: trendColor }}
                >
                  2.5%
                </span>
              </div>
              <span className="ms-2 text-muted small">
                vs last month
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountsCard;
