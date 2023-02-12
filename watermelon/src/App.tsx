import React from 'react';
import reddit from './images/reddit-logo.png';
import youtube from './images/youtube-logo.png';
import google from './images/google-logo.png';
import Home from './images/home.svg';
import Search from './images/search.svg'
import Bookmark from './images/bookmark.svg'
 
function App() {
 return (
   <div style={{
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '80px',
   }}>
     <div style={{
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: '70px',
      paddingLeft: '20px',
      width: '100%',
      borderBottom: '2px solid #d3d3d3'
     }}>
      <h1 style={{fontWeight: 500, fontSize: '1.5em'}}>🍉 Watermelon</h1>
     </div>
     <h2>Summary</h2>
     <img
      style={{
        display: 'flex',
        height: '50px',
        width: '50px'
      }}
      src={reddit} alt="Reddit Logo"/>
     <h2>Reddit Comments</h2>
     <img
      style={{
        display: 'flex',
        height: '50px',
        width: '50px'
      }}
      src={youtube} alt="YouTube Logo"/>
     <h2>YouTube Videos</h2>
     <img
      style={{
        display: 'flex',
        height: '50px',
        width: '50px'
      }}
      src={google} alt="Google Logo"/>
     <h2>Google Reviews</h2>
     <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        height: '80px',
        borderTop: '2px solid #d3d3d3',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white'
      }}
     >

      <div className='bottom-nav-button' style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '33%',
      }}><img src={Home} alt="Home" /></div>
      <div className='bottom-nav-button' style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '33%',
      }}><img src={Search} alt="Search" /></div>
      <div className='bottom-nav-button' style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '33%',
      }}><img src={Bookmark} alt="Bookmark" /></div>
     </div>
  </div>
 );
}
 
export default App;