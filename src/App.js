import { useEffect, useState } from "react";
import "./App.css";
import Post from "./Post";
import { auth } from "./firebase";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Input } from "@mui/material";
import ImageUpload from "./ImageUpload";
import axios from "./axios";
import Pusher from "pusher-js";
import Avatar from "@mui/material/Avatar";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPosts] = useState([
    // {
    //   username:'vipul',
    //   caption:'qwertyuiop',
    //   imageUrl:'https://reactjs.org/logo-og.png',
    //   avatarUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTm-KJMECWJvjbROgmX9cEk8JNFy9lrYNrBP1FV7oZPw&s'
    // },
    // {
    //   username:'rajesh',
    //   caption:'asdfghjkl',
    //   imageUrl:'https://reactjs.org/logo-og.png',
    //   avatarUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTm-KJMECWJvjbROgmX9cEk8JNFy9lrYNrBP1FV7oZPw&s'
    // },
    // {
    //   username:'rohit',
    //   caption:'zxcvbnm',
    //   imageUrl:'https://reactjs.org/logo-og.png',
    //   avatarUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTm-KJMECWJvjbROgmX9cEk8JNFy9lrYNrBP1FV7oZPw&s'
    // },
    // {
    //   username:'shubhum',
    //   caption:'123456789',
    //   imageUrl:'https://reactjs.org/logo-og.png',
    //   avatarUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTm-KJMECWJvjbROgmX9cEk8JNFy9lrYNrBP1FV7oZPw&s'
    // }
  ]);

  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in..
        console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out..
        setUser(null);
      }
    });

    return () => {
      //perform some cleanup actions
      unsubcribe();
    };
  }, [user, username]);

  const fetchPosts = async () =>
    await axios.get("/sync").then((response) => {
      console.log(response);
      setPosts(response.data);
    });

  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_API, {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("posts");
    channel.bind("inserted", function (data) {
      console.log("data received ", data);
      fetchPosts();
    });
  }, []);

  // useEffect runs a piece of code baased on specific condition
  useEffect(() => {
    //this is where the code runs
    // db.collection("posts")
    //   .orderBy("timestamp", "desc")
    //   .onSnapshot((snapshot) => {
    //     // everytime a new post is added , this code is fired
    //     setPosts(
    //       snapshot.docs.map((doc) => ({
    //         id: doc.id,
    //         post: doc.data(),
    //       }))
    //     );
    //   });

    fetchPosts();
  }, []); //it will runs once when app is load and every single time posts changes

  console.log("posts are >>>", posts);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form className="app_signup">
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signUp}>
                Signup
              </Button>
            </form>
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => {
          setOpenSignIn(false);
        }}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form className="app_signin">
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>
                Login
              </Button>
            </form>
          </Typography>
        </Box>
      </Modal>

      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user ? (
          <div className="app_login">
            <Button onClick={() => auth.signOut()}>Logout</Button>
            <Button>
              <Avatar className="post_avatar" alt={username} src="" />
            </Button>
          </div>
        ) : (
          <div className="app_login">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Signup</Button>
          </div>
        )}
      </div>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <div className="app_posts">
          {posts.map((post) => (
            <Post
              key={post._id}
              postId={post._id}
              user={user}
              username={post.user}
              caption={post.caption}
              imageUrl={post.image}
              // avatarUrl={post.avatarUrl}
            />
          ))}
        </div>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          position: "sticky",
          objectFit: "contain",
          zIndex: "1",
          overflow: "hidden",
          bottom: "0",
          backgroundColor: "white",
          border: "1px solid lightgray",
        }}
      >
        {user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ) : (
          <h3>Sorry you need to login to upload</h3>
        )}
      </Box>
      {/* 
        <Post username='vipul' caption='qwertyuiop' imageUrl='https://reactjs.org/logo-og.png' avatarUrl='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTm-KJMECWJvjbROgmX9cEk8JNFy9lrYNrBP1FV7oZPw&s'/>
        <Post username='rajesh' caption='asdfghjkl' imageUrl='https://reactjs.org/logo-og.png'avatarUrl='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTm-KJMECWJvjbROgmX9cEk8JNFy9lrYNrBP1FV7oZPw&s'/>
        <Post username='rohit' caption='zxcvbnm' imageUrl='https://reactjs.org/logo-og.png' avatarUrl='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTm-KJMECWJvjbROgmX9cEk8JNFy9lrYNrBP1FV7oZPw&s'/>
        <Post username='shubhum' caption='123456789' imageUrl='https://reactjs.org/logo-og.png' avatarUrl='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTm-KJMECWJvjbROgmX9cEk8JNFy9lrYNrBP1FV7oZPw&s'/> */}
    </div>
  );
}

export default App;
