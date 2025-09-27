
export default function SimplifiedBackgroundEffects() {
  return (
    <div className="absolute inset-0 opacity-10">
      <div 
        className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
        style={{ animationDuration: '4s' }}
      ></div>
      <div 
        className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
        style={{ animationDuration: '5s' }}
      ></div>
      <div 
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
        style={{ animationDuration: '6s' }}
      ></div>
    </div>
  );
}
