import React, { useEffect, useState } from 'react'
import {faker} from '@faker-js/faker'
import Story from './Story'
import { useSession } from 'next-auth/react'
const Stories = () => {
  const{data:session}=useSession()
  // it holds the value of fake data 
  const [suggestion,setSuggestion]=useState();
  useEffect(()=>{
    // it creates an array of 40 users data
    
    const suggestions=[...Array(20)].map((_,i)=>({
      // it uses all the data and add id in that data
      ...faker.helpers.userCard(),id:i,
      avatar:faker.image.avatar()
    }))
    console.log(suggestions)
    setSuggestion(suggestions)
  },[])
  return (
    <div className='flex space-x-2 p-6 bg-white mt-8 border-gray-200 border rounded-sm overflow-x-scroll 
    scrollbar-thin
     scrollbar-thumb-black'>
       <Story img={session?.user.image} name='Your Story'/>
      {suggestion?.map(profile=>(
        <Story key={profile.id} img={profile.avatar}name={profile.username} />))}
    </div>
  )
}

export default Stories