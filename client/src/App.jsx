import React from 'react'
import {Toaster} from 'react-hot-toast'
import { useUser } from '@clerk/clerk-react'
import {Route, Routes} from 'react-router-dom'

import Feed from './pages/Feed'
import Login from './pages/Login'
import Layout from './pages/Layout'
import Profile from './pages/Profile'
import ChatBox from './pages/ChatBox'
import Discover from './pages/Discover'
import Messages from './pages/Messages'
import CreatePost from './pages/CreatePost'
import Connections from './pages/Connections'

const App = () => {
    const { user } = useUser()
    return (
        <>
            <Toaster></Toaster>
            <Routes>
                <Route path='/' element={ !user ? <Login /> : <Layout />}>
                <Route index element={<Feed />} />
                <Route path='messages' element={<Messages />} />
                <Route path='messages/:userId' element={<ChatBox />} />
                <Route path='connections' element={<Connections />} />
                <Route path='discover' element={<Discover />} />
                <Route path='profile' element={<Profile />} />
                <Route path='profile/:profileId' element={<Profile />} />
                <Route path='create-post' element={<CreatePost />} />
                </Route>
            </Routes>
        </>
    )
}

export default App
