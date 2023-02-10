import { useState } from "react"

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? "none" : "" }
  const showWhenVisible = { display: visible ? "" : "none" }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  }

  const renderDeleteButton = () => {
    if (blog.user.username === user.username) {
      return (
        <button id="remove-button" onClick={handleDelete}>
          remove
        </button>
      )
    }
  }

  return (
    <div className="blog" style={blogStyle}>
      <span className="title">{blog.title}</span>{" "}
      <span className="author">{blog.author}</span>
      <button onClick={toggleVisibility} style={showWhenVisible}>
        hide
      </button>
      <button
        id="view-button"
        onClick={toggleVisibility}
        style={hideWhenVisible}
      >
        view
      </button>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>
          <span className="numberOfLikes">{blog.likes}</span>{" "}
          <button id="like-button" onClick={handleLike}>
            like
          </button>
        </div>
        <div>{blog.user.username}</div> {renderDeleteButton()}
      </div>
    </div>
  )
}

export default Blog
