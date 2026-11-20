"use client";
import {useEffect,useState,type RefObject} from "react";

/** Keep timers asleep outside the viewport, in background tabs and for reduced motion. */
export function useCarouselMotion(ref:RefObject<HTMLElement|null>){
 const [playing,setPlaying]=useState(false);
 useEffect(()=>{
  const element=ref.current;if(!element)return;
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");let visible=false;
  const sync=()=>setPlaying(visible&&!document.hidden&&!media.matches);
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});
  observer.observe(element);document.addEventListener("visibilitychange",sync);media.addEventListener("change",sync);
  return()=>{observer.disconnect();document.removeEventListener("visibilitychange",sync);media.removeEventListener("change",sync);};
 },[ref]);
 return playing;
}
export const carouselIndex=(position:number,count:number)=>((position%count)+count)%count;
