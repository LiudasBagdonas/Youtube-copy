import './index.scss';

function BigVideoIframe({ selectedVideo }) {

    return (
        <div className="bigvideo-frame-box">
            <h3 className="big-video-title">{selectedVideo.title}</h3>
            <iframe className="selected-iframe" src={"https://www.youtube.com/embed/" + selectedVideo.videoId + "?autoplay=1"} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" title={selectedVideo.title} allowFullScreen></iframe>
        </div>
    );
}

export default BigVideoIframe;