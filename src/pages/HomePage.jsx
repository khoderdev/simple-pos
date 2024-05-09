import React from 'react'
import {Link} from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

function HomePage() {
  return (
    <MainLayout>
        <div className='bg-light p-5 mt-4 rounded-3'>
            <h1>Welcome to KK Coffee Shop</h1>
            <Link to='/pos' className='btn btn-primary'>Products</Link>
        </div>
    </MainLayout>
  )
}

export default HomePage