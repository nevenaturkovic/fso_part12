import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Blog from "./Blog"

describe("<Blog />", () => {
  const user = {
    token: "tst",
    username: "cveklica123",
    name: "Cveta Cveklic",
  }

  const blogs = [
    {
      url: "https://some.url",
      title: "Title 1",
      author: "Author 1",
      user: {
        username: "cveklica123",
        name: "Cveta Cveklic",
        id: "62532f6a55c3d9f1a394283f",
      },
      likes: 1,
      id: "62593cf60897a3e916e72cbc",
    },
    {
      url: "https://other.url",
      title: "Title 2",
      author: "Author 2",
      user: {
        username: "cveklica123",
        name: "Cveta Cveklic",
        id: "62532f6a55c3d9f1a394283f",
      },
      likes: 2,
      id: "62593d29b32ec11635b99e22",
    },
  ]

  const blog = blogs[0]

  var container
  var mockHandlerLike
  var mockHandlerDelete

  beforeEach(() => {
    mockHandlerLike = jest.fn()
    mockHandlerDelete = jest.fn()
    container = render(
      <Blog
        user={user}
        blog={blog}
        handleLike={mockHandlerLike}
        handleDelete={mockHandlerDelete}
      />
    ).container
  })

  test("title and author are rendered", () => {
    const title1 = screen.getByText("Title 1")
    expect(title1).toBeDefined()

    const viewButton = screen.getByText("view")
    expect(viewButton).toBeVisible()

    const hideButton = screen.getByText("hide")
    expect(hideButton).not.toBeVisible()

    const authorSpan = container.querySelector(".author")
    expect(authorSpan).toHaveTextContent("Author 1")

    const url = screen.queryByText("https://some.url")
    expect(url).not.toBeVisible()

    const likesSpan = container.querySelector(".numberOfLikes")
    expect(likesSpan).not.toBeVisible()
  })

  test("url and number of likes are shown when view button is clicked", async () => {
    const button = screen.getByText("view")
    userEvent.click(button)

    const viewButton = screen.getByText("view")
    expect(viewButton).not.toBeVisible()

    const hideButton = screen.getByText("hide")
    expect(hideButton).toBeVisible()

    const title1 = screen.getByText("Title 1")
    expect(title1).toBeDefined()

    const authorSpan = container.querySelector(".author")
    expect(authorSpan).toHaveTextContent("Author 1")

    const url = screen.queryByText("https://some.url")
    expect(url).toBeVisible()

    const likesSpan = container.querySelector(".numberOfLikes")
    expect(likesSpan).toBeVisible()
  })

  test("when the like button is clicked twice", async () => {
    const button = screen.getByText("view")
    userEvent.click(button)

    const like = screen.getByText("like")
    userEvent.click(like)
    userEvent.click(like)

    expect(mockHandlerLike.mock.calls).toHaveLength(2)
  })
})
