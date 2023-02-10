import { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import Notification from "./components/Notification"
import Togglable from "./components/Togglable"
import BlogForm from "./components/BlogForm"
import blogService from "./services/blogs"
import loginService from "./services/login"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [notifications, setNotifications] = useState(null)
  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
    } catch (error) {
      setNotifications({
        message: "wrong username or password",
        kind: "error",
      })
      setTimeout(() => {
        setNotifications(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <Notification notification={notifications} />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  )

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <Notification notification={notifications} />
      <p>
        {user.name} logged in
        <button
          id="logout-button"
          onClick={() => {
            window.localStorage.removeItem("loggedBlogappUser")
            blogService.setToken(null)
            setUser(null)
          }}
        >
          logout
        </button>{" "}
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm
          setNotifications={setNotifications}
          blogFormRef={blogFormRef}
          createBlog={async (blogObject) => {
            const returnedBlog = await blogService.create(blogObject)
            setBlogs(blogs.concat(returnedBlog))
            return returnedBlog
          }}
        />
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          user={user}
          blog={blog}
          handleLike={async () => {
            const updatedBlog = await blogService.update(blog.id, {
              likes: blog.likes + 1,
            })
            setBlogs(blogs.map((b) => (blog.id === b.id ? updatedBlog : b)))
          }}
          handleDelete={async () => {
            if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
              await blogService.remove(blog.id)
              setBlogs(blogs.filter((b) => blog.id !== b.id))
            }
          }}
        />
      ))}
    </div>
  )

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) =>
        setBlogs(
          blogs.sort((first, second) => (first.likes > second.likes ? -1 : 1))
        )
      )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  if (user === null) {
    return loginForm()
  }
  return blogList()
}

export default App
