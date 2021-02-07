import './index.scss';

function VideoIframe({ videoId, title, setIsSelected, setSelectedVideo, selectedVideo, setIsClicked, isClicked }) {

    if (selectedVideo.videoId === videoId) {
        return ('')
    } else {
        return (
            <div className="video-frame-box" onClick={() => {
                setIsSelected(true);
                setSelectedVideo({ videoId, title });
                setIsClicked(!isClicked)
            }}>
                <h3 className="unselected-video-title">{title}</h3>
                <iframe className="unselected-iframe" src={"https://www.youtube.com/embed/" + videoId} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" title={title} allowFullScreen></iframe>
                <div className="invisible-layer"></div>
            </div>)
    }

}

export default VideoIframe;