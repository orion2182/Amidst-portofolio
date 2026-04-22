import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 fade-in">
      <pre className="font-mono text-accent/20 text-[10px] sm:text-xs leading-tight mb-8 hidden sm:block select-none">
{`
 ██╗  ██╗ ██████╗ ██╗  ██╗
 ██║  ██║██╔═══██╗██║  ██║
 ███████║██║   ██║███████║
 ╚════██║██║   ██║╚════██║
      ██║╚██████╔╝     ██║
      ╚═╝ ╚═════╝      ╚═╝
`}
      </pre>
      
      <div className="bg-bg2/80 border border-pink/30 p-6 mb-8 font-mono text-sm inline-block">
        <p className="text-pink mb-1">$ curl -I /requested/resource</p>
        <p className="text-muted text-xs mb-1">HTTP/1.1 404 Not Found</p>
        <p className="text-muted text-xs">X-Error: RESOURCE_NOT_LOCATED</p>
      </div>

      <h1 className="text-5xl md:text-7xl font-black font-space text-text mb-4 uppercase tracking-tighter glitch-text" data-text="ACCESS_DENIED">
        ACCESS_DENIED
      </h1>
      <p className="text-muted font-mono text-sm uppercase tracking-widest mb-8 max-w-md">
        The requested resource could not be located in the system.
      </p>

      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 bg-accent text-bg font-mono font-bold text-sm uppercase tracking-widest hover:bg-accent/20 hover:text-accent border border-accent transition-all cursor-none"
      >
        RETURN_HOME
      </Link>

      <p className="mt-12 font-mono text-muted/30 text-[10px] uppercase tracking-widest">
        ERROR_CODE: 0x00000194 // SECTOR_NOT_FOUND
      </p>
    </div>
  );
}
