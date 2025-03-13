import { createPortal } from 'react-dom';
import { useContext } from 'react';
import { LoadingContext } from '../context/LoadingContext';

const Loading = () => {
  const context = useContext(LoadingContext);
  if (!context?.loading) return null;

  return createPortal(
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
    </div>,
    document.body
  );
};

export default Loading;
