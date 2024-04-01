import {Component} from 'react'
import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const topRatedBooksApiStatuses = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 3,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
  ],
}

class Home extends Component {
  state = {
    topRatedApiStatus: topRatedBooksApiStatuses.initial,
    topRatedBooks: [],
  }

  componentDidMount() {
    this.getTopRatedBooks()
  }

  onClickRetry = () => {
    this.getTopRatedBooks()
  }

  getTopRatedBooks = async () => {
    this.setState({topRatedApiStatus: topRatedBooksApiStatuses.inProgress})

    const topRatedBooksApi = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(topRatedBooksApi, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const booksList = fetchedData.books
      const updatedData = booksList.map(eachBook => ({
        id: eachBook.id,
        authorName: eachBook.author_name,
        coverPic: eachBook.cover_pic,
        title: eachBook.title,
      }))
      this.setState({
        topRatedApiStatus: topRatedBooksApiStatuses.success,
        topRatedBooks: updatedData,
      })
    } else {
      this.setState({topRatedApiStatus: topRatedBooksApiStatuses.failure})
    }
  }

  renderSliderLodingView = () => (
    <div testid="loader" className="loader-container">
      <Loader type="TailSpin" color="#8284C7" height={50} width={50} />
    </div>
  )

  renderSliderSuccessView = () => {
    const {topRatedBooks} = this.state

    return (
      <Slider {...settings}>
        {topRatedBooks.map(eachBook => {
          const {title, coverPic, id, authorName} = eachBook
          const onClickedTopRatedBook = () => {
            const {history} = this.props
            history.push(`/books/${id}`)
          }

          return (
            <div className="top-rated-book-item-container" key={id}>
              <button
                onClick={onClickedTopRatedBook}
                className="top-rated-card-btn"
                type="button"
              >
                <div className="top-rated-book-image-container">
                  <img
                    className="top-rated-book-image"
                    alt={title}
                    src={coverPic}
                  />
                </div>
                <h1 className="top-rated-book-name">{title}</h1>
                <p className="top-rated-book-author">{authorName}</p>
              </button>
            </div>
          )
        })}
      </Slider>
    )
  }

  renderSliderViewFailure = () => (
    <div className="top-rated-books-failure-container">
      <img
        className="top-rated-books-failure-image"
        src="https://res.cloudinary.com/dtayp31ut/image/upload/v1671035667/Home-Page-Failure-image_ee8av8.jpg"
        alt="failure view"
      />

      <p className="top-rated-books-failure-heading">
        Something Went wrong. Please try again.
      </p>
      <button
        className="top-rated-books-failure-btn"
        onClick={this.onClickRetry}
        type="button"
      >
        Try Again
      </button>
    </div>
  )

  renderSliderView = () => {
    const {topRatedApiStatus} = this.state

    switch (topRatedApiStatus) {
      case topRatedBooksApiStatuses.success:
        return <>{this.renderSliderSuccessView()}</>
      case topRatedBooksApiStatuses.inProgress:
        return <>{this.renderSliderLodingView()}</>
      case topRatedBooksApiStatuses.failure:
        return <> {this.renderSliderViewFailure()}</>
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="Home-Container">
          <div className="responsive-Container">
            <h1 className="Home-main-heading">
              Find Your Next Favorite Books?
            </h1>
            <p className="description">
              You are in the right place. Tell us what titles or genres you have
              enjoyed in the past, and we will give you surprisingly insightful
              recommendations.
            </p>
            <button
              className="mobile-Find-Books-Button"
              type="button"
              onClick={this.onClickFindBooks}
            >
              Find Books
            </button>

            <div className="slider-main-Container">
              <div className="text-container">
                <h1 className="slider-heading">Top Rated Books</h1>

                <Link to="/shelf">
                  <button type="button" className="large-Find-Books-Button">
                    Find Books
                  </button>
                </Link>
              </div>
              <div className="slider">{this.renderSliderView()}</div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    )
  }
}

export default Home
