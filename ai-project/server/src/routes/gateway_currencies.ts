import { Router } from 'express';
import { supabase } from '../supabaseClient';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('gateway_currencies')
      .select('*');
    
    if (error) throw error;
    
    res.json({ success: true, gateway_currencies: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('gateway_currencies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, gateway_currency: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;