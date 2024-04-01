import {Link, withRouter} from 'react-router-dom'

import './index.css'

const NotFound = props => {
  const onClickBackToHome = () => {
    const {history} = props
    history.replace('/')
  }

  return (
    <div className="not-found-container">
      <img
        src="https://res.cloudinary.com/dtayp31ut/image/upload/v1671005812/not_found_image_xr8agg.jpg"
        alt="not found"
        className="not-found-bg-image"
      />
      <h1 className="pageNotFound-heading">Page Not Found</h1>
      <p className="pageNotFound-description">
        we are sorry, the page you requested could not be found, please go back
        to the homepage
      </p>
      <Link to="/">
        <button
          type="button"
          className="notfound-button"
          onClick={onClickBackToHome}
        >
          Go Back to Home
        </button>
      </Link>
    </div>
  )
}

export default withRouter(NotFound)
