import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { LoadingContext } from '../context/LoadingContext';

const Partners = () => {
  const context = useContext(AppContext);
  const loadingContext = useContext(LoadingContext);

  if (!context) return null;

  const { partners, fetchPartners } = context;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Partners</h1>
      <button 
        className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
        onClick={() => {
          loadingContext?.showLoading(); 
          fetchPartners(); 
        }}
      >
        Refresh Partners
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partners.map((partner) => (
          <div key={partner._id} className="border p-4 rounded-lg">
            <h2 className="font-bold">{partner.name}</h2>
            <p>{partner.email}</p>
            <p>Status: {partner.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partners;
