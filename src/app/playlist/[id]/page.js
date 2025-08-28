"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaBackward, FaForward, FaHeart, FaPlay, FaPause, FaRegHeart, FaVolumeDown } from "react-icons/fa";

const playlists = {
  "2k-love-melodies": {
    title: "2k Love Melodies",
    description: "A.R. Rahman, Harris Jayaraj, Anirudh Ravichander and more",
    cover: "/images/love.jpg",
    tracks: [
      { title: "Veesum Velichathile", artist: "Karthik", album: "Naan Ee", duration: "3:08", image: "/images/veesum_velichathile.jpg", src: "/songs/Nadhiye Nadhiye.mp3" },
      { title: "Mundhinam", artist: "Harris Jeyaraj", album: "Vaaranam Aayiram", duration: "0:32", image: "/images/mundhinam.jpeg", src: "/songs/Nenjukkul-Peidhidum.mp3" },
      { title: "Kadhaipoma", artist: "Sid Sriram", album: "Oh my Kadavule", duration: "4:42", image: "/images/Kadhaipoma.jpg", src: "/songs/Kurumugil.mp3" },
      { title: "Vaa Senthaazhini", artist: "G V Prakash", album: "Adiye", duration: "4:12", image: "/images/vaa_senthaazhini.jpg", src: "/songs/Pirai-Thedum.mp3" },
      { title: "Nira", artist: "Malvi Sundaresan", album: "Takkar", duration: "5:04", image: "/images/nira.webp", src: "/songs/Uyirey.mp3" },
    ],
  },
};

export default function PlaylistPage({ params }) {
  const { id } = params;
  const data = playlists[id];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  const track = data?.tracks?.[currentIndex];

  function loadTrack(index) {
    setCurrentIndex(index);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.src = data.tracks[index].src;
        audioRef.current.play();
      }
    }, 0);
  }

  function togglePlay() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play(); else el.pause();
  }

  function prev() {
    loadTrack((currentIndex - 1 + data.tracks.length) % data.tracks.length);
  }
  function next() {
    loadTrack((currentIndex + 1) % data.tracks.length);
  }

  function toggleFavorite(title) {
    setFavorites((f) => (f.includes(title) ? f.filter((t) => t !== title) : [...f, title]));
  }

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = volume;
  }, [volume]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTime = () => setCurrentTime(el.currentTime || 0);
    const onLoaded = () => setDuration(el.duration || 0);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onLoaded);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [currentIndex]);

  if (!data) return <div className="p-6">Playlist not found.</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="playlist-header flex items-center gap-5 p-5" style={{ background: "linear-gradient(to right, #F9429E, #E5358C, #D1287A, #BE1B69, #AA0E57, #960145)" }}>
        <img src={data.cover} alt="cover" className="w-40 h-40 object-cover rounded" />
        <div>
          <h1 className="text-3xl font-bold">{data.title}</h1>
          <p className="text-sm text-[#eee]">{data.description}</p>
        </div>
      </div>

      <div className="p-5">
        <Link href="/" className="inline-block mb-4 px-4 py-2 bg-[#1db954] text-black rounded">← Back to Home</Link>

        <div className="divide-y divide-[#333]">
          {data.tracks.map((t, i) => (
            <div key={t.title} className="grid grid-cols-[40px_50px_1.5fr_1fr_60px] items-center p-2 hover:bg-[#1e1e1e] cursor-pointer" onClick={() => loadTrack(i)}>
              <div>{i + 1}</div>
              <div><img src={t.image} alt={t.title} className="w-[45px] h-[45px] object-cover rounded" /></div>
              <div>
                <strong>{t.title}</strong>
                <div className="text-[#aaa] text-xs">{t.artist}</div>
              </div>
              <div className="text-sm">{t.album}</div>
              <div className="text-sm">{t.duration}</div>
            </div>
          ))}
        </div>
      </div>

      <footer className="h-[70px] bg-black border-t border-[#222] flex items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <button onClick={prev} className="text-white text-xl"><FaBackward /></button>
          <button onClick={togglePlay} className="text-white text-xl">{isPlaying ? <FaPause /> : <FaPlay />}</button>
          <button onClick={next} className="text-white text-xl"><FaForward /></button>
          <button onClick={() => track && toggleFavorite(track.title)} className="text-white text-xl">
            {track && favorites.includes(track.title) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          </button>
        </div>

        <div className="flex-1 px-5">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={Math.min(currentTime, duration || 0)}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCurrentTime(val);
              if (audioRef.current) audioRef.current.currentTime = val;
            }}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2 text-[#ccc]">
          <FaVolumeDown />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-[100px]"
          />
        </div>

        <audio ref={audioRef} />
      </footer>
    </div>
  );
}


