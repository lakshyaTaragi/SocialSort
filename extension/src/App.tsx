import './App.css'
import InstagramContentScript from './contentScripts/InstagramContentScript'
import RedditContentScript from './contentScripts/RedditContentScript'
import YoutubeContentScript from './contentScripts/YoutubeContentScript'

function App() {
  return (
    <>
      *** App component ***
      <InstagramContentScript />
      <RedditContentScript />
      <YoutubeContentScript />
    </>
  )
}

export default App
