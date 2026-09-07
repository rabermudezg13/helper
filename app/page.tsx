'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, Check, ChevronRight, ClipboardCheck, Clock3, FileText, GraduationCap, Menu, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { saveReportDraft } from '@/lib/firebase';

const steps = [
  { label: 'Información del día', icon: CalendarDays },
  { label: 'Resumen de clases', icon: GraduationCap },
  { label: 'Notas importantes', icon: FileText },
  { label: 'Revisar y enviar', icon: ClipboardCheck },
];

export default function Home() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const helperText = useMemo(() => {
    if (saved) return '¡Borrador guardado! Puedes continuar cuando estés listo.';
    if (!name) return 'Empecemos con tu nombre. Solo tomará unos minutos.';
    if (!school) return 'Muy bien. Ahora indícame la escuela de hoy.';
    if (!date) return 'Ya casi terminamos esta parte: selecciona la fecha.';
    return '¡Primera sección lista! Revisa los datos y continuamos.';
  }, [date, name, saved, school]);

  return <main className="min-h-screen bg-background text-foreground">
    <header className="topbar">
      <div className="brand-mark">✎</div><div className="brand-copy"><strong>Sub Helper</strong><span>Paperwork sin estrés</span></div>
      <div className="topbar-actions"><span className="autosave"><Check size={14}/> Guardado automático</span><Button variant="outline" className="help-button">¿Necesitas ayuda?</Button><Button variant="ghost" size="icon" className="mobile-menu" aria-label="Abrir menú"><Menu/></Button></div>
    </header>
    <div className="app-shell">
      <aside className="step-sidebar">
        <div className="sidebar-heading"><span>Reporte del sustituto</span><strong>Paso {step + 1} de {steps.length}</strong></div>
        <nav aria-label="Progreso del formulario">{steps.map((item,index) => { const Icon=item.icon; const active=index===step; const complete=index<step; return <button key={item.label} className={`step-item ${active?'active':''} ${complete?'complete':''}`} onClick={()=>setStep(index)}><span className="step-icon">{complete?<Check size={18}/>:<Icon size={18}/>}</span><span>{item.label}</span></button>; })}</nav>
        <div className="sidebar-tip"><Sparkles size={18}/><p><strong>Consejo de Lapi</strong>Tu progreso se guarda automáticamente para que puedas regresar después.</p></div>
      </aside>
      <section className="workspace">
        <div className="mobile-progress"><span>Paso {step + 1} de {steps.length}</span><Progress value={((step+1)/steps.length)*100}/></div>
        <div className="form-column">
          <div className="eyebrow"><Clock3 size={15}/> Aproximadamente 3 minutos</div><h1>{steps[step].label}</h1><p className="intro">Comencemos con los datos básicos de tu asignación de hoy.</p>
          <div className="form-card">
            {step===0&&<div className="fields"><div><Label htmlFor="name">Tu nombre completo</Label><Input id="name" value={name} onChange={e=>{setName(e.target.value);setSaved(false)}} placeholder="Ej. María Rodríguez"/></div><div><Label htmlFor="school">Escuela</Label><Input id="school" value={school} onChange={e=>{setSchool(e.target.value);setSaved(false)}} placeholder="Escribe el nombre de la escuela"/></div><div><Label htmlFor="date">Fecha de la asignación</Label><Input id="date" type="date" value={date} onChange={e=>{setDate(e.target.value);setSaved(false)}}/></div></div>}
            {step===1&&<div className="fields"><div><Label htmlFor="classes">¿Cómo transcurrieron las clases?</Label><Textarea id="classes" rows={8} placeholder="Materias cubiertas, actividades completadas y progreso general…"/></div></div>}
            {step===2&&<div className="fields"><div><Label htmlFor="notes">Notas para el maestro</Label><Textarea id="notes" value={notes} onChange={e=>setNotes(e.target.value)} rows={8} placeholder="Estudiantes que destacaron, incidentes, cambios o pendientes…"/></div></div>}
            {step===3&&<div className="review-state"><span><ClipboardCheck size={30}/></span><h2>Tu reporte está casi listo</h2><p>Revisa cada sección desde el menú. Cuando conectemos Firebase, aquí podrás generar el PDF y enviarlo de forma segura.</p></div>}
          </div>
          <div className="form-actions"><Button variant="outline" disabled={saving} onClick={async()=>{setSaving(true);await saveReportDraft({name,school,date,notes,currentStep:step});setSaved(true);setSaving(false)}}>{saving?'Guardando…':'Guardar borrador'}</Button><Button className="continue-button" onClick={()=>setStep(Math.min(step+1,steps.length-1))}>{step===steps.length-1?'Finalizar reporte':'Continuar'} <ChevronRight size={17}/></Button></div>
        </div>
        <aside className="mascot-panel" aria-live="polite"><div className="speech-bubble">{helperText}</div><div className="mascot-halo"><img src="/lapi.png" alt="Lapi, la mascota lápiz de Sub Helper"/></div><div className="mascot-name"><strong>Lapi</strong><span>Tu ayudante de paperwork</span></div></aside>
      </section>
    </div>
  </main>;
}
