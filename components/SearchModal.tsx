import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void; 
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate.push(`/search?q=${searchQuery}`);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle clicks outside the search box
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus the input when modal opens
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div 
        ref={modalRef}
        className="shadow-sm"
        style={{
          width: '800px',
          maxWidth: '90%',
          position: 'relative',
          backgroundColor: 'var(--vr--msg--box--bg, rgba(255, 255, 255, 0.9))',
          backgroundImage: 'linear-gradient(180deg, var(--vr--msg--box--bg, rgba(255, 255, 255, 0.9)) 0%, rgba(255, 255, 255, 1) 100%, rgb(224 192 192) 100%)',
          borderRadius: '4px',
          padding: '0.7rem',
          display: 'flex',
          alignItems: 'center',
          minHeight: '1px',
          flex: '0.5 0.5 auto'
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Start typing here.."
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            height: '50px',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '16px',
            outline: 'none',
            padding: '0 40px 0 0'
          }}
        />
        <div 
          onClick={handleSearch}
          style={{
            position: 'absolute',
            right: '16px',
            cursor: 'pointer'
          }}
        >
          <Search color="#ea384c" size={24} />
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
