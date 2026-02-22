import Home from './pages/Browse.jsx'
import About from './pages/about.jsx'
import Contact from './pages/contant.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RentTool from './pages/RentTool.jsx'
import HowWorks from './pages/HowWorks.jsx'
import SignUp from './pages/SignUp.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import WishList from './pages/WishList.jsx'
import ItemDetails from './pages/ItemDetails.jsx'
import OwnerProfile from './pages/OwnerProfile.jsx'
import PostItem from './pages/PostItem.jsx'
import Category from './pages/Category.jsx'
import ErrorPage from './pages/ErrorPage.jsx'
import Verify from './pages/Verify.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import AuthAutoLogin from './components/AuthAutologin.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { setupInterceptors } from './api/axiosInterceptor.js'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Chat from './pages/Chat.jsx'
import ProfileEdit from './pages/ProfileEdit.jsx'
import Header from './components/UI/Header.jsx'



function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    setupInterceptors();
  }, []);

  const router = createBrowserRouter([{
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'rent-item', element: <RentTool /> },

      {
        path: 'rent-item/:slugCategory/:slugItem',
        element: <PostItem />
      },

      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },

      {
        path: "wishlist",
        element: (
          <ProtectedRoute>
            <WishList />
          </ProtectedRoute>
        ),
      },

      {
        path: "profile/edit",
        element: (
          <ProtectedRoute>
            < ProfileEdit />
          </ProtectedRoute>
        ),
      },

      { path: 'works', element: <HowWorks /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'verify/:token', element: <VerifyEmail /> },

      { path: 'verify', element: <Verify /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'items/:slugCategory/:slugName/:slugId', element: <ItemDetails /> },
      { path: 'profile/:slugId', element: <OwnerProfile /> },

      {
        path: ":location/view-all",
        element: (
          <>
            <Category viewMode="all" />
          </>
        ),
      },
      // Dynamic path catch-all
      {
        path: ":location/:itemTitle",
        element: (
          <>
            <Category viewMode="single" />
          </>
        ),
      },

    ]
  },
  {
    path: "chat",
    element: (
      <ProtectedRoute>
        <Header />
        <Chat />
      </ProtectedRoute>
    ),
  },
  {
    path: "chat/:roomId",
    element: (
      <ProtectedRoute>
        <Header />
        <Chat />
      </ProtectedRoute>
    ),
  },
  ]);

  return (<>
    <AuthAutoLogin />
    <RouterProvider router={router}>
    </RouterProvider>
  </>

  )
}

export default App
