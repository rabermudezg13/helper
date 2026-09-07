'use client';

import { useState } from 'react';
import { Check, CheckCircle2, ChevronLeft, ChevronRight, CircleHelp, ClipboardCheck, ExternalLink, KeyRound, Mail, Menu, Pencil, Search, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';

const steps = [
  { label: 'Antes de comenzar', icon: UserCheck },
  { label: 'Primer correo', icon: Mail },
  { label: 'Paperwork inicial', icon: ClipboardCheck },
  { label: 'Correo de acceso', icon: KeyRound },
  { label: 'Entrar al portal', icon: ShieldCheck },
  { label: 'My Stuff', icon: Pencil },
];

const emailTerms = ['First Steps with Kelly', 'Your paperwork is waiting'];

export default function Home() {
  const [step, setStep] = useState(0);
  const [questionsDone, setQuestionsDone] = useState(false);
  const [recruiterKnown, setRecruiterKnown] = useState(false);
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);

  const go = (next: number) => { setStep(Math.max(0, Math.min(next, steps.length - 1))); setAnswer(null); };
  const canContinue = step !== 0 || (questionsDone && recruiterKnown);
  const helper = answer === 'no'
    ? 'No te preocupes. Avísale a un representante y vuelve a intentarlo cuando recibas el correo.'
    : step === 0 ? 'Primero confirmemos que tienes todo listo.'
    : step < 4 ? 'Busca también en Spam o Correo no deseado.'
    : 'Sigue cada paso en orden. Yo me quedo aquí contigo.';

  return <main className="min-h-screen bg-background text-foreground">
    <header className="topbar">
      <div className="brand-mark">✎</div><div className="brand-copy"><strong>Sub Helper</strong><span>Tu incorporación, paso a paso</span></div>
      <div className="topbar-actions"><span className="autosave"><Check size={14}/> Progreso guardado</span><Button variant="outline" className="help-button"><CircleHelp/> Ayuda</Button><Button variant="ghost" size="icon" className="mobile-menu" aria-label="Abrir menú"><Menu/></Button></div>
    </header>

    <div className="app-shell">
      <aside className="step-sidebar">
        <div className="sidebar-heading"><span>Primeros pasos con Kelly</span><strong>Paso {step + 1} de {steps.length}</strong></div>
        <nav aria-label="Progreso de incorporación">{steps.map((item,index)=>{const Icon=item.icon;return <button key={item.label} className={`step-item ${index===step?'active':''} ${index<step?'complete':''}`} onClick={()=>go(index)}><span className="step-icon">{index<step?<Check size={18}/>:<Icon size={18}/>}</span><span>{item.label}</span></button>})}</nav>
        <div className="sidebar-tip"><Sparkles size={18}/><p><strong>Consejo de Lapi</strong>Nunca compartas tu nueva contraseña. Kelly solo te entrega una clave temporal.</p></div>
      </aside>

      <section className="workspace onboarding-workspace">
        <div className="mobile-progress"><span>Paso {step + 1} de {steps.length}</span><Progress value={((step+1)/steps.length)*100}/></div>
        <div className="form-column onboarding-column">
          <div className="eyebrow"><Sparkles size={15}/> Lapi te guía</div>
          <h1>{steps[step].label}</h1>
          <p className="intro">Completa esta verificación antes de avanzar al siguiente paso.</p>

          <div className="form-card onboarding-card">
            {step===0&&<div className="checklist-screen">
              <h2>¿Ya estás listo para comenzar?</h2><p>Confirma estas dos preguntas:</p>
              <label className="big-check"><Checkbox checked={questionsDone} onCheckedChange={v=>setQuestionsDone(v===true)}/><span><strong>¿Ya contestaste las preguntas iniciales?</strong><small>Las preguntas que te envió el equipo de reclutamiento.</small></span></label>
              <label className="big-check"><Checkbox checked={recruiterKnown} onCheckedChange={v=>setRecruiterKnown(v===true)}/><span><strong>¿Ya sabes quién es tu reclutador?</strong><small>Ten su nombre o información de contacto a la mano.</small></span></label>
            </div>}

            {step===1&&<DecisionScreen icon={<Search/>} title="Revisa tu correo electrónico" description="Busca un mensaje que tenga uno de estos asuntos:" terms={emailTerms} question="¿Encontraste el correo?" answer={answer} setAnswer={setAnswer}/>} 

            {step===2&&<DecisionScreen icon={<CheckCircle2/>} title="Completa el paperwork del enlace" description="Abre el enlace del correo, llena toda la información solicitada y envíala. Al terminar debes ver un mensaje de confirmación." question="¿Ya viste el mensaje de Congratulations?" answer={answer} setAnswer={setAnswer}/>} 

            {step===3&&<DecisionScreen icon={<Mail/>} title="Busca el segundo correo" description="Después de completar el primer paperwork, revisa tu bandeja de entrada otra vez. Busca un correo enviado por:" terms={['Kelly I-9', 'GryphonHR']} question="¿Recibiste el correo y tienes el enlace?" answer={answer} setAnswer={setAnswer}/>} 

            {step===4&&<div className="instruction-screen">
              <span className="instruction-icon"><KeyRound/></span><h2>Abre el enlace e inicia sesión</h2><ol><li><span>1</span><p><strong>Usuario</strong>Ingresa tu dirección de correo electrónico.</p></li><li><span>2</span><p><strong>Contraseña temporal</strong>Usa la clave temporal indicada por Kelly o por tu representante.</p></li><li><span>3</span><p><strong>Crea una contraseña nueva</strong>El sistema te pedirá primero la clave temporal y después una clave personal.</p></li></ol><div className="security-note"><ShieldCheck/><span><strong>Importante:</strong> no reutilices la clave temporal ni compartas tu nueva contraseña.</span></div>
            </div>}

            {step===5&&<div className="instruction-screen final-screen">
              <span className="instruction-icon"><Pencil/></span><h2>Ve a “My Stuff”</h2><p>Dentro del portal, abre <strong>My Stuff</strong> y busca el ícono del lápiz pequeño para editar tu información.</p><div className="path-visual"><span>My Stuff</span><ChevronRight/><span className="pencil-target"><Pencil/> Lápiz</span><ChevronRight/><span>Completar información</span></div><div className="ready-message"><CheckCircle2/><div><strong>¡Ya puedes comenzar!</strong><span>Llena cada sección y guarda tus cambios antes de salir.</span></div></div>
            </div>}

            {answer==='no'&&<div className="representative-box"><CircleHelp/><div><strong>Este correo todavía no ha llegado</strong><p>Informa a uno de nuestros representantes para que pueda verificar tu proceso. También revisa Spam y Correo no deseado.</p><Button variant="outline" onClick={()=>setAnswer(null)}>Volver a revisar</Button></div></div>}
          </div>

          <div className="form-actions"><Button variant="outline" disabled={step===0} onClick={()=>go(step-1)}><ChevronLeft/> Atrás</Button><Button className="continue-button" disabled={!canContinue || answer==='no'} onClick={()=>go(step+1)}>{step===steps.length-1?'Empezar a llenar':'Siguiente'} <ChevronRight/></Button></div>
        </div>

        <aside className="mascot-panel" aria-live="polite"><div className="speech-bubble">{helper}</div><div className="mascot-halo"><img src="/lapi.png" alt="Lapi, la mascota lápiz de Sub Helper"/></div><div className="mascot-name"><strong>Lapi</strong><span>Tu ayudante de incorporación</span></div></aside>
      </section>
    </div>
  </main>;
}

function DecisionScreen({icon,title,description,terms=[],question,answer,setAnswer}:{icon:React.ReactNode;title:string;description:string;terms?:string[];question:string;answer:'yes'|'no'|null;setAnswer:(value:'yes'|'no')=>void}) {
  return <div className="decision-screen"><span className="instruction-icon">{icon}</span><h2>{title}</h2><p>{description}</p>{terms.length>0&&<div className="search-terms">{terms.map(term=><span key={term}><Mail size={16}/>{term}</span>)}</div>}<div className="decision-question"><strong>{question}</strong><div><Button variant={answer==='yes'?'default':'outline'} onClick={()=>setAnswer('yes')}><Check/> Sí, lo encontré</Button><Button variant={answer==='no'?'destructive':'outline'} onClick={()=>setAnswer('no')}>No, todavía no</Button></div></div></div>;
}
