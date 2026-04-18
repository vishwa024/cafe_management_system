import { Link } from 'react-router-dom';

export default function CustomerFooter() {
  return (
    <footer className="bg-[#3f3328] text-white/60 py-8 mt-8">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
          <Link to="/dashboard" className="text-sm hover:text-white transition-colors">Home</Link>
          <Link to="/menu" className="text-sm hover:text-white transition-colors">Menu</Link>
          <Link to="/orders" className="text-sm hover:text-white transition-colors">Orders</Link>
          <Link to="/profile" className="text-sm hover:text-white transition-colors">Profile</Link>
          <Link to="/settings" className="text-sm hover:text-white transition-colors">Settings</Link>
        </div>
        <p className="text-sm">@ {new Date().getFullYear()} Roller Coaster Cafe. All rights reserved.</p>
      </div>
    </footer>
  );
}
