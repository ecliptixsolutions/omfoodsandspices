"use client";
import {useState} from "react";
export function BlogShare({title}:{title:string}){const [message,setMessage]=useState("");async function share(){try{if(navigator.share)await navigator.share({title,url:window.location.href});else{await navigator.clipboard.writeText(window.location.href);setMessage("Link copied");}}catch{setMessage("Use your browser to copy this page's address.");}}return <div className="flex items-center gap-3"><button type="button" className="btn btn-outline" onClick={share}>Share article ↗</button><span role="status">{message}</span></div>;}
