import {
  DotsHorizontalIcon,
  BookmarkIcon,
  ChatIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/outline'
import React, { useEffect, useState } from 'react'
import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import Moment from 'react-moment'
import { db } from '../firebase'
import { useSession } from 'next-auth/react'
const Post = ({ id, userImg, username, Img, caption }) => {
  const { data: session } = useSession()
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState([])
  const [hasLiked, setHasLiked] = useState(false)

  const sendComment = async (e) => {
    e.preventDefault()
    const commentToSend = comment
    setComment('')
    await addDoc(collection(db, 'posts', id, 'comments'), {
      comment: commentToSend,
      username: session.user.username,
      userImage: session.user.image,
      timestamp: serverTimestamp(),
    })
  }

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, 'posts', id, 'comments'),
          orderBy('timestamp', 'desc')
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  )
  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid))
    } else {
      await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
        username: session.user.username,
      })
    }
  }

  useEffect(
    () =>
      onSnapshot(collection(db, 'posts', id, 'likes'), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [db, id]
  )
  useEffect(
    () =>
      setHasLiked(
        likes.findIndex((like) => like.id === session.user.uid) !== -1
      ),
    [likes]
  )
  console.log(hasLiked)
  return (
    <div className="border-rounded-sm my-7 bg-white">
      {/* header */}
      <div className="flex items-center p-5 py-3">
        <img
          src={userImg}
          alt=""
          className="mr-3 h-12 w-12 rounded-full border object-contain p-1"
        />
        <p className="flex-1 font-bold">{username}</p>
        <DotsHorizontalIcon className="h-5" />
      </div>
      {/* img */}
      <img src={Img} alt="" className="w-full object-cover" />
      {/* buttons */}
      <div className="flex justify-between px-4 pt-4">
        <div className="flex space-x-4 ">
          {hasLiked?(<HeartIconFilled onClick={likePost} className='btn text-red-600'/>):(

            <HeartIcon onClick={likePost} className="btn" />
          )}
          <ChatIcon className="btn" />
          <PaperAirplaneIcon className="btn" />
        </div>
        <BookmarkIcon className="btn" />
      </div>
      {/* caption */}
      <p className="truncate p-5">
        {likes.length>0&&(
          <p className='font-bold mb-1'>{likes.length} Likes</p>
        )}
        <span className="mr-1 font-bold">{username}</span>
        {caption}
      </p>
      {/* comments */}
      {comments.length > 0 && (
        <div className="ml-10 h-20 overflow-y-scroll scrollbar-thin scrollbar-thumb-black">
          {comments.map((comment) => (
            <div className="mb-3 flex items-center space-x-2" key={comment.id}>
              <img
                src={comment.data().userImage}
                className="h-7 rounded-full"
                alt=""
              />
              <p className="flex-1  text-sm">
                <span className="mr-2 font-bold">
                  {comment.data().username}
                </span>
                {comment.data().comment}
              </p>
              <Moment fromNow className="pr-5 text-xs">
                {comment.data().timestamp?.toDate()}
              </Moment>
            </div>
          ))}
        </div>
      )}

      {/* input box */}
      <form action="" className="flex items-center p-4 pt-0">
        <EmojiHappyIcon className="h-7" />
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment...."
          className="flex-1 border-none outline-none focus:ring-0 "
        />
        <button
          type="submit"
          disabled={!comment.trim()}
          onClick={sendComment}
          className="font-semibold text-blue-400"
        >
          Post
        </button>
      </form>
    </div>
  )
}

export default Post
