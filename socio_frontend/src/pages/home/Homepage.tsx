import { useContext } from "react"
import { UserContext } from "../../ctx/UserContext"

function Homepage() {
    const user = useContext(UserContext)
  return (
    <>
      <div className="container">
        <div className="col-lg-7 mx-auto">
          <div className="card rounded-4 mb-5">
            <div className="card-body">
              <p className="fs-4 fw-semibold">
                Hey, {user?.user?.name}. Have something in mind? Pour it out!
              </p>
              <button className="btn btn-dark shadow rounded-3 fw-semibold">
                Post your experience.
              </button>
            </div>
          </div>
          <div className="card rounded-4 mb-3">
            <div className="card-body">
              <div className="caption">
                <p className="fs-4 fw-semibold mb-0">John Carter</p>
                <p className="small text-secondary fw-semibold mb-0">
                  @johncarter
                </p>
                <p className="small text-secondary fw-semibold">13 May 2025</p>
              </div>
              <p className="fs-5">Hey Everyone. This is a testing post.</p>
              <img
                className="img-fluid rounded-3"
                src="https://wallpapers.com/images/featured/hd-a5u9zq0a0ymy2dug.jpg"
                alt=""
              />
              <hr />
              <button className="btn btn-outline-danger">Like</button>
              <input type="text" placeholder="Write a comment." className="form-control form-control-sm" />
              <hr />
              <div style={{backgroundColor:"#eee"}} className="px-4 py-2 rounded-5 mb-2">
                <p className="fs-5 fw-bold mb-0">Riyan Parag</p>
                <p className="fs-6 fw-normal mb-0">This is a testing comment and this is not for work.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Homepage