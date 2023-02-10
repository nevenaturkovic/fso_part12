import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"
import BlogForm from "./BlogForm"
import userEvent from "@testing-library/user-event"

test("<BlogForm /> calls the event handler it received as props with the right details when a new blog is created", () => {
  const createBlog = jest.fn()
  const setNotifications = jest.fn()
  const blogFormRef = jest.fn()

  render(
    <BlogForm
      setNotifications={setNotifications}
      blogFormRef={blogFormRef}
      createBlog={createBlog}
    />
  )

  const input1 = screen.getByPlaceholderText("Title")
  const input2 = screen.getByPlaceholderText("Author")
  const input3 = screen.getByPlaceholderText("url")

  const sendButton = screen.getByText("create")

  userEvent.type(input1, "Testing a form...")
  userEvent.type(input2, "Author")
  userEvent.type(input3, "www...")

  userEvent.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toStrictEqual({
    title: "Testing a form...",
    author: "Author",
    url: "www...",
  })
})
