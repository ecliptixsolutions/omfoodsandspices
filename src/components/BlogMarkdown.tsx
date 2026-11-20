import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {headingId} from "@/lib/blog";
export function BlogMarkdown({content}:{content:string}){
 return <div className="blog-prose"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{
  h1:({children})=><h2>{children}</h2>,
  h2:({children})=><h2 id={headingId(String(children))}>{children}</h2>,
  h3:({children})=><h3>{children}</h3>,
  img:({src,alt})=>typeof src==="string"&&/^\/(?!\/)/.test(src)?<figure><img src={src} alt={alt||"Article illustration"} width={1200} height={800} loading="lazy"/><figcaption>{alt}</figcaption></figure>:null,
  table:({children})=><div className="overflow-x-auto"><table>{children}</table></div>,
  a:({href,children})=><a href={href} {...(href?.startsWith("https://")?{target:"_blank",rel:"noopener noreferrer"}:{})}>{children}</a>,
 }}>{content}</ReactMarkdown></div>;
}
