import { useEffect, useRef, useState } from "react";
import "./App.css";

function PhotoBooth() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const stripCanvasRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [capturedImages, setCapturedImages] = useState([]);
  const [stripImage, setStripImage] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [flash, setFlash] = useState(false);

  const filters = {
    none: "",
    grayscale: "grayscale(100%)",
    sepia: "sepia(100%)",
    blur: "blur(5px)",
    brightness: "brightness(150%)",
    contrast: "contrast(200%)",
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  }, []);

  const handleCaptureWithCountdown = () => {
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        triggerFlash();
        captureImage();
      }
    }, 1000);
  };

  const triggerFlash = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 300);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.filter = filters[selectedFilter];
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png");
      const updatedImages = [...capturedImages, imageData];
      setCapturedImages(updatedImages);

      if (updatedImages.length === 3) {
        generateStrip(updatedImages);
      }
    }
  };

  const generateStrip = (images) => {
    const width = 300;
    const height = 400;
    const canvas = stripCanvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    const imgHeight = 120;
    const spacing = 10;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    images.forEach((imgData, i) => {
      const img = new Image();
      img.src = imgData;
      img.onload = () => {
        ctx.drawImage(img, 0, i * (imgHeight + spacing), width, imgHeight);
        if (i === images.length - 1) {
          ctx.fillStyle = "black";
          ctx.font = "bold 16px Arial";
          ctx.textAlign = "center";
        //   ctx.fillText("photobooth", width / 2, height - 10);
          setStripImage(canvas.toDataURL("image/png"));
        }
      };
    });
  };

  const resetAll = () => {
    setCapturedImages([]);
    setStripImage(null);
  };

  return (
    <div className="app-container">
      {flash && <div className="flash-overlay"></div>}
      <div className="video-section">
        <div className="video-container">
          <video
            ref={videoRef}
            autoPlay
            className="video"
            style={{ filter: filters[selectedFilter] }}
          />
          <canvas ref={canvasRef} className="hidden" />
          {countdown && <div className="countdown">{countdown}</div>}
        </div>

        <div className="filter-bar">
          <div className="filter-bar-container">
            {Object.keys(filters).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`filter-button ${
                  selectedFilter === filter ? "bg-blue-500" : "bg-gray-800"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="button-row">
          {capturedImages.length < 3 && (
            <button onClick={handleCaptureWithCountdown} className="capture-button">
              Capture ({capturedImages.length + 1}/3)
            </button>
          )}
          {capturedImages.length > 0 && (
            <button onClick={resetAll} className="reset-button">
              Reset
            </button>
          )}
        </div>
      </div>

      {stripImage && (
        <div className="strip-output">
          <img src={stripImage} alt="Photo Strip" className="strip-final" />
          <a href={stripImage} download="photobooth-strip.png" className="download-button">
            Download Strip
          </a>
        </div>
      )}

      <canvas ref={stripCanvasRef} className="hidden" />
    </div>
  );
}

export default PhotoBooth;
