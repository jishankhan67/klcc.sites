import { Router } from 'express';
import { supabase } from '../supabaseClient';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('general_settings')
      .select('*')
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, general_settings: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('general_settings')
      .update({
        site_name: req.body.site_name,
        cur_text: req.body.cur_text,
        cur_sym: req.body.cur_sym,
        email_from: req.body.email_from,
        email_template: req.body.email_template,
        sms_body: req.body.sms_body,
        sms_from: req.body.sms_from,
        base_color: req.body.base_color,
        secondary_color: req.body.secondary_color,
        mail_config: req.body.mail_config,
        sms_config: req.body.sms_config,
        global_shortcodes: req.body.global_shortcodes,
        kv: req.body.kv,
        ev: req.body.ev,
        en: req.body.en,
        sv: req.body.sv,
        sn: req.body.sn,
        force_ssl: req.body.force_ssl,
        maintenance_mode: req.body.maintenance_mode,
        secure_password: req.body.secure_password,
        agree: req.body.agree,
        multi_language: req.body.multi_language,
        registration: req.body.registration,
        active_template: req.body.active_template,
        deposit_commission: req.body.deposit_commission,
        plan_subscribe_commission: req.body.plan_subscribe_commission,
        ptc_view_commission: req.body.ptc_view_commission,
        system_info: req.body.system_info,
        registration_bonus: req.body.registration_bonus,
        bt_fixed: req.body.bt_fixed,
        bt_percent: req.body.bt_percent,
        balance_transfer: req.body.balance_transfer,
        default_plan: req.body.default_plan,
        user_ads_post: req.body.user_ads_post,
        ad_auto_approve: req.body.ad_auto_approve,
        ads_setting: req.body.ads_setting,
        socialite_credentials: req.body.socialite_credentials,
        app_url: req.body.app_url,
        status: req.body.status,
      })
      .eq('id', 1)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, general_settings: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;