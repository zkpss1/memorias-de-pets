import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import QRCode from 'qrcode.react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { calculateTimeDifference, formatTimeDifference } from '../../utils/timeUtils';
import { generatePetVisualizationUrl, downloadQRCode } from '../../utils/qrCode';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function PetMemory() {
  const router = useRouter();
  const { id } = router.query;
  
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeDiff, setTimeDiff] = useState<any>(null);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    const fetchPetData = async () => {
      if (!id) return;
      
      try {
        const q = query(collection(db, 'pets'), where('id', '==', id));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setError('Pet memory not found');
          setLoading(false);
          return;
        }
        
        const petData = querySnapshot.docs[0].data();
        setPet(petData);
        
        // Calculate time difference if createdAt exists
        if (petData.createdAt) {
          const creationTime = petData.createdAt.toMillis();
          const diff = calculateTimeDifference(creationTime);
          setTimeDiff(diff);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching pet data:', err);
        setError('Failed to load pet memory');
        setLoading(false);
      }
    };
    
    fetchPetData();
  }, [id]);

  const handleDownloadQRCode = () => {
    if (pet) {
      downloadQRCode(pet.id, pet.name);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pet memory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{error}</h1>
          <p className="text-gray-600 mb-6">We couldn't find the pet memory you're looking for.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!pet) return null;

  const shareUrl = generatePetVisualizationUrl(pet.id);
  const shareTitle = `Remembering ${pet.name} - Pet Memory`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <Head>
        <title>{pet.name} | Pet Memory App</title>
        <meta name="description" content={`Memorial page for ${pet.name}`} />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-indigo-700 mb-2">{pet.name}</h1>
                <div className="flex items-center text-gray-600">
                  <span className="mr-4">{pet.type}</span>
                  {pet.birthDate && (
                    <span>Born: {new Date(pet.birthDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              
              {timeDiff && (
                <div className="mt-4 md:mt-0 bg-indigo-100 px-4 py-2 rounded-lg">
                  <p className="text-sm text-indigo-700 font-medium">Memory created:</p>
                  <p className="text-indigo-800">{formatTimeDifference(timeDiff)} ago</p>
                </div>
              )}
            </div>
            
            <div className="mb-8">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                className="rounded-xl overflow-hidden"
              >
                {pet.images.map((imageUrl: string, index: number) => (
                  <SwiperSlide key={index}>
                    <div className="aspect-w-16 aspect-h-9">
                      <img 
                        src={imageUrl} 
                        alt={`${pet.name} - image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">About {pet.name}</h2>
              <p className="text-gray-700 whitespace-pre-line">{pet.description}</p>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Share this memory</h3>
                  <div className="flex space-x-2">
                    <FacebookShareButton url={shareUrl} quote={shareTitle}>
                      <FacebookIcon size={40} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={shareUrl} title={shareTitle}>
                      <TwitterIcon size={40} round />
                    </TwitterShareButton>
                    <WhatsappShareButton url={shareUrl} title={shareTitle}>
                      <WhatsappIcon size={40} round />
                    </WhatsappShareButton>
                  </div>
                </div>
                
                <div>
                  <button
                    onClick={() => setShowQRCode(!showQRCode)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mb-2 w-full"
                  >
                    {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
                  </button>
                  
                  {showQRCode && (
                    <div className="text-center mt-4">
                      <div className="inline-block bg-white p-4 rounded-lg shadow-md">
                        <QRCode
                          id="qr-code"
                          value={generatePetVisualizationUrl(pet.id)}
                          size={150}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                      <button
                        onClick={handleDownloadQRCode}
                        className="mt-2 px-4 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
                      >
                        Download QR Code
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}
