import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import BlogDetail from './routes/BlogDetail.jsx'
import Trending from './routes/Trending.jsx'
import Categories from './routes/Categories.jsx'
import CategoryDetail from './routes/CategoryDetail.jsx'
import About from './routes/About.jsx'
import Write from './routes/Write.jsx'
import EditBlog from './routes/EditBlog.jsx'
import Login from './routes/Login.jsx'
import Register from './routes/Register.jsx'
import Profile from './routes/Profile.jsx'
import Search from './routes/Search.jsx'
import MyComments from './routes/MyComments.jsx'
import PasswordReset from './routes/PasswordReset.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/blog/:id', element: <BlogDetail /> },
  { path: '/blog/:id/edit', element: <EditBlog /> },
  { path: '/trending', element: <Trending /> },
  { path: '/categories', element: <Categories /> },
  { path: '/category/:categoryName', element: <CategoryDetail /> },
  { path: '/about', element: <About /> },
  { path: '/write', element: <Write /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/profile', element: <Profile /> },
  { path: '/search', element: <Search /> },
  { path: '/my-comments', element: <MyComments /> },
  { path: '/password-reset', element: <PasswordReset /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
