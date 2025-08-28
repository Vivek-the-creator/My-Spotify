"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaBackward, FaForward, FaHeart, FaPause, FaPlay, FaRegHeart, FaVolumeDown } from "react-icons/fa";

const dailyMixes = [
  {
    title: "2k Love Melodies",
    artist: "A.R. Rahman, Harris Jayaraj, Anirudh Ravichander and more",
    image: "/images/love.jpg",
    src: "/songs/Nenjukkul-Peidhidum.mp3",
  },
  { title: "AR Rahman", artist: "A.R. Rahman", image: "/images/AR Rahman.jpg", src: "/songs/Nadhiye Nadhiye.mp3" },
  { title: "Kuthu Paatu", artist: "Anirudh Ravichander", image: "/images/anirudh.jpg", src: "/songs/Hukum.mp3" },
  { title: "Melody Mix", artist: "G V Prakash", image: "/images/gv.jpg", src: "/songs/Pirai-Thedum.mp3" },
  { title: "90s Refreshment", artist: "S.P.Balasubramaniyam", image: "/images/spb.jpg", src: "/songs/Kadhal-Rojave.mp3" },
];

const likedAlbums = [
  { title: "Amaran", image: "/images/amaran.jpg", src: "/songs/Uyirey.mp3" },
  { title: "Sita Ramam", image: "/images/sitaramam.jpg", src: "/songs/Kurumugil.mp3" },
  { title: "Vaaranam Aayiram", image: "/images/vaaranam.jpeg", src: "/songs/Nenjukkul-Peidhidum.mp3" },
  { title: "Love Wall", image: "/images/love.jpg", src: "/songs/Hukum.mp3" },
];

export default function Home() {
  const allSongs = useMemo(() => [...dailyMixes, ...likedAlbums], []);
  const [query, setQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [favorites, setFavorites] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allSongs;
    return allSongs.filter((s) => `${s.title} ${s.artist ?? ""}`.toLowerCase().includes(q));
  }, [allSongs, query]);

  const currentSong = currentIndex >= 0 ? allSongs[currentIndex] : null;

  function playAt(index) {
    setCurrentIndex(index);
    // wait for state to set then play
    setTimeout(() => {
      if (audioRef.current) {
        const el = audioRef.current;
        el.src = allSongs[index].src;
        el.load();
        el.play();
        setIsPlaying(true);
      }
    }, 0);
  }

  function togglePlay() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
    } else {
      el.pause();
    }
  }

  function playPrev() {
    if (currentIndex > 0) playAt(currentIndex - 1);
  }

  function playNext() {
    if (currentIndex < allSongs.length - 1) playAt(currentIndex + 1);
  }

  function toggleFavorite(title) {
    setFavorites((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]));
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
    const onEnded = () => {
      // auto-advance to next
      if (currentIndex < allSongs.length - 1) {
        playNext();
      } else {
        setIsPlaying(false);
      }
    };
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("ended", onEnded);
    };
  }, [currentIndex, allSongs.length]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-60 bg-black p-5 flex flex-col">
          <h2 className="mb-5 text-[#1db954] text-xl font-semibold">MySpotify</h2>
          <button className="mb-5 px-4 py-2 bg-[#1db954] text-black rounded">+ New Playlist</button>
          <div className="library text-sm">
            <h3 className="mb-2 text-base">Your Library</h3>
            <ul className="mb-5 space-y-1 text-[#ccc]">
              <li>Liked Songs</li>
              <li>My Own</li>
            </ul>
            <h4 className="mt-2 mb-1 text-base">Artists</h4>
            <ul className="space-y-1 text-[#ccc]">
              <li>Yuvan Shankar Raja</li>
              <li>Hiphop Tamizha</li>
            </ul>
          </div>
        </aside>

        <main className="flex-1 p-5 overflow-y-auto">
          <header className="flex items-center justify-between mb-5">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="What do you want to play?"
              className="px-4 py-2 w-3/5 rounded-full border-0 bg-[#282828] text-white outline-none"
            />
            <div className="bg-[#1db954] text-black w-9 h-9 rounded-full flex items-center justify-center font-bold">V</div>
          </header>

          <div className="flex gap-2 mb-5">
            <button className="px-4 py-2 rounded-full bg-[#1db954] text-black">All</button>
            <button className="px-4 py-2 rounded-full bg-[#333]">Music</button>
            <button className="px-4 py-2 rounded-full bg-[#333]">Podcasts</button>
          </div>

          <section className="mb-8">
            <h3 className="mb-3">Made for <span className="font-semibold">Vivek 😎😎😎</span></h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-5">
              {dailyMixes.map((mix, i) => (
                <div key={mix.title} className="bg-[#181818] rounded hover:bg-[#282828] cursor-pointer overflow-hidden" onClick={() => (mix.title === "2k Love Melodies" ? null : playAt(i))}>
                  {mix.title === "2k Love Melodies" ? (
                    <Link href={{ pathname: "/playlist/2k-love-melodies" }}>
                      <img src={mix.image} alt={mix.title} className="w-full h-40 object-cover" />
                      <div className="p-3">
                        <strong className="block mb-1">{mix.title}</strong>
                        <p className="text-sm text-[#aaa]">{mix.artist}</p>
                      </div>
                    </Link>
                  ) : (
                    <>
                      <img src={mix.image} alt={mix.title} className="w-full h-40 object-cover" />
                      <div className="p-3">
                        <strong className="block mb-1">{mix.title}</strong>
                        <p className="text-sm text-[#aaa]">{mix.artist}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h3 className="mb-3">Albums featuring songs you like</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-5">
              {likedAlbums.map((album, idx) => (
                <div key={album.title} className="bg-[#181818] rounded hover:bg-[#282828] cursor-pointer overflow-hidden" onClick={() => playAt(dailyMixes.length + idx)}>
                  <img src={album.image} alt={album.title} className="w-full h-40 object-cover" />
                  <div className="p-3">
                    <strong className="block mb-1">{album.title}</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <footer className="h-[70px] bg-black border-t border-[#222] flex items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <button onClick={playPrev} className="text-white text-xl"><FaBackward /></button>
          <button onClick={togglePlay} className="text-white text-xl">{isPlaying ? <FaPause /> : <FaPlay />}</button>
          <button onClick={playNext} className="text-white text-xl"><FaForward /></button>
          <button onClick={() => currentSong && toggleFavorite(currentSong.title)} className="text-white text-xl">
            {currentSong && favorites.includes(currentSong.title) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
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
