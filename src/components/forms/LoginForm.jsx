import { useState } from "react";
import { doLogin } from "../../http";
import { useDispatch } from "react-redux";
import { setAuth } from "../../store/auth-slice";
import { toast } from "react-toastify";
import admin from "../../assets/demoVideo/admin.mp4";
import employee from "../../assets/demoVideo/employee.mp4";

// const DEMO_PATHS = {
//   admin: "/admin.mp4", // public/videos/admin-demo.mp4
//   employee: "/employee.mp4", // public/videos/employee-demo.mp4
// };

const LoginForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const inputEvent = (e) => {
    const { name, value } = e.target;
    setFormData((old) => ({ ...old, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) return toast.error("All Fields Required");

    const res = await doLogin({ email, password });
    // const { success } = res;

    if (res?.success) {
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("accessToken", JSON.stringify(res.accessToken));
      localStorage.setItem("refreshToken", JSON.stringify(res.refreshToken));
      dispatch(setAuth(res.user));
      toast.success("Login successful");
      window.location.reload();
    } else {
      toast.error(res?.message || "Login failed");
    }
  };

  // Open in new tab and play
  const openVideo = (path) => {
    const videoWindow = window.open("", "_blank");
    if (videoWindow) {
      videoWindow.document.write(`
        <html>
          <head>
            <title>Video Demo</title>
            <style>
              body { margin:0; background:black; display:flex; align-items:center; justify-content:center; height:100vh; }
              video { max-width:100%; max-height:100%; }
            </style>
          </head>
          <body>
            <video src="${path}" controls autoplay></video>
          </body>
        </html>
      `);
      videoWindow.document.close();
    }
  };

  return (
    <div id="app">
      <section>
        <div className="container-fluid">
          <div className="row bg-white">
            <div className="col-md-7 ps-0 rightsidelogin">
              <div className="loginimg">
                <img
                  src="./assets/icons/24148025_page_266.jpg"
                  width={"100%"}
                  style={{ padding: "90px" }}
                  alt="illustration"
                />
              </div>
            </div>

            <div className="col-md-5">
              <div
                className="loginform d-flex justify-content-center align-items-center h-100 p-6"
                style={{
                  boxShadow:
                    "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                  backgroundColor: "#fbfbfb",
                }}
              >
                <div
                  className="d-flex flex-column gap-3 w-100 p-5"
                  style={{ maxWidth: "400px" }}
                >
                  <h1>Welcome Back!</h1>
                  <p>Please sign-in to your account and start the adventure</p>

                  <form onSubmit={onSubmit} noValidate>
                    <div className="form-group mb-3">
                      <label>Email</label>
                      <input
                        onChange={inputEvent}
                        value={formData.email}
                        type="email"
                        className="form-control"
                        name="email"
                        required
                        autoFocus
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label>Password</label>
                      <input
                        onChange={inputEvent}
                        value={formData.password}
                        type="password"
                        className="form-control"
                        name="password"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100"
                    >
                      Login
                    </button>
                  </form>

                  {/* Demo buttons */}
                  <div className="mt-4">
                    <h6>Product Demo</h6>
                    <div className="row g-2 mt-2">
                      <div className="col-12 col-sm-6">
                        <button
                          type="button"
                          className="btn btn-outline-primary w-100"
                          onClick={() => openVideo(admin)}
                        >
                          🛡️ Admin Demo
                        </button>
                      </div>
                      <div className="col-12 col-sm-6">
                        <button
                          type="button"
                          className="btn btn-outline-primary w-100"
                          onClick={() => openVideo(employee)}
                        >
                          💼 Employee
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginForm;
