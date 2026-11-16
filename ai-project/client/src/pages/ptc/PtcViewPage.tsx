import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Eye, Clock, Math, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface AdDetail {
  id: number;
  title: string;
  ads_body: string;
  amount: number;
  ads_type: string;
  duration: number;
  remain: number;
  max_show: number;
  showed: number;
};

export const PtcViewPage = () => {
  const { adId } = useParams<{ adId: string }>();
  const navigate = useNavigate();

  if (!adId) {
    navigate('/user/ptc');
    return <div>No ad specified</div>;
  }

  const [timer, setTimer] = useState(15);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewResult, setViewResult] = useState<'success' | 'error' | null>(null);

  // Fetch ad detail from Supabase
  const { data: ad, isLoading, isError } = useQuery({
    queryKey: ['ptc-ad', adId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ptcs')
        .select('*')
        .eq('id', parseInt(adId))
        .single();
      if (error) throw error;
      return data as AdDetail;
    },
    enabled: !!adId
  });

  useEffect(() => {
    if (!ad) return;
    const duration = Math.max(ad.duration || 15, 15);
    let remaining = 15;
    setTimer(remaining);
    
    const interval = setInterval(() => {
      remaining--;
      setTimer(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        setShowCaptcha(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [ad]);

  const handleSubmit = () => {
    const correct = 5 + 3;
    if (parseInt(captchaAnswer) === correct) {
      setViewResult('success');
    } else {
      setViewResult('error');
    }
  };

  if (isLoading || !ad) {
    return <div>Loading ad...</div>;
  }

  if (!showCaptcha) {
    return (
      <div>
        <h2>Watch Ad: {ad.title}</h2>
        <p>Timer: {timer}s</p>
        <button onClick={() => setShowCaptcha(true)}>I've watched, show captcha</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Math Captcha</h2>
      <p>Solve: 5 + 3 = ?</p>
      <input 
        value={captchaAnswer} 
        onChange={e => setCaptchaAnswer(e.target.value)} 
      />
      <button onClick={handleSubmit}>Submit</button>
      {viewResult === 'success' && <p>Success!</p>}
      {viewResult === 'error' && <p>Wrong answer</p>}
    </div>
  );
};