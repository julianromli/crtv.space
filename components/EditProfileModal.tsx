import { X } from 'lucide-react';
import { useState, useRef } from 'react';

interface Profile {
  name: string;
  username: string;
  avatar: string;
  bio: string;
}

interface EditProfileModalProps {
  profile: Profile;
  onSave: (profile: Profile) => void;
  onClose: () => void;
}

export default function EditProfileModal({ profile, onSave, onClose }: EditProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [bio, setBio] = useState(profile.bio || '');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate upload by setting a new random image
      setAvatar(`https://picsum.photos/seed/${Math.random()}/200/200`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1E1E1E] w-full max-w-xl rounded-2xl shadow-2xl border border-[#2D2D2D] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[#2D2D2D]">
          <h2 className="text-lg font-semibold text-[#F3F4F6]">Edit Profile</h2>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <label className="sm:w-1/3 text-sm font-semibold text-[#9CA3AF]">Name</label>
            <div className="sm:w-2/3">
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#121212] border border-[#2D2D2D] rounded-md text-sm text-[#F3F4F6] focus:outline-none focus:border-[#F04E2E]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <label className="sm:w-1/3 text-sm font-semibold text-[#9CA3AF]">Username</label>
            <div className="sm:w-2/3 flex items-center">
              <span className="px-3 py-2 bg-[#2D2D2D] border border-[#2D2D2D] border-r-0 rounded-l-md text-sm text-[#9CA3AF]">crtv.space/</span>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-[#121212] border border-[#2D2D2D] rounded-r-md text-sm text-[#F3F4F6] focus:outline-none focus:border-[#F04E2E]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
            <label className="sm:w-1/3 text-sm font-semibold text-[#9CA3AF] pt-2">Bio</label>
            <div className="sm:w-2/3">
              <textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-[#121212] border border-[#2D2D2D] rounded-md text-sm text-[#F3F4F6] focus:outline-none focus:border-[#F04E2E] resize-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <label className="sm:w-1/3 text-sm font-semibold text-[#9CA3AF]">Profile photo</label>
            <div className="sm:w-2/3 flex items-center gap-4">
              <img src={avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover border border-[#2D2D2D]" />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-transparent border border-[#2D2D2D] rounded-md text-sm font-semibold text-[#F3F4F6] hover:bg-[#2D2D2D] transition-colors"
              >
                Click to replace
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>

        </div>
        <div className="p-5 border-t border-[#2D2D2D] flex justify-end gap-3 bg-[#1A1A1A]">
          <button onClick={onClose} className="px-4 py-2 rounded-md text-sm font-semibold text-[#F3F4F6] hover:bg-[#2D2D2D] transition-colors">
            Cancel
          </button>
          <button 
            onClick={() => onSave({ name, username, avatar, bio })}
            className="px-4 py-2 bg-[#F04E2E] hover:bg-[#E03E00] text-white rounded-md text-sm font-semibold transition-colors"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
