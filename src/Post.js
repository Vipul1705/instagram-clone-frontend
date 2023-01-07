import React, { useEffect, useState } from 'react'
import './Post.css'
import Avatar from '@mui/material/Avatar';
import { db } from './firebase';
import firebase from 'firebase/compat/app';

function Post({username ,caption , imageUrl, avatarUrl, postId, user }) {

  const [comments,setComments]=useState([]);
  const [comment,setComment]=useState('');

  useEffect(()=>{
    let unsubcribe;
    if(postId){
      unsubcribe=db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .orderBy('timestamp','desc')
      .onSnapshot((snapshot)=>{
        setComments(snapshot.docs.map((doc)=>doc.data()))
      })
    }

    return ()=>{
      unsubcribe();
    }
  },[postId])

  const postComment=(event)=>{
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment('');
  }

  return (
    <div className='post'>
        {/* header->avater+username */}
        <div className='post_header'>
        <Avatar className='post_avatar' alt={username} src={avatarUrl} />
        <h3>{username}</h3>
        </div>

        {/* image */}
        <img className='post_image' src={imageUrl} alt=''/>
        
        {/* username +caption */}
        <h4 className='post_text'><strong>{username}</strong> {caption}</h4>

        <div className='post_comments'>
          {
            comments.map((comment)=>(
              <p>
                <strong>{comment.username}</strong> {comment.text}
              </p>
            ))
          }
        </div>

          {user && (
            <form className='post_commentBox'>
            <input className='post_input'
            type='text'
            placeholder='Add a comment...'
            value={comment}
            onChange={(e)=>setComment(e.target.value)}
            />
            <button className='post_button'
            type='submit'
            disabled={!comment}
            onClick={postComment}
            >
              Post
            </button>
          </form>
          )}
        
    </div>
  )
}

export default Post
