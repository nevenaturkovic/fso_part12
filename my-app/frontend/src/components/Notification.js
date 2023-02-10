import React from "react"

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }
  if (notification.kind === "newBlog") {
    return <div className="newBlog">{notification.message}</div>
  }
  return <div className="error">{notification.message}</div>
}

export default Notification
