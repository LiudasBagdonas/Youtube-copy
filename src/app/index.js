import './index.scss';
import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import VideoIframe from './components/VideoIframe';
import BigVideoIframe from './components/BigVideoIframe';
import saveFetch from './functions/saveFetch';

function App() {

    const [keyword, setKeyword] = useState('')
    const [videosCount, setVideosCount] = useState(0)
    const [fetchedData, setFetchedData] = useState([])
    const [moreVideos, setMoreVideos] = useState(false)
    const [isSelected, setIsSelected] = useState(false)
    const [selectedVideo, setSelectedVideo] = useState([])
    const [isSubmited, setisSubmited] = useState(true)
    const [error, setError] = useState('')
    const [isClicked, setIsClicked] = useState(true)

    //Save selected video to db
    useEffect(() => {

        if (selectedVideo.videoId && selectedVideo.title) {
            saveFetch({ video: selectedVideo, actionType: "videoData", date: new Date() })
        }

    }, [selectedVideo])


    //Videos fetch function. Activates when videosCount or isSubmited states changes
    useEffect(() => {

        //Requirement was: Search input should have validation to allow only characters with length less than 20 characters.
        //Since it was asked to make it less than 20, I made maximum alowed characters number - 19.
        if (videosCount > 0 && keyword.length < 20) {
            fetch("http://localhost:8080/youtubeAPI", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ keyword: keyword, count: videosCount }),
            })
                .then((res) => res.json())
                .then((data) => setFetchedData(data))
        }
       
    }, [videosCount, isSubmited]);

    //Scrolls window to top after selecting video
    useEffect(() => {
        if (videosCount > 0) {
            setVideosCount(20)
        }
        window.scrollTo(0, 0)
    }, [isClicked])


    //Submit event handler. Sets states to execute fetch
    const submit = e => {
        e.preventDefault()
        let inputValue = document.getElementById('search-input').value;


        if (inputValue.length >= 20) {
            setVideosCount(videosCount + 20)
            setError('Maximum 19 characters are alowed.')
        } 
        else if (inputValue === '') {
            setError('Field should not be empty.')
        }
        else if (inputValue.length < 20 && inputValue !== '') {
            setisSubmited(!isSubmited)
            setVideosCount(20)
            setMoreVideos(true)
            setIsSelected(false)
            setSelectedVideo([])
            setKeyword(inputValue)
            setError('')

            //Fetch saves search input to mongodb database if sumbit event is executed successfully
            saveFetch({ keyword: inputValue, actionType: "submitEvent", date: new Date() })
        }

    }

    //Requires to fetch more videos on scroll
    const fetchMoreData = () => {
        setTimeout(() => {
            setVideosCount(videosCount + 20)
        }, 1000);

    };

    return (
        <div className="App">
            {/* Search Box Block */}
            <section className="search-box">
                <form onSubmit={(e) => submit(e)}>
                    <label>
                        <input id="search-input" className={`input-error--${error !== '' ? 'true' : 'false'}`} 
                        name="keyword" type="text" placeholder="Enter text" />
                    </label>
                    <button>Search</button>
                </form>
                {error !== '' ? <p className="error">{error}</p> : ''}
            </section>
            {/* Page Content Section */}
            <section className={`page-content error--${error !== '' ? 'true' : 'false'}`}  >
                <InfiniteScroll
                    className="infinite-scrool"
                    dataLength={videosCount}
                    next={fetchMoreData}
                    hasMore={moreVideos}
                >
                    {/* Selected video section. Shown if selectedVideo state is set to true */}
                    {isSelected ?
                        <section className="selected-video-section">
                            <BigVideoIframe selectedVideo={selectedVideo}></BigVideoIframe>
                        </section> : ''}
                    {/* Search results sectiion */}
                    <section className="search-results-items">
                        {fetchedData.map((video, index) => (
                            <VideoIframe
                                isClicked={isClicked}
                                setIsClicked={setIsClicked}
                                selectedVideo={selectedVideo}
                                setIsSelected={setIsSelected}
                                setSelectedVideo={setSelectedVideo}
                                key={index} videoId={video.id.videoId} title={video.snippet.title} ></VideoIframe>
                        ))}
                    </section>


                </InfiniteScroll>
            </section>

        </div>
    );
}

export default App;
