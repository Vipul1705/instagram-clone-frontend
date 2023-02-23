import React, { useEffect, useState } from 'react'
import './Post.css'
import Avatar from '@mui/material/Avatar';
import { db } from './firebase';
import firebase from 'firebase/compat/app';
import axios from "./axios";
import Pusher from "pusher-js";

function Post({username ,caption , imageUrl, avatarUrl, postId, user }) {

  const [comments,setComments]=useState([]);
  const [comment,setComment]=useState('');

  const fetchComments=async(postId)=>{
    await axios.get(`/post/comments/${postId}`).then((response)=>{
      console.log(response.data);
      setComments(response.data.comments);
    }).catch((error)=>{
      console.log(error);
    })
  }

  useEffect(()=>{
    // let unsubcribe;
    if(postId){
      fetchComments(postId);
    //   unsubcribe=db
    //   .collection("posts")
    //   .doc(postId)
    //   .collection("comments")
    //   .orderBy('timestamp','desc')
    //   .onSnapshot((snapshot)=>{
    //     setComments(snapshot.docs.map((doc)=>doc.data()))
    //   })
    }

    // return ()=>{
    //   unsubcribe();
    // }
  },[postId])

  const postComment=(event)=>{
    event.preventDefault();

    // db.collection("posts").doc(postId).collection("comments").add({
    //   text: comment,
    //   username: user.displayName,
    //   timestamp: firebase.firestore.FieldValue.serverTimestamp()
    // });
    // setComment('');
    var data=JSON.stringify({
      comment:{
        text:comment,
        username:user.displayName,
        timestamp:Date.now(),
      },
    });

    var config={
      method:"put",
      maxBodyLength:Infinity,
      url:`${process.env.REACT_APP_BASE_URL}/add-comment/post/${postId}`
      ,
      headers:{
        "Content-Type":"application/json",
      },
      data:data, 
      };

      await axios(config).then((response)=>{
        fetchComments();
      }).catch((error)=>{console.log(error);});

      setComment("");
  }
useEffect(()=>{
  const pusher=new Pusher(process.env.REACT_APP_PUSHER_API,{
    cluster:"ap2",
  });
  const channel=pusher.subscribe("comments");
  channel.bind("updated",function(data){
    console.log("data received comments",data);
    fetchComments();
  });
},[]);

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
