"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, DatabaseBackup, Download, HardDrive, Save, Server } from "lucide-react";
import AppShell from "../../../components/layout/AppShell";
import PageHeader from "../../../components/ui/PageHeader";
import { api, API_URL } from "../../../lib/api";
import { useUI } from "../../../components/providers/Providers";

const defaults = { mode:"manual", retentionDays:"14", remoteType:"sftp", host:"", port:"22", username:"", password:"", remotePath:"/backups/reelmanager", schedule:"daily" };

export default function BackupSettingsPage(){
  const { toast, lang } = useUI();
  const [form,setForm]=useState(defaults);
  const [loading,setLoading]=useState(false);
  const [testing,setTesting]=useState(false);
  useEffect(()=>{setForm({...defaults,...JSON.parse(localStorage.getItem('reelmanager_backup_settings')||'{}')});},[]);
  function setField(k,v){setForm(p=>({...p,[k]:v}));}
  function save(){localStorage.setItem('reelmanager_backup_settings',JSON.stringify(form)); toast(lang==='tr'?'Yedekleme ayarları kaydedildi':'Backup settings saved','success');}

  function validateRemote(){
    if(!form.remoteType) return lang==='tr'?'Uzak aktarım tipi seçilmelidir.':'Remote transfer type is required.';
    if(!form.host?.trim()) return lang==='tr'?'Host alanı boş bırakılamaz.':'Host is required.';
    if(!form.port || Number(form.port)<=0) return lang==='tr'?'Geçerli bir port giriniz.':'Enter a valid port.';
    if(!form.username?.trim()) return lang==='tr'?'Kullanıcı adı boş bırakılamaz.':'Username is required.';
    if(!form.remotePath?.trim()) return lang==='tr'?'Uzak klasör yolu boş bırakılamaz.':'Remote path is required.';
    return null;
  }

  async function exportDb(format='sql'){
    setLoading(true);
    try{
      const token=localStorage.getItem('reel-token')||localStorage.getItem('token')||localStorage.getItem('auth_token');
      const url=`${API_URL}/settings/backup/export?format=${encodeURIComponent(format)}`;
      const r=await fetch(url,{headers:{Authorization:`Bearer ${token}`}});
      if(!r.ok){ const text=await r.text().catch(()=>""); throw new Error(text || 'Export failed'); }
      const blob=await r.blob();
      const a=document.createElement('a');
      a.href=URL.createObjectURL(blob);
      a.download=`reelmanager-backup-${new Date().toISOString().slice(0,10)}.${format==='sql'?'sql':'json'}`;
      a.click(); URL.revokeObjectURL(a.href);
      toast(format==='sql' ? (lang==='tr'?'SQL yedeği indirildi':'SQL backup downloaded') : (lang==='tr'?'JSON yedeği indirildi':'JSON backup downloaded'),'success');
    }catch(e){toast(lang==='tr'?'Yedek indirilemedi. Backend bağlantısını ve yetkinizi kontrol edin.':'Backup export failed. Check backend connection and permission.','error')}
    finally{setLoading(false)}
  }
  async function testRemote(){
    const validation = validateRemote();
    if(validation){ toast(validation,'error'); return; }
    setTesting(true);
    try{
      const r = await api.post('/settings/backup/test', form);
      const msg = r?.data?.data?.message || r?.data?.message;
      toast(msg || (lang==='tr'?'Uzak hedef ayarı kontrol edildi':'Remote target checked'), r?.data?.data?.reachable ? 'success' : 'warning');
    }catch(e){toast(lang==='tr'?'Bağlantı testi başarısız. Host, port ve kullanıcı bilgilerini kontrol edin.':'Connection test failed. Check host, port and credentials.','error')}
    finally{setTesting(false)}
  }
  return <AppShell><PageHeader eyebrow="ReelManager - Backup Center" title={lang==='tr'?'Yedekleme ve Uzak Aktarım':'Backup and Remote Transfer'} description={lang==='tr'?'Database yedeklerini SQL veya JSON olarak dışa aktarın; uzak FTP/SFTP hedeflerinizi kontrollü şekilde yönetin.':'Export database backups as SQL or JSON and manage remote FTP/SFTP destinations with controlled validation.'} actions={<Link className="btn-ghost" href="/settings"><ArrowLeft className="h-4 w-4"/>{lang==='tr'?'Ayarlar':'Settings'}</Link>}/><div className="grid gap-6 xl:grid-cols-[1fr_420px]"><section className="page-card p-5 sm:p-6"><h2 className="mb-2 text-xl font-semibold">{lang==='tr'?'Uzak Aktarım Hedefi':'Remote Transfer Target'}</h2><p className="mb-5 text-sm leading-6 text-slate-500 dark:text-slate-400">{lang==='tr'?'Bağlantı testi, eksik bilgi olduğunda uyarı verir. Canlı FTP/SFTP aktarımı için sunucu tarafı adaptör aktif olmalıdır.':'The connection test warns when required data is missing. Production FTP/SFTP transfer requires server-side adapter configuration.'}</p><div className="grid gap-4 md:grid-cols-2"><Select label={lang==='tr'?'Yedekleme modu':'Backup mode'} value={form.mode} onChange={v=>setField('mode',v)} options={[["manual",lang==='tr'?'Manuel':'Manual'],["daily",lang==='tr'?'Günlük':'Daily'],["weekly",lang==='tr'?'Haftalık':'Weekly']]}/><Select label={lang==='tr'?'Uzak aktarım tipi':'Remote type'} value={form.remoteType} onChange={v=>setField('remoteType',v)} options={[["sftp","SFTP"],["ftp","FTP"]]}/><Field label="Host" value={form.host} onChange={v=>setField('host',v)}/><Field label="Port" value={form.port} onChange={v=>setField('port',v)}/><Field label={lang==='tr'?'Kullanıcı adı':'Username'} value={form.username} onChange={v=>setField('username',v)}/><Field label={lang==='tr'?'Parola / Key':'Password / Key'} type="password" value={form.password} onChange={v=>setField('password',v)}/><Field label={lang==='tr'?'Uzak klasör':'Remote path'} value={form.remotePath} onChange={v=>setField('remotePath',v)}/><Field label={lang==='tr'?'Saklama süresi (gün)':'Retention days'} value={form.retentionDays} onChange={v=>setField('retentionDays',v)}/></div><div className="mt-6 flex flex-wrap justify-end gap-3"><button className="btn-ghost" onClick={testRemote} disabled={testing}><Server className="h-4 w-4"/>{testing?(lang==='tr'?'Test ediliyor...':'Testing...'):(lang==='tr'?'Bağlantıyı Test Et':'Test Connection')}</button><button className="btn-primary" onClick={save}><Save className="h-4 w-4"/>{lang==='tr'?'Ayarları Kaydet':'Save Settings'}</button></div></section><aside className="page-card p-5 sm:p-6"><HardDrive className="mb-4 h-8 w-8 text-brand-600"/><h2 className="text-xl font-semibold">{lang==='tr'?'Tam Database Yedeği':'Full Database Backup'}</h2><p className="mt-2 text-[15px] leading-7 text-slate-600 dark:text-slate-300">{lang==='tr'?'Kategoriler, komponentler, stok hareketleri, projeler, BOM, kullanıcılar, ayarlar ve aktivite loglarını dışa aktarın.':'Export categories, components, stock movements, projects, BOM, users, settings and activity logs.'}</p><button className="btn-primary mt-5 w-full" onClick={()=>exportDb('sql')} disabled={loading}><DatabaseBackup className="h-4 w-4"/>{loading?(lang==='tr'?'Hazırlanıyor...':'Preparing...'):(lang==='tr'?'SQL Yedeği İndir':'Download SQL Backup')}</button><button className="btn-ghost mt-3 w-full" onClick={()=>exportDb('json')} disabled={loading}><Download className="h-4 w-4"/>{lang==='tr'?'JSON Yedeği İndir':'Download JSON Backup'}</button></aside></div></AppShell>}
function Field({label,value,onChange,type='text'}){return <label className="block"><span className="field-label">{label}</span><input type={type} className="input" value={value||''} onChange={e=>onChange(e.target.value)}/></label>}
function Select({label,value,onChange,options}){return <label className="block"><span className="field-label">{label}</span><select className="input" value={value} onChange={e=>onChange(e.target.value)}>{options.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>}
