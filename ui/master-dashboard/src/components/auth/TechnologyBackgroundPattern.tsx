
export default function TechnologyBackgroundPattern() {
  return (
    <div className="absolute inset-0 opacity-20">
      {/* Simple Grid Pattern */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Static Circuit Pattern */}
      <div className="absolute top-10 right-10 w-64 h-64 opacity-60">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect x="20" y="20" width="160" height="160" fill="none" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1"/>
          <circle cx="20" cy="20" r="3" fill="rgba(59, 130, 246, 0.7)"/>
          <circle cx="180" cy="20" r="3" fill="rgba(59, 130, 246, 0.7)"/>
          <circle cx="180" cy="180" r="3" fill="rgba(59, 130, 246, 0.7)"/>
          <circle cx="20" cy="180" r="3" fill="rgba(59, 130, 246, 0.7)"/>
          <path d="M20 100 L100 100 L100 20" fill="none" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1"/>
          <path d="M180 100 L100 100 L100 180" fill="none" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1"/>
          <circle cx="100" cy="100" r="2" fill="rgba(6, 182, 212, 0.8)"/>
        </svg>
      </div>

      {/* Simple Hexagon */}
      <div className="absolute bottom-20 left-10 w-32 h-32 opacity-50">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="30,5 70,5 90,35 70,65 30,65 10,35" fill="none" stroke="rgba(6, 182, 212, 0.7)" strokeWidth="2"/>
          <polygon points="40,20 60,20 70,35 60,50 40,50 30,35" fill="none" stroke="rgba(6, 182, 212, 0.6)" strokeWidth="1"/>
        </svg>
      </div>

      {/* Network Nodes */}
      <div className="absolute top-1/3 left-1/4 w-40 h-40 opacity-40">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <circle cx="20" cy="20" r="2" fill="rgba(59, 130, 246, 0.8)"/>
          <circle cx="100" cy="20" r="2" fill="rgba(59, 130, 246, 0.8)"/>
          <circle cx="60" cy="60" r="2" fill="rgba(6, 182, 212, 0.9)"/>
          <circle cx="20" cy="100" r="2" fill="rgba(59, 130, 246, 0.8)"/>
          <circle cx="100" cy="100" r="2" fill="rgba(59, 130, 246, 0.8)"/>
          <line x1="20" y1="20" x2="60" y2="60" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1"/>
          <line x1="100" y1="20" x2="60" y2="60" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1"/>
          <line x1="60" y1="60" x2="20" y2="100" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1"/>
          <line x1="60" y1="60" x2="100" y2="100" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1"/>
        </svg>
      </div>

      {/* Additional Tech Elements */}
      <div className="absolute top-1/2 right-1/4 w-24 h-24 opacity-35">
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <rect x="10" y="10" width="60" height="60" fill="none" stroke="rgba(147, 51, 234, 0.6)" strokeWidth="1" strokeDasharray="4,2"/>
          <circle cx="40" cy="40" r="5" fill="none" stroke="rgba(147, 51, 234, 0.7)" strokeWidth="1"/>
          <path d="M25 25 L55 25 M25 55 L55 55 M25 25 L25 55 M55 25 L55 55" stroke="rgba(147, 51, 234, 0.5)" strokeWidth="0.5"/>
        </svg>
      </div>
    </div>
  );
}