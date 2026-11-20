"use client";

export default function BlogError({reset}:{reset:()=>void}) {
  return <section className="section section-paper"><div className="container-x py-16"><p className="eyebrow">Insights &amp; Updates</p><h1 className="h-section my-6">Our articles are temporarily unavailable.</h1><p className="mb-8">We’re having trouble reaching our content service. Please try again shortly.</p><button className="btn btn-primary" onClick={reset}>Try again</button><a className="btn btn-outline ml-4" href="/">Back to home</a></div></section>;
}
