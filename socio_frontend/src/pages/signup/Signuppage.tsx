import { NavLink } from "react-router";
import { endpoints } from "../../endpoints";

function Signuppage() {
  return (
    <div className="container">
      <div className="mx-auto  col-lg-5 col-md-8">
        <p className="display-4 fw-bold text-black">Hi, Let's get you in!</p>
        <div className="card shadow mx-auto" style={{ borderColor: "#eee" }}>
          <div className="card-body">
            <p className="fs-3 fw-bold mb-3">Sign up to share yourself.</p>
            <hr />
            <div className="form">
              <div className="col">
                <div className="mb-3">
                  <label>Name</label>
                  <input type="text" className="form-control form-control-lg" />
                </div>
                <div className="mb-3">
                  <label>Username</label>
                  <input type="text" className="form-control form-control-lg" />
                </div>
              </div>
              <div className="mb-3">
                <label>Email</label>
                <input type="text" className="form-control form-control-lg" />
              </div>
              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                />
              </div>
              <div className="mb-3">
                <button className="btn-dark btn btn-lg rounded-4 shadow fs-4 fw-bold w-100">
                  SIGN UP
                </button>
                <small>
                  Or, <NavLink to={endpoints.login}> log in</NavLink> if you already have an account.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signuppage;
